import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { BsFilePdf, BsFileWord, BsMarkdown } from 'react-icons/bs';
import { useCV } from '../context/CVContext';

interface ExportButtonsProps {
  content: string;
  filename: string;
  iconOnly?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ content, filename, iconOnly = false }) => {
  const { userName } = useCV();

  const getFullFilename = (extension: string) => {
    return userName ? `${userName}-${filename}.${extension}` : `${filename}.${extension}`;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save(getFullFilename('pdf'));
  };

  const createTextRun = (text: string, options: { bold?: boolean; italics?: boolean; underline?: boolean } = {}) => {
    return new TextRun({
      text: text.replace(/\s+/g, ' ') || '',
      bold: options.bold || false,
      italics: options.italics || false,
      underline: options.underline ? {} : undefined,
    });
  };

  const processTextWithFormat = (node: Node, format: { bold?: boolean; italics?: boolean; underline?: boolean } = {}): TextRun[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? [createTextRun(text, format)] : [];
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const newFormat = { ...format };

      switch (element.tagName.toLowerCase()) {
        case 'strong':
        case 'b':
          newFormat.bold = true;
          break;
        case 'em':
        case 'i':
          newFormat.italics = true;
          break;
        case 'u':
          newFormat.underline = true;
          break;
      }

      const runs: TextRun[] = [];
      element.childNodes.forEach(child => {
        const childRuns = processTextWithFormat(child, newFormat);
        if (childRuns.length > 0) {
          if (runs.length > 0 && !runs[runs.length - 1].text?.endsWith(' ') && !childRuns[0].text?.startsWith(' ')) {
            runs.push(createTextRun(' ', newFormat));
          }
          runs.push(...childRuns);
        }
      });

      return runs;
    }

    return [];
  };

  const parseHTMLToDocxElements = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements: Paragraph[] = [];

    const processBlock = (node: Node): Paragraph | Paragraph[] | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          return new Paragraph({
            children: [createTextRun(text)],
            spacing: { before: 200, after: 200 },
          });
        }
        return null;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tag = element.tagName.toLowerCase();

        switch (tag) {
          case 'h1':
          case 'h2':
          case 'h3': {
            const children = Array.from(element.childNodes).flatMap(child => 
              processTextWithFormat(child, { bold: true })
            );
            return new Paragraph({
              children,
              heading: tag === 'h1' ? HeadingLevel.HEADING_1 :
                      tag === 'h2' ? HeadingLevel.HEADING_2 :
                      tag === 'h3' ? HeadingLevel.HEADING_3 : undefined,
              spacing: { before: 400, after: 200 },
              alignment: AlignmentType.LEFT,
            });
          }
          case 'p': {
            const children = Array.from(element.childNodes).flatMap(child => 
              processTextWithFormat(child)
            );
            return children.length > 0 ? new Paragraph({
              children,
              spacing: { before: 200, after: 200 },
              alignment: AlignmentType.LEFT,
            }) : null;
          }
          case 'ul':
          case 'ol': {
            return Array.from(element.children).map((li, index) => {
              const bulletPoint = tag === 'ul' ? '• ' : `${index + 1}. `;
              const children = processTextWithFormat(li);
              return new Paragraph({
                children: [
                  createTextRun(bulletPoint),
                  ...(children.length > 0 ? children : [createTextRun(li.textContent || '')])
                ],
                spacing: { before: 120, after: 120 },
                indent: { left: 720, hanging: 360 },
              });
            });
          }
          case 'br':
            return new Paragraph({
              children: [createTextRun('')],
              spacing: { before: 0, after: 0 },
            });
          default: {
            const blocks: (Paragraph | Paragraph[])[] = [];
            element.childNodes.forEach(child => {
              const result = processBlock(child);
              if (result) {
                blocks.push(result);
              }
            });
            return blocks.flat();
          }
        }
      }
      return null;
    };

    const processNodes = (nodes: NodeListOf<ChildNode>) => {
      nodes.forEach(node => {
        const result = processBlock(node);
        if (result) {
          if (Array.isArray(result)) {
            elements.push(...result);
          } else {
            elements.push(result);
          }
        }
      });
    };

    processNodes(doc.body.childNodes);

    return elements;
  };

  const exportDOCX = async () => {
    try {
      const elements = parseHTMLToDocxElements(content);

      const doc = new Document({
        sections: [{
          properties: {},
          children: elements,
        }],
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, getFullFilename('docx'));
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
      alert('Error exporting to DOCX. Please try again.');
    }
  };

  const exportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getFullFilename('md');
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ButtonGroup size={iconOnly ? "sm" : undefined}>
      <Button 
        variant={iconOnly ? "light" : "secondary"} 
        onClick={exportPDF}
        title="Export as PDF"
      >
        <BsFilePdf />
        {!iconOnly && <span className="ms-2">PDF</span>}
      </Button>
      <Button 
        variant={iconOnly ? "light" : "secondary"} 
        onClick={exportDOCX}
        title="Export as DOCX"
      >
        <BsFileWord />
        {!iconOnly && <span className="ms-2">DOCX</span>}
      </Button>
      <Button 
        variant={iconOnly ? "light" : "secondary"} 
        onClick={exportMarkdown}
        title="Export as Markdown"
      >
        <BsMarkdown />
        {!iconOnly && <span className="ms-2">Markdown</span>}
      </Button>
    </ButtonGroup>
  );
};

export default ExportButtons;