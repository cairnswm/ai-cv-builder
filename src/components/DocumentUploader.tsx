import React from 'react';
import { Form } from 'react-bootstrap';

interface DocumentUploaderProps {
  onFileContent: (content: string) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFileContent }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileContent(content);
    };
    reader.readAsText(file);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Import Document</Form.Label>
      <Form.Control
        type="file"
        accept=".txt,.md,.doc,.docx"
        onChange={handleFileUpload}
      />
    </Form.Group>
  );
};

export default DocumentUploader;