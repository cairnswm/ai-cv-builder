import React from 'react';
import { Container } from 'react-bootstrap';
import TiptapEditor from './TiptapEditor';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const About: React.FC = () => {
  const aboutContent = `
<p>This application is designed to help users create and manage their CVs and cover letters efficiently.</p>
<h2>Features</h2>
<ul>
  <li>Generate CVs and cover letters using AI.</li>
  <li>Import and export documents in various formats.</li>
  <li>User-friendly interface with real-time editing capabilities.</li>
</ul>
<h2>How to use</h2>
<ul>
  <li>Add your openAI API Key in the settings (the gear icon)</li>
  <li>Add your CV in the "CV Editor" Tab - this will be kept in local storage so you do not need to load it every time</li>
  <li>Add your name in the header section - also add the company name in the "filename" section - these are used to ensure projects and export filenames are unique</li>
  <li>Add the Job Spec in the "Job Specification" Tab</li>
  <li>To get a customized CV for the job, click the [Generate Optimized CV] button on the "Generated CV" tab. Note this takes quitte a while so be patient</li>
  <li>To get a customized cover letter for the job, click the [Generate Cover Lettewr] button on the "Cover Letter" tab. Note this takes quitte a while so be patient</li>
</ul>
<h2>Projects</h2>
<ul>
<li>use the Export button to save (in json format) the project information locally</li>
<li>use the Import button to load a previously saved project</li>
</ul>
<h2>Exports</h2>
<ul>
<li>Use the PDF, DocX or Markdown buttons to export the Generated CV or Cover Letter</li>
<li><strong>NOTE:</strong> The export buttons will only work if the CV or Cover Letter has been generated</li>
<li><strong>NOTE:</strong> Always read through and verify the output of the CV and cover Letter. AI is know to make up things</li>
</ul>
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: aboutContent,
    editorProps: {
      attributes: {
        class: 'form-control p-3 min-h-[200px] focus:outline-none',
        style: 'min-height: 200px;'
      }
    }
  });

  return (
    <Container className="p-3">
      <h2>About the AI CV Generator</h2>
      <TiptapEditor
        content={aboutContent}
        onChange={() => {}}
        placeholder="About content will appear here..."
        filename="about"
        readOnly={true} // Set readOnly to true
      />
    </Container>
  );
};

export default About;
