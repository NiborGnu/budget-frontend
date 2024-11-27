import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Corrected name from `history` to `navigate`

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure for easier access
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the correct field in formData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors when submitting

    try {
      // Sending data to the API
      await apiClient.post("/register/", formData);
      // Redirect to login page upon successful registration
      navigate("/login"); // useNavigate for navigation
    } catch (err) {
      console.error(err);
      // Handle API errors or validation failures
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {/* Display error if there is one */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            autoComplete="family-name"
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
