import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleRedirectHome = () => {
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button variant="primary" onClick={handleRedirectHome}>
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
