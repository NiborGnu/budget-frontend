import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../styles/pages/LoginPage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true); // State for toggling explanation visibility
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError("Please fill in both username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await apiClient.post("/token/", credentials);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      const event = new CustomEvent("loginSuccess", { detail: true });
      window.dispatchEvent(event);

      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExplanation = () => {
    setShowExplanation((prevState) => !prevState); // Toggle the visibility of the explanation
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs="auto">
          <Card className="shadow-sm">
            <Card.Header className="text-center bg-success text-white">
              <h1>Welcome to Budget</h1>
              <Button
                variant="link"
                onClick={toggleExplanation}
                className="mt-2 text-light"
                disabled={isSubmitting}
              >
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
            </Card.Header>
            <Card.Body>
              {showExplanation && (
                <div className="mb-4">
                  <p>
                    This platform helps you keep track of your finances!
                    <br />
                    By managing your transactions and budgets. <br />
                    Once you log in <br />
                    - You can add your expenses and incomes.
                    <br />
                    - Create budgets, and gain an overview of your economy.
                    <br />
                    Start organizing your finances today!
                    <br />
                  </p>
                </div>
              )}

              {successMessage && (
                <Alert variant="success" className="text-center">
                  {successMessage}
                </Alert>
              )}
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              <p className="text-center mb-4">
                Please log in to access your account.
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Username</Form.Label>
                  <Form.Control
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      variant="link"
                      onClick={togglePasswordVisibility}
                      className="ms-2"
                      disabled={isSubmitting}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>
                <Button
                  variant="success"
                  type="submit"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
