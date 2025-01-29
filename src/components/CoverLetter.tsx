import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useCV } from '../context/CVContext';
import { openAIService } from '../services/openai';
import TiptapEditor from './TiptapEditor';

const CoverLetter: React.FC = () => {
  const { cv, jobSpec, coverLetter, setCoverLetter, apiKey } = useCV();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCoverLetter = async () => {
    if (!cv || !jobSpec) {
      alert('Please provide both CV and Job Specification before generating.');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await openAIService.generateCoverLetter(apiKey, cv, jobSpec);
      setCoverLetter(generatedContent);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Error generating cover letter. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-3">
      <h2>Cover Letter</h2>
      <Button 
        onClick={generateCoverLetter} 
        className="mb-3" 
        variant="primary"
        disabled={isGenerating || !apiKey}
      >
        {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
      </Button>
      {!apiKey && (
        <div className="alert alert-warning">
          Please set your OpenAI API key in settings to use this feature.
        </div>
      )}
      <div className="mb-3">
        <TiptapEditor
          content={coverLetter}
          onChange={setCoverLetter}
          placeholder="Generated cover letter will appear here..."
          filename="cover-letter"
        />
      </div>
    </div>
  );
};

export default CoverLetter;