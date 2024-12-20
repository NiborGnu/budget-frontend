import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  Alert,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useUserData } from "../hooks/useUserData";
import { useAlert } from "../hooks/useAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import TransactionForm from "../components/TransactionForm";
import apiClient from "../api/apiClient";
import useTable from "../hooks/useTable";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "../styles/pages/Transactions.css";

function Transactions() {
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTab, setSelectedTab] = useState("expenses");
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useUserData({ endpoint: "/transactions/" });

  const { data: categories, isLoading: isCategoriesLoading } = useUserData({
    endpoint: "/categories/",
  });

  useEffect(() => {
    if (isTransactionsLoading || isCategoriesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isTransactionsLoading, isCategoriesLoading]);

  const { sortedData, handleSort, searchQuery, setSearchQuery, sortConfig } =
    useTable(transactions, [
      "amount",
      "category.name",
      "subcategory.name",
      "description",
      "created_at",
    ]);

  // Render Sort Icon Function
  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

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
      showAlert("Transaction deleted successfully.", "success");
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  if (loading) {
    return (
      <div>
        Loading Transactions... <LoadingIndicator />
      </div>
    );
  }

  const expenses = sortedData.filter(
    (transaction) => transaction.transaction_type === "expense"
  );
  const incomes = sortedData.filter(
    (transaction) => transaction.transaction_type === "income"
  );

  return (
    <Container>
      <h1>Transactions</h1>

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

      {/* Search And Add New Transaction */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup className="search-bar">
          <Form.Control
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="searchBar"
            name="search"
          />
        </InputGroup>
        <Button onClick={handleAddTransaction}>Add New Transaction</Button>
      </div>

      {/* Tab for Switching Between Expenses and Incomes */}
      <div className="mb-3">
        <Button
          variant={selectedTab === "expenses" ? "primary" : "outline-primary"}
          onClick={() => setSelectedTab("expenses")}
        >
          Expenses
        </Button>
        <Button
          variant={selectedTab === "incomes" ? "primary" : "outline-primary"}
          onClick={() => setSelectedTab("incomes")}
        >
          Incomes
        </Button>
      </div>

      {transactions.length === 0 ? (
        <Alert variant="info">
          No transactions found. Add your first transaction using the button
          above.
        </Alert>
      ) : (
        <>
          {/* Expenses Tables */}
          {selectedTab === "expenses" && (
            <>
              <h3>Expenses</h3>
              {expenses.length === 0 ? (
                <Alert variant="warning">No expenses recorded yet.</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("amount")}
                      >
                        Amount {renderSortIcon("amount")}
                      </th>
                      <th
                        className="sortable-header d-none d-md-table-cell"
                        onClick={() => handleSort("category.name")}
                      >
                        Category {renderSortIcon("category.name")}
                      </th>
                      <th
                        className="sortable-header hide-at-1145px"
                        onClick={() => handleSort("subcategory.name")}
                      >
                        Subcategory {renderSortIcon("subcategory.name")}
                      </th>
                      <th
                        className="sortable-header hide-at-1145px"
                        onClick={() => handleSort("description")}
                      >
                        Description {renderSortIcon("description")}
                      </th>
                      <th
                        className="sortable-header hide-at-1145px max-width-200"
                        onClick={() => handleSort("created_at")}
                      >
                        Date {renderSortIcon("created_at")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          {transaction.transaction_type
                            .charAt(0)
                            .toUpperCase() +
                            transaction.transaction_type.slice(1)}
                        </td>
                        <td>${transaction.amount}</td>
                        <td className="d-none d-md-table-cell">
                          {transaction.category?.name || "N/A"}
                        </td>
                        <td className="hide-at-1145px">
                          {transaction.subcategory?.name || "N/A"}
                        </td>
                        <td className="hide-at-1145px">
                          {transaction.description}
                        </td>
                        <td className="hide-at-1145px">
                          {new Date(transaction.created_at).toLocaleString()}
                        </td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => setSelectedTransaction(transaction)}
                            className="hide-at-1145px-min"
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
                            onClick={() =>
                              handleDeleteConfirmation(transaction.id)
                            }
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

          {/* Incomes Tables */}
          {selectedTab === "incomes" && (
            <>
              <h3>Incomes</h3>
              {incomes.length === 0 ? (
                <Alert variant="warning">No incomes recorded yet.</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("amount")}
                      >
                        Amount {renderSortIcon("amount")}
                      </th>
                      <th
                        className="sortable-header d-none d-md-table-cell"
                        onClick={() => handleSort("category.name")}
                      >
                        Category {renderSortIcon("category.name")}
                      </th>
                      <th
                        className="sortable-header hide-at-1145px"
                        onClick={() => handleSort("subcategory.name")}
                      >
                        Subcategory {renderSortIcon("subcategory.name")}
                      </th>
                      <th
                        className="sortable-header hide-at-1145px"
                        onClick={() => handleSort("description")}
                      >
                        Description {renderSortIcon("description")}
                      </th>
                      <th
                        className="sortable-header hide-at-1145px max-width-200"
                        onClick={() => handleSort("created_at")}
                      >
                        Date {renderSortIcon("created_at")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          {transaction.transaction_type
                            .charAt(0)
                            .toUpperCase() +
                            transaction.transaction_type.slice(1)}
                        </td>
                        <td>${transaction.amount}</td>
                        <td className="d-none d-md-table-cell">
                          {transaction.category?.name || "N/A"}
                        </td>
                        <td className="hide-at-1145px">
                          {transaction.subcategory?.name || "N/A"}
                        </td>
                        <td className="hide-at-1145px">
                          {transaction.description}
                        </td>
                        <td className="hide-at-1145px">
                          {new Date(transaction.created_at).toLocaleString()}
                        </td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => setSelectedTransaction(transaction)}
                            className="hide-at-1145px-min"
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
                            onClick={() =>
                              handleDeleteConfirmation(transaction.id)
                            }
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
        </>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddTransaction={async (formData) => {
          if (!formData.category_id) {
            showAlert("Category is required.", "danger");
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
              showAlert("Transaction updated successfully.", "success");
            } else {
              await apiClient.post("/transactions/", newTransaction);
              showAlert("Transaction created successfully.", "success");
            }
            refetchTransactions();
            setShowModal(false);
          } catch (err) {
            console.error("Error saving transaction", err);
            showAlert("Error saving transaction.", "danger");
          }
        }}
        categories={categories}
        transactionData={editingTransaction}
        fetchTransactions={refetchTransactions}
        showAlert={showAlert}
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
