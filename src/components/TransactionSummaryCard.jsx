import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

function TransactionSummaryCard({ title, amount }) {
  // Determine styles dynamically based on the card title
  const isExpense = title.toLowerCase().includes("expense");
  const amountStyle = {
    color: isExpense ? "red" : "green", // Red for expenses, Green for incomes
    fontWeight: "bold",
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text
          style={amountStyle}
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
