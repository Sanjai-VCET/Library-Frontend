import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const FineCard = ({ fine }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{fine.title}</Card.Title>
        <Card.Text>
          <strong>User:</strong> {fine.userName}<br />
          <strong>Days Overdue:</strong> {fine.daysOverdue}<br />
          <strong>Fine Amount:</strong> ${fine.fineAmount.toFixed(2)}<br />
          <strong>Status:</strong> <Badge bg={fine.paid ? 'success' : 'danger'}>{fine.paid ? 'Paid' : 'Unpaid'}</Badge><br />
          <strong>Payment Date:</strong> {fine.paymentDate ? new Date(fine.paymentDate).toLocaleDateString() : 'N/A'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FineCard;