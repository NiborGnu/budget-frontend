import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import LoadingIndicator from "./LoadingIndicator";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null for loading state

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token && !refreshToken) {
        setIsAuthenticated(false); // No tokens, unauthenticated
        return;
      }

      try {
        if (token) {
          // Decode token to check expiration (optional, if not using an API call for this)
          const { exp } = JSON.parse(atob(token.split(".")[1]));
          if (Date.now() >= exp * 1000) {
            throw new Error("Access token expired");
          }
          setIsAuthenticated(true);
          return;
        }

        if (refreshToken) {
          // Refresh access token if expired
          const response = await apiClient.post("/token/refresh/", {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token invalid or refresh failed, redirect to login
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div>
        Loading...
        <LoadingIndicator />
      </div>
    ); // Show loading spinner or message
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
