import React from 'react';
import DocumentUploader from './DocumentUploader';
import { useCV } from '../context/CVContext';
import TiptapEditor from './TiptapEditor';

const JobSpecEditor: React.FC = () => {
  const { jobSpec, setJobSpec } = useCV();

  return (
    <div className="p-3">
      <h2>Job Specification</h2>
      <DocumentUploader onFileContent={setJobSpec} />
      <div className="mb-3">
        <TiptapEditor
          content={jobSpec}
          onChange={setJobSpec}
          placeholder="Enter the job specification here..."
          filename="job-spec"
        />
      </div>
    </div>
  );
};

export default JobSpecEditor;