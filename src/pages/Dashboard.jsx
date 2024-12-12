import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import TransactionSummaryCard from "../components/TransactionSummaryCard";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/pages/Dashboard.css";

function Dashboard() {
  const [latestIncomes, setLatestIncomes] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);

  const {
    data: transactionSummary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useUserData({
    endpoint: "/transactions/summary/",
  });

  const { data: budgets, isLoading: isBudgetsLoading } = useUserData({
    endpoint: "/budgets/",
  });

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useUserData({
    endpoint: "/transactions/",
  });

  // Fetch latest transactions on transactions update
  useEffect(() => {
    if (transactions) {
      const latestIncomes = transactions
        .filter((transaction) => transaction.transaction_type === "income")
        .slice(0, 5)
        .reverse();

      const latestExpenses = transactions
        .filter((transaction) => transaction.transaction_type === "expense")
        .slice(0, 5)
        .reverse();

      setLatestIncomes(latestIncomes);
      setLatestExpenses(latestExpenses);
    }
  }, [transactions]);

  // Refetch data to update the dashboard
  const handleAddTransaction = () => {
    refetchTransactions();
    refetchSummary();
  };

  // Check loading state
  if (isSummaryLoading || isTransactionsLoading || isBudgetsLoading) {
    return (
      <div>
        Loading Dashboard...
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Container fluid>
      <h1>Dashboard</h1>

      {/* Add Buttons with Accessibility */}
      <Row className="mb-4">
        <Col>
          <NavLink
            to="/transactions"
            className="btn btn-success me-3"
            onClick={handleAddTransaction}
            aria-label="Navigate to add a new transaction"
          >
            Add Transaction
          </NavLink>
          <NavLink
            to="/budgets"
            className="btn btn-success"
            aria-label="Navigate to add a new budget"
          >
            Add Budget
          </NavLink>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          {/* Transaction Summary */}
          <TransactionSummaryCard
            title="Total Income"
            amount={transactionSummary?.income || 0}
          />
          {/* Latest Incomes */}
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Latest Incomes</Card.Title>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestIncomes.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>${transaction.amount}</td>
                      <td>{transaction.category?.name || "N/A"}</td>
                      <td>
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <NavLink to="/transactions">View All Incomes</NavLink>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <TransactionSummaryCard
            title="Total Expenses"
            amount={transactionSummary?.expense || 0}
          />
          {/* Latest Expenses */}
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Latest Expenses</Card.Title>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestExpenses.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>${transaction.amount}</td>
                      <td>{transaction.category?.name || "N/A"}</td>
                      <td>
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <NavLink to="/transactions">View All Expenses</NavLink>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budgets Section */}
      <Card>
        <Card.Body>
          <Card.Title>Budgets</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length ? (
                budgets.map((budget) => (
                  <tr key={budget.id}>
                    <td>{budget.name}</td>
                    <td>{budget.amount}</td>
                    <td>
                      {budget.category ? budget.category.name : "General"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No budgets found. Add a new budget to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Dashboard;
