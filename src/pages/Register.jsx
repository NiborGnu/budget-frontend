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
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../styles/pages/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(formData.username)) {
      newErrors.username =
        "Username must be 4–20 characters long and can only contain letters, numbers, and underscores.";
    }

    // Password validation
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must include at least one letter, one number, and be at least 8 characters long.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({}); // Clear errors if form is valid

    try {
      await apiClient.post("/register/", formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setGeneralError("Registration failed. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="text-center bg-success text-white">
              <h3>Register</h3>
            </Card.Header>
            <Card.Body>
              {generalError && (
                <Alert variant="danger" className="text-center">
                  {generalError}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                  <Form.Text className="text-muted">
                    Username must be 4–20 characters long and can only contain
                    letters, numbers, and underscores.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must include at least one letter, one number, and
                    be at least 8 characters long.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
