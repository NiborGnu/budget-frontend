import React from "react";
import { Navigate } from "react-router-dom";

// A helper function to check if the user is logged in
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return token ? true : false;
};

// Refactored ProtectedRoute
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render the protected route's children
};

export default ProtectedRoute;
