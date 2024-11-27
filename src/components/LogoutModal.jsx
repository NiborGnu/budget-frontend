import React from "react";
import "../styles/components/LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to log out?</h2>
        <div className="modal-buttons">
          <button onClick={onLogout}>Yes, Log Out</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
