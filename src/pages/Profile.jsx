import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useUserData } from "../hooks/useUserData";
import LoadingIndicator from "../components/LoadingIndicator";
import apiClient from "../api/apiClient";
import "../styles/pages/UserProfile.css";

const UserProfile = () => {
  const { data, isLoading, error, refetch } = useUserData({
    endpoint: "/users/profile/",
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Refetch profile data on component mount
  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
      });
    }
    refetch(); // Calling refetch to refresh the user profile data
  }, [data, refetch]);

  const handleEdit = () => {
    setFormData({
      username: data?.username || "",
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
    });
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await apiClient.patch("/users/profile/", formData);
      await refetch(); // Refetch updated profile data
      setEditMode(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    try {
      await apiClient.patch("/users/change-password/", passwordForm);
      setShowPasswordModal(false);
    } catch (err) {
      setPasswordError(err.response?.data?.detail || "Error changing password");
    } finally {
      setPasswordLoading(false);
    }
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
    <div className="user-profile">
      {!editMode ? (
        <>
          <h1>{data.first_name || "Welcome!"}</h1>
          <p>Username: {data.username}</p>
          <p>First Name: {data.first_name}</p>
          <p>Last Name: {data.last_name}</p>
          <p>Created At: {new Date(data.created_at).toLocaleString()}</p>
          <p>Updated At: {new Date(data.updated_at).toLocaleString()}</p>
          <Button onClick={handleEdit}>Edit Profile</Button>{" "}
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Form.Group>
          {errorMsg && <p className="error">{errorMsg}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingIndicator size="sm" /> : "Save"}
          </Button>{" "}
          <Button variant="secondary" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </form>
      )}

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePasswordSubmit}>
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                name="old_password"
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            {passwordError && <p className="error">{passwordError}</p>}
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? (
                <LoadingIndicator size="sm" />
              ) : (
                "Change Password"
              )}
            </Button>{" "}
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserProfile;
