import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import apiClient from "../api/apiClient";

function BudgetsForm({ show, onHide, onSave, budgetData, categories }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    amount: "",
    category_id: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(
      budgetData || { id: null, name: "", amount: "", category_id: "" }
    );
  }, [budgetData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const data = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id || null,
      };

      if (formData.id) {
        await apiClient.put(`/budgets/${formData.id}/`, data);
      } else {
        await apiClient.post("/budgets/", data);
      }

      onSave();
      onHide();
    } catch (error) {
      setError("Failed to save budget. Please check your input.");
      console.error("Failed to save budget", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? "Edit Budget" : "Add Budget"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group className="mb-3" controlId="budgetName">
            <Form.Label>Budget Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter budget name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetCategory">
            <Form.Label>Category (Optional)</Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

BudgetsForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  budgetData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    amount: PropTypes.string,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BudgetsForm;
