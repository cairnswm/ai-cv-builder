import React, { useState } from 'react';
import { Button, ButtonGroup, InputGroup, Form, Modal } from 'react-bootstrap';
import { BsGear, BsDownload, BsUpload } from 'react-icons/bs';
import { useCV } from '../context/CVContext';

const Header: React.FC = () => {
  const { exportProject, importProject, filename, setFilename, apiKey, setApiKey, userName, setUserName } = useCV();
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importProject(file);
    }
  };

  const handleSaveSettings = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('openai_api_key', tempApiKey);
    setShowSettings(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><img src="/favicon.png" width="48px" className="me-3" />AI CV Builder</h1>
        <div className="d-flex gap-3 align-items-center">
          <InputGroup>
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Filename</InputGroup.Text>
            <Form.Control
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </InputGroup>
          <ButtonGroup>
            <Button 
              variant="primary" 
              onClick={() => exportProject()} 
              title="Export Project"
            >
              <BsDownload />
            </Button>
            <label 
              className="btn btn-primary mb-0" 
              title="Import Project"
            >
              <BsUpload />
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </label>
            <Button 
              variant="light" 
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              <BsGear />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>OpenAI API Key</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your OpenAI API key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <Form.Text className="text-muted">
              Your API key will be stored locally in your browser.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;