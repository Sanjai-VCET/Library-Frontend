import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const FineCard = ({ fine, onPayFine }) => {
  const getStatusBadge = (paid) => {
    return paid ? (
      <Badge bg="success">Paid</Badge>
    ) : (
      <Badge bg="danger">Unpaid</Badge>
    );
  };

  return (
    <Card className="mb-3 shadow-hover">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1">{fine.title}</Card.Title>
            <Card.Subtitle className="text-muted mb-2">
              Loan ID: {fine.loanId}
            </Card.Subtitle>
          </div>
          {getStatusBadge(fine.paid)}
        </div>
        
        <div className="mb-3">
          <p className="mb-1"><strong>User:</strong> {fine.userName}</p>
          <p className="mb-1"><strong>Days Overdue:</strong> {fine.daysOverdue}</p>
          <p className="mb-1"><strong>Fine Amount:</strong> ${fine.fineAmount?.toFixed(2)}</p>
          {fine.paymentDate && (
            <p className="mb-1"><strong>Paid on:</strong> {new Date(fine.paymentDate).toLocaleDateString()}</p>
          )}
        </div>

        {!fine.paid && onPayFine && (
          <Button 
            variant="success" 
            size="sm" 
            onClick={() => onPayFine(fine.loanId)}
            className="w-100"
          >
            Pay Fine
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default FineCard;
