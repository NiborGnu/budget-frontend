import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../styles/components/LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to log out?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onLogout}>
          Yes, Log Out
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
