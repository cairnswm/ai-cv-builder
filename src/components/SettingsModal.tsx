import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface SettingsModalProps {
  show: boolean;
  onHide: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onHide, apiKey, setApiKey }) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSaveSettings = () => {
    setApiKey(tempApiKey);
    localStorage.setItem("openai_api_key", tempApiKey);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
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
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveSettings}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
