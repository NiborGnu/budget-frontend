import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

function TransactionSummaryCard({ title, amount }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{formattedAmount}</Card.Text>
      </Card.Body>
    </Card>
  );
}

TransactionSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

export default TransactionSummaryCard;
