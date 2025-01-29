import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import CVEditor from './components/CVEditor';
import JobSpecEditor from './components/JobSpecEditor';
import GeneratedCV from './components/GeneratedCV';
import CoverLetter from './components/CoverLetter';
import About from './components/About';
import Header from './components/Header';
import { CVProvider } from './context/CVContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  return (
    <CVProvider>
      <Container className="py-4">
        <Header />
        <Tabs defaultActiveKey="cv" className="mb-4">
          <Tab eventKey="About" title="About">
            <About />
            </Tab>
          <Tab eventKey="cv" title="CV Editor">
            <CVEditor />
          </Tab>
          <Tab eventKey="jobSpec" title="Job Specification">
            <JobSpecEditor />
          </Tab>
          <Tab eventKey="generatedCV" title="Generated CV">
            <GeneratedCV />
          </Tab>
          <Tab eventKey="coverLetter" title="Cover Letter">
            <CoverLetter />
          </Tab>
        </Tabs>
      </Container>
    </CVProvider>
  );
}

export default Main;