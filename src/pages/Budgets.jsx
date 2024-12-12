import React, { useState } from "react";
import { Container, Button, Table, Modal, Alert } from "react-bootstrap";
import { useUserData } from "../hooks/useUserData";
import { useAlert } from "../hooks/useAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import BudgetsForm from "../components/BudgetsForm";
import apiClient from "../api/apiClient";
import "../styles/pages/Budgets.css";

function Budgets() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    data: budgets,
    isLoading: isBudgetsLoading,
    refetch: refetchBudgets,
  } = useUserData({ endpoint: "/budgets/" });

  const { data: categories, isLoading: isCategoriesLoading } = useUserData({
    endpoint: "/categories/",
  });

  const handleAddNew = () => {
    setSelectedBudget(null);
    setShowModal(true);
  };

  const handleEdit = (budget) => {
    setSelectedBudget({
      id: budget.id,
      name: budget.name,
      amount: budget.amount,
      category_id: budget.category ? budget.category.id : "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
    setShowDeleteModal(true);
  };

  const confirmDeleteBudget = async () => {
    if (budgetToDelete) {
      try {
        await apiClient.delete(`/budgets/${budgetToDelete.id}/`);
        refetchBudgets();
        showAlert("Budget deleted successfully.", "success");
      } catch (error) {
        console.error("Failed to delete budget", error);
        showAlert("Failed to delete budget.", "danger");
      } finally {
        setShowDeleteModal(false);
        setBudgetToDelete(null);
      }
    }
  };

  const handleSaveBudget = async () => {
    try {
      refetchBudgets();
      showAlert(
        selectedBudget
          ? "Budget updated successfully."
          : "Budget added successfully.",
        "success"
      );
    } catch (error) {
      console.error("Failed to save budget", error);
      showAlert("Failed to save budget.", "danger");
    }
  };

  if (isBudgetsLoading || isCategoriesLoading) {
    return (
      <div>
        Loading Budgets...
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Container>
      <h1>Budgets</h1>

      {/* Alert Component */}
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

      <Button className="mb-3" onClick={handleAddNew}>
        Add New Budget
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.length ? (
            budgets.map((budget) => (
              <tr key={budget.id}>
                <td>{budget.name}</td>
                <td>{budget.amount}</td>
                <td>{budget.category ? budget.category.name : "General"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(budget)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No budgets found. Add a new budget to get started.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Budget Form Modal */}
      <BudgetsForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveBudget}
        budgetData={selectedBudget}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this budget? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteBudget}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Budgets;
