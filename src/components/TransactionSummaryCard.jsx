import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "../styles/components/TransactionSummaryCard.css";

function TransactionSummaryCard({ title, amount }) {
  const isExpense = title.toLowerCase().includes("expense");

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return (
    <Card className="transaction-summary-card mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text
          className={isExpense ? "expense" : "income"}
          aria-label={`${title} is ${formattedAmount}`}
        >
          {formattedAmount}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

TransactionSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

export default TransactionSummaryCard;
