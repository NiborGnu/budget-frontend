import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import { useClearUserProfileCache } from "../hooks/useClearCache";

const Logout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const clearCache = useClearUserProfileCache(); // Clear cache hook

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear user profile cache
    clearCache();

    // Dispatch logoutSuccess event
    const event = new CustomEvent("logoutSuccess", { detail: true });
    window.dispatchEvent(event);

    setIsModalOpen(false); // Close the modal
    navigate("/login"); // Redirect to login
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Add Bootstrap "danger" class to button */}
      <button className="btn btn-danger" onClick={openModal}>
        Log Out
      </button>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Logout;
