import React, { useState, useEffect } from "react";
import { Container, Button, Table, Alert, Modal } from "react-bootstrap";
import { useUserData } from "../hooks/useUserData";
import LoadingIndicator from "../components/LoadingIndicator";
import TransactionForm from "../components/TransactionForm";
import apiClient from "../api/apiClient";
import "../styles/pages/Transactions.css";

function Transactions() {
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Using useUserData hook to fetch transactions and categories
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useUserData({
    endpoint: "/transactions/",
  });

  const { data: categories, isLoading: isCategoriesLoading } = useUserData({
    endpoint: "/categories/",
  });

  // Handle errors and loading states
  useEffect(() => {
    if (isTransactionsLoading || isCategoriesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isTransactionsLoading, isCategoriesLoading]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteConfirmation = (id) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteTransaction = async () => {
    try {
      await apiClient.delete(`/transactions/${transactionToDelete}/`);
      refetchTransactions();
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const handleShowTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  if (loading) {
    return (
      <div>
        Loading Transactions... <LoadingIndicator />
      </div>
    );
  }

  // Separate the transactions into Expenses and Incomes
  const expenses = transactions.filter(
    (transaction) => transaction.transaction_type === "expense"
  );
  const incomes = transactions.filter(
    (transaction) => transaction.transaction_type === "income"
  );

  return (
    <Container>
      <h1>Transactions</h1>
      <Button className="mb-3" onClick={handleAddTransaction}>
        Add New Transaction
      </Button>

      {transactions.length === 0 ? (
        <Alert variant="info">
          No transactions found. Add your first transaction using the button
          above.
        </Alert>
      ) : (
        <>
          {/* Expenses Table */}
          <h3>Expenses</h3>
          {expenses.length === 0 ? (
            <Alert variant="warning">No expenses recorded yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th className="d-none d-md-table-cell">Category</th>
                  <th className="hide-at-1000px">Subcategory</th>
                  <th className="d-none d-md-table-cell">Description</th>
                  <th className="hide-at-1000px">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {transaction.transaction_type.charAt(0).toUpperCase() +
                        transaction.transaction_type.slice(1)}
                    </td>
                    <td>${transaction.amount}</td>
                    <td className="d-none d-md-table-cell">
                      {transaction.category?.name || "N/A"}
                    </td>
                    <td className="hide-at-1000px">
                      {transaction.subcategory?.name || "N/A"}
                    </td>
                    <td className="d-none d-md-table-cell">
                      {transaction.description}
                    </td>
                    <td className="hide-at-1000px">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowTransaction(transaction)}
                      >
                        Show
                      </Button>{" "}
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteConfirmation(transaction.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Incomes Table */}
          <h3>Incomes</h3>
          {incomes.length === 0 ? (
            <Alert variant="warning">No incomes recorded yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th className="d-none d-md-table-cell">Category</th>
                  <th className="hide-at-1000px">Subcategory</th>
                  <th className="d-none d-md-table-cell">Description</th>
                  <th className="hide-at-1000px">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {transaction.transaction_type.charAt(0).toUpperCase() +
                        transaction.transaction_type.slice(1)}
                    </td>
                    <td>${transaction.amount}</td>
                    <td className="d-none d-md-table-cell">
                      {transaction.category?.name || "N/A"}
                    </td>
                    <td className="hide-at-1000px">
                      {transaction.subcategory?.name || "N/A"}
                    </td>
                    <td className="d-none d-md-table-cell">
                      {transaction.description}
                    </td>
                    <td className="hide-at-1000px">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="d-block d-md-none"
                        onClick={() => handleShowTransaction(transaction)}
                      >
                        Show
                      </Button>{" "}
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteConfirmation(transaction.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddTransaction={async (formData) => {
          if (!formData.category_id) {
            alert("Category is required.");
            return;
          }

          const newTransaction = {
            ...formData,
            subcategory_id: formData.subcategory_id || null,
          };

          try {
            if (editingTransaction) {
              await apiClient.put(
                `/transactions/${editingTransaction.id}/`,
                newTransaction
              );
            } else {
              await apiClient.post("/transactions/", newTransaction);
            }
            refetchTransactions();
            setShowModal(false);
          } catch (err) {
            console.error("Error saving transaction", err);
          }
        }}
        categories={categories}
        transactionData={editingTransaction}
        fetchTransactions={refetchTransactions}
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
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTransaction}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Show Transaction Modal */}
      <Modal
        show={!!selectedTransaction}
        onHide={() => setSelectedTransaction(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div>
              <p>
                <strong>Type:</strong> {selectedTransaction.transaction_type}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedTransaction.amount}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedTransaction.category?.name || "N/A"}
              </p>
              <p>
                <strong>Subcategory:</strong>{" "}
                {selectedTransaction.subcategory?.name || "N/A"}
              </p>
              <p>
                <strong>Description:</strong> {selectedTransaction.description}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedTransaction.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setSelectedTransaction(null)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Transactions;
