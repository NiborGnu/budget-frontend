import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setTriggerAction }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // to handle loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation: ensure both fields are filled
    if (!credentials.username || !credentials.password) {
      setError("Please fill in both username and password.");
      return;
    }

    setIsSubmitting(true); // Start loading

    try {
      const { data } = await apiClient.post("/token/", credentials);

      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Dispatch custom event to notify login success
      const event = new CustomEvent("loginSuccess", { detail: true });
      window.dispatchEvent(event);

      // Redirect to profile page after successful login
      navigate("/");
    } catch (err) {
      // Specific error handling
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
            autoComplete="username"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
