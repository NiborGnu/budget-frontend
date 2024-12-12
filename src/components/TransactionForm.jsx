import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button } from "react-bootstrap";
import apiClient from "../api/apiClient";

function TransactionForm({
  show,
  onHide,
  transactionData,
  fetchTransactions,
  showAlert,
}) {
  const [formData, setFormData] = useState({
    id: null,
    amount: "",
    transaction_type: "Expenses",
    category_id: "",
    subcategory_id: null,
    description: "",
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(
          `/categories/?category_type=${formData.transaction_type}`
        );

        if (res.data) {
          setAvailableCategories(res.data);
        } else {
          console.log("No categories returned from the API.");
        }

        if (transactionData && transactionData.category_id) {
          const selectedCategory = res.data.find(
            (cat) => cat.id === transactionData.category_id
          );
          if (selectedCategory) {
            setSubcategories(selectedCategory.subcategories || []);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (formData.transaction_type) {
      fetchCategories();
    }
  }, [formData.transaction_type, transactionData]);

  useEffect(() => {
    if (transactionData) {
      setFormData({
        id: transactionData.id,
        amount: transactionData.amount,
        transaction_type:
          transactionData.transaction_type === "income"
            ? "Incomes"
            : "Expenses",
        category_id: transactionData.category_id || "",
        subcategory_id: transactionData.subcategory_id || null,
        description: transactionData.description,
      });
    } else {
      setFormData({
        id: null,
        amount: "",
        transaction_type: "Expenses",
        category_id: "",
        subcategory_id: null,
        description: "",
      });
    }
  }, [transactionData]);

  useEffect(() => {
    if (formData.category_id) {
      const category = availableCategories.find(
        (cat) => cat.id === parseInt(formData.category_id)
      );
      if (category) {
        setSubcategories(category.subcategories || []);
      }
    }
  }, [formData.category_id, availableCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleSubmit = async () => {
    const {
      id,
      amount,
      transaction_type,
      category_id,
      subcategory_id,
      description,
    } = formData;

    if (!category_id) {
      alert("Category is required.");
      return;
    }

    const backendTransactionType =
      transaction_type === "Expenses" ? "expense" : "income";

    const newTransaction = {
      amount: parseFloat(amount),
      transaction_type: backendTransactionType,
      category_id: parseInt(category_id),
      subcategory_id: subcategory_id ? parseInt(subcategory_id) : null,
      description,
    };

    try {
      if (id) {
        await apiClient.put(`/transactions/${id}/`, newTransaction);
        showAlert("Transaction updated successfully.", "success");
      } else {
        await apiClient.post("/transactions/", newTransaction);
        showAlert("Transaction created successfully.", "success");
      }
      fetchTransactions();
      onHide();
    } catch (error) {
      console.error("Error saving transaction", error);
      showAlert("Error saving transaction.", "danger");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {formData.id ? "Edit Transaction" : "Add Transaction"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="amount">
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

          <Form.Group className="mb-3" controlId="transactionType">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              disabled={!!transactionData}
            >
              <option value="Expenses">Expense</option>
              <option value="Incomes">Income</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {availableCategories && availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="subcategory">
            <Form.Label>Subcategory</Form.Label>
            <Form.Select
              name="subcategory_id"
              value={formData.subcategory_id || ""}
              onChange={handleChange}
            >
              <option value="">Select a subcategory</option>
              {subcategories && subcategories.length > 0 ? (
                subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No subcategories available
                </option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSubmit}>
            {formData.id ? "Update" : "Save"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

TransactionForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  transactionData: PropTypes.object,
  fetchTransactions: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default TransactionForm;
