import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useUserData } from "../hooks/useUserData";
import LoadingIndicator from "../components/LoadingIndicator";
import apiClient from "../api/apiClient";
import { useAlert } from "../hooks/useAlert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/pages/UserProfile.css";

const UserProfile = () => {
  const { data, isLoading, error, refetch } = useUserData({
    endpoint: "/users/profile/",
  });
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit Profile Modal States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [sameAsOldPassword, setSameAsOldPassword] = useState(false);

  // Show password toggle state for each field
  const [passwordVisibility, setPasswordVisibility] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  // Alert hook
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
      });
    }
    refetch();
  }, [data, refetch]);

  const handleEdit = () => {
    setShowEditProfileModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username") {
      setUsernameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setUsernameError("");

    try {
      await apiClient.patch("/users/profile/", formData);
      await refetch();
      setShowEditProfileModal(false);
      showAlert("Profile updated successfully.", "success");
    } catch (err) {
      if (err.response?.status === 400) {
        // Check if the error is related to username
        if (
          err.response?.data?.username?.[0] ===
          "This username is already taken."
        ) {
          setUsernameError(
            "This username is already taken. Please try a different one."
          );
        } else {
          setErrorMsg(err.response?.data?.detail || "Error updating profile.");
        }
      } else {
        setErrorMsg(err.response?.data?.detail || "Error updating profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    setPasswordForm({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setPasswordMismatch(false);
    setSameAsOldPassword(false);
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });

    // Check if new password matches old password
    if (
      (name === "new_password" && value === passwordForm.old_password) ||
      (name === "confirm_password" && value === passwordForm.old_password)
    ) {
      setSameAsOldPassword(true);
    } else {
      setSameAsOldPassword(false);
    }

    // Check if confirm password matches new password
    if (name === "confirm_password" && value !== passwordForm.new_password) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    try {
      await apiClient.patch("/users/change-password/", passwordForm);
      setShowPasswordModal(false);
      showAlert("Password changed successfully.", "success");
    } catch (err) {
      if (err.response?.status === 400) {
        setPasswordError(
          err.response?.data?.detail || "Error changing password"
        );
      }
    }
  };

  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
    setFormData({
      username: data?.username || "",
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
    });
    setUsernameError("");
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setPasswordMismatch(false);
    setSameAsOldPassword(false);
    setPasswordError("");
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (isLoading) {
    return (
      <div>
        Loading Profile...
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return <p>Error loading profile: {error.message}</p>;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1>{data.first_name || "Welcome!"}</h1>
          <p>Username: {data.username}</p>
          <p>First Name: {data.first_name}</p>
          <p>Last Name: {data.last_name}</p>
          <p>Created At: {new Date(data.created_at).toLocaleString()}</p>
          <p>Updated At: {new Date(data.updated_at).toLocaleString()}</p>
          <Button onClick={handleEdit} className="btn btn-primary me-3">
            Edit Profile
          </Button>
          <Button
            variant="secondary"
            onClick={handlePasswordChange}
            className="btn btn-secondary"
          >
            Change Password
          </Button>
        </Col>
      </Row>

      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={hideAlert}
          dismissible
          className="mb-3"
        >
          {alert.message}
        </Alert>
      )}

      {/* Edit Profile Modal */}
      <Modal show={showEditProfileModal} onHide={closeEditProfileModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {usernameError && (
                <p className="error text-danger mb-3">{usernameError}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {errorMsg && <p className="error">{errorMsg}</p>}
            <Button
              type="submit"
              disabled={loading || usernameError || !formData.username}
              className="btn btn-primary"
            >
              {loading ? <LoadingIndicator size="sm" /> : "Save"}
            </Button>{" "}
            <Button
              variant="secondary"
              onClick={closeEditProfileModal}
              className="btn btn-secondary"
            >
              Cancel
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={closePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePasswordSubmit}>
            {Object.keys(passwordForm).map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={passwordVisibility[field] ? "text" : "password"}
                    name={field}
                    value={passwordForm[field]}
                    onChange={handlePasswordInputChange}
                    required
                  />
                  <span
                    onClick={() => togglePasswordVisibility(field)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {passwordVisibility[field] ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>
            ))}
            {passwordMismatch && (
              <p className="error text-danger">Passwords do not match.</p>
            )}
            {sameAsOldPassword && (
              <p className="error text-danger">
                New password cannot be the same as the old password.
              </p>
            )}
            {passwordError && <p className="error">{passwordError}</p>}
            <Button
              type="submit"
              disabled={
                passwordMismatch ||
                sameAsOldPassword ||
                !passwordForm.new_password ||
                !passwordForm.old_password
              }
              className="btn btn-primary"
            >
              {passwordError ? "Try Again" : "Change Password"}
            </Button>{" "}
            <Button
              variant="secondary"
              onClick={closePasswordModal}
              className="btn btn-secondary"
            >
              Cancel
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserProfile;
