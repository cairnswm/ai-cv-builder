import React from 'react';
import DocumentUploader from './DocumentUploader';
import { useCV } from '../context/CVContext';
import TiptapEditor from './TiptapEditor';

const CVEditor: React.FC = () => {
  const { cv, setCV } = useCV();

  return (
    <div className="p-3">
      <h2>CV Editor</h2>
      <DocumentUploader onFileContent={setCV} />
      <div className="mb-3">
        <TiptapEditor
          content={cv}
          onChange={setCV}
          placeholder="Enter your CV content here..."
          filename="cv"
        />
      </div>
    </div>
  );
};

export default CVEditor;