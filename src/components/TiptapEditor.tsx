import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, ButtonGroup } from "react-bootstrap";
import Underline from "@tiptap/extension-underline";
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsListUl,
  BsListOl,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsFilePdf,
  BsFileWord,
  BsMarkdown,
} from "react-icons/bs";
import ExportButtons from "./ExportButtons";

interface TiptapEditorProps {
  readOnly?: boolean; // New prop for read-only mode
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  filename: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder,
  filename,
  readOnly = false,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "form-control p-3 min-h-[200px] focus:outline-none",
        style: "min-height: 200px;",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded">
      {!readOnly && (
        <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
          <ButtonGroup size="sm">
            <Button
              variant="light"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "active" : ""}
              title="Bold"
            >
              <BsTypeBold />
            </Button>
            <Button
              variant="light"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "active" : ""}
              title="Italic"
            >
              <BsTypeItalic />
            </Button>
            <Button
              variant="light"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "active" : ""}
              title="Underline"
            >
              <BsTypeUnderline />
            </Button>
            <Button
              variant="light"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "active" : ""
              }
              title="Heading 1"
            >
              <BsTypeH1 />
            </Button>
            <Button
              variant="light"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "active" : ""
              }
              title="Heading 2"
            >
              <BsTypeH2 />
            </Button>
            <Button
              variant="light"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "active" : ""
              }
              title="Heading 3"
            >
              <BsTypeH3 />
            </Button>
            <Button
              variant="light"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "active" : ""}
              title="Bullet List"
            >
              <BsListUl />
            </Button>
            <Button
              variant="light"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "active" : ""}
              title="Ordered List"
            >
              <BsListOl />
            </Button>
          </ButtonGroup>
          <ExportButtons content={content} filename={filename} iconOnly />
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
