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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../api/apiClient";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/pages/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirm_password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username =
        "Username must be 3–20 characters long and can only contain letters, numbers, and underscores.";
    }

    // Password validation
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must include at least one letter, one number, and be at least 8 characters long.";
    }

    // Confirm password validation
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
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

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
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

    setErrors({});
    setIsSubmitting(true);

    try {
      await apiClient.post("/register/", formData);
      navigate("/login", {
        state: {
          successMessage: "Account successfully created. Please log in.",
        },
      });
    } catch (err) {
      console.error(err);
      setGeneralError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs="auto">
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
              {isSubmitting ? (
                <LoadingIndicator message="Submitting your registration..." />
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      placeholder="Enter your username"
                      autoComplete="username"
                      required
                      disabled={isSubmitting}
                    />
                    <Form.Text className="text-muted">
                      Username must be 3–20 characters long and can only contain
                      letters, numbers, and underscores.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type={passwordVisibility.password ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        variant="link"
                        onClick={() => togglePasswordVisibility("password")}
                        className="ms-2"
                        disabled={isSubmitting}
                      >
                        {passwordVisibility.password ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Password must include at least one letter, one number, and
                      be at least 8 characters long.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="confirm_password">
                      Confirm Password
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type={
                          passwordVisibility.confirm_password
                            ? "text"
                            : "password"
                        }
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        isInvalid={!!errors.confirm_password}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        variant="link"
                        onClick={() =>
                          togglePasswordVisibility("confirm_password")
                        }
                        className="ms-2"
                        disabled={isSubmitting}
                      >
                        {passwordVisibility.confirm_password ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirm_password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    variant="success"
                    type="submit"
                    className="w-100"
                    disabled={isSubmitting}
                  >
                    Register
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
