import React, { useState, useEffect } from "react";
import { Container, Button, Table } from "react-bootstrap";
import { useUserData } from "../hooks/useUserData"; // Importing the custom hook
import LoadingIndicator from "../components/LoadingIndicator";
import BudgetsForm from "../components/BudgetsForm";
import apiClient from "../api/apiClient";
import "../styles/pages/Budgets.css";

function Budgets() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Using useUserData hook to fetch budgets and categories
  const {
    data: budgets,
    isLoading: isBudgetsLoading,
    refetch: refetchBudgets,
  } = useUserData({
    endpoint: "/budgets/",
  });

  const { data: categories, isLoading: isCategoriesLoading } = useUserData({
    endpoint: "/categories/",
  });

  // Handle loading and error states
  useEffect(() => {
    if (isBudgetsLoading || isCategoriesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isBudgetsLoading, isCategoriesLoading]);

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

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/budgets/${id}/`);
      refetchBudgets();
    } catch (error) {
      console.error("Failed to delete budget", error);
    }
  };

  if (loading) {
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
      <Button className="mb-3" onClick={handleAddNew}>
        Add New Budget
      </Button>

      <Table striped bordered hover>
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
                    onClick={() => handleDelete(budget.id)}
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
        onSave={refetchBudgets} // Trigger refetch after saving
        budgetData={selectedBudget}
        categories={categories}
      />
    </Container>
  );
}

export default Budgets;
