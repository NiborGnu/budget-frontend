import React, { useState } from "react";
import {
  Container,
  Button,
  Table,
  Modal,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useUserData } from "../hooks/useUserData";
import { useAlert } from "../hooks/useAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import BudgetsForm from "../components/BudgetsForm";
import apiClient from "../api/apiClient";
import useTable from "../hooks/useTable";
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

  const { sortedData, handleSort, searchQuery, setSearchQuery, sortConfig } =
    useTable(budgets, ["name", "amount", "category.name"]);

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
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

      {/* Search and Add New Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: "300px" }}>
          <Form.Control
            id="search-budgets"
            name="searchQuery"
            type="text"
            placeholder="Search budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button onClick={handleAddNew}>Add New Budget</Button>
      </div>

      {/* Budgets Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th
              onClick={() => handleSort("name")}
              style={{ cursor: "pointer" }}
            >
              Name {renderSortIcon("name")}
            </th>
            <th
              onClick={() => handleSort("amount")}
              style={{ cursor: "pointer" }}
            >
              Amount {renderSortIcon("amount")}
            </th>
            <th
              onClick={() => handleSort("category.name")}
              style={{ cursor: "pointer" }}
            >
              Category {renderSortIcon("category.name")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length ? (
            sortedData.map((budget) => (
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
