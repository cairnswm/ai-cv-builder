import React, { createContext, useContext, useState, useEffect } from 'react';

interface CVContextType {
  cv: string;
  setCV: (cv: string) => void;
  jobSpec: string;
  setJobSpec: (spec: string) => void;
  generatedCV: string;
  setGeneratedCV: (cv: string) => void;
  coverLetter: string;
  setCoverLetter: (letter: string) => void;
  filename: string;
  setFilename: (name: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  exportProject: () => void;
  importProject: (file: File) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cv, setCV] = useState('');
  const [jobSpec, setJobSpec] = useState('');
  const [generatedCV, setGeneratedCV] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [filename, setFilename] = useState('document');
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedCV = localStorage.getItem('cv_content');
    const storedJobSpec = localStorage.getItem('job_spec');
    const storedGeneratedCV = localStorage.getItem('generated_cv');
    const storedCoverLetter = localStorage.getItem('cover_letter');
    const storedFilename = localStorage.getItem('filename');
    const storedUserName = localStorage.getItem('user_name');

    if (storedApiKey) setApiKey(storedApiKey);
    if (storedCV) setCV(storedCV);
    if (storedJobSpec) setJobSpec(storedJobSpec);
    if (storedGeneratedCV) setGeneratedCV(storedGeneratedCV);
    if (storedCoverLetter) setCoverLetter(storedCoverLetter);
    if (storedFilename) setFilename(storedFilename);
    if (storedUserName) setUserName(storedUserName);
  }, []);

  // Save CV to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cv_content', cv);
  }, [cv]);

  // Save other content to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('job_spec', jobSpec);
  }, [jobSpec]);

  useEffect(() => {
    localStorage.setItem('generated_cv', generatedCV);
  }, [generatedCV]);

  useEffect(() => {
    localStorage.setItem('cover_letter', coverLetter);
  }, [coverLetter]);

  useEffect(() => {
    localStorage.setItem('filename', filename);
  }, [filename]);

  useEffect(() => {
    localStorage.setItem('user_name', userName);
  }, [userName]);

  const exportProject = () => {
    const projectData = {
      cv,
      jobSpec,
      generatedCV,
      coverLetter,
      filename,
      userName
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = userName ? `${userName}-${filename}.json` : `${filename}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const importProject = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setCV(data.cv || '');
        setJobSpec(data.jobSpec || '');
        setGeneratedCV(data.generatedCV || '');
        setCoverLetter(data.coverLetter || '');
        setFilename(data.filename || file.name.replace(/\.[^/.]+$/, ''));
        if (data.userName) setUserName(data.userName);
      } catch (error) {
        console.error('Error importing project:', error);
        alert('Error importing project. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <CVContext.Provider value={{
      cv,
      setCV,
      jobSpec,
      setJobSpec,
      generatedCV,
      setGeneratedCV,
      coverLetter,
      setCoverLetter,
      filename,
      setFilename,
      apiKey,
      setApiKey,
      userName,
      setUserName,
      exportProject,
      importProject,
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};