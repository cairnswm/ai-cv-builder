import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useCV } from '../context/CVContext';
import { openAIService } from '../services/openai';
import TiptapEditor from './TiptapEditor';

const GeneratedCV: React.FC = () => {
  const { cv, jobSpec, generatedCV, setGeneratedCV, apiKey } = useCV();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCV = async () => {
    if (!cv || !jobSpec) {
      alert('Please provide both CV and Job Specification before generating.');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await openAIService.generateCV(apiKey, cv, jobSpec);
      setGeneratedCV(generatedContent);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Error generating CV. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-3">
      <h2>Generated CV</h2>
      <Button 
        onClick={generateCV} 
        className="mb-3" 
        variant="primary"
        disabled={isGenerating || !apiKey}
      >
        {isGenerating ? 'Generating...' : 'Generate Optimized CV'}
      </Button>
      {!apiKey && (
        <div className="alert alert-warning">
          Please set your OpenAI API key in settings to use this feature.
        </div>
      )}
      <div className="mb-3">
        <TiptapEditor
          content={generatedCV}
          onChange={setGeneratedCV}
          placeholder="Generated CV will appear here..."
          filename="generated-cv"
        />
      </div>
    </div>
  );
};

export default GeneratedCV;