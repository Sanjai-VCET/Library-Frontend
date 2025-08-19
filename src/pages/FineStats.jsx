import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const FineStats = ({ fines }) => {
  const unpaidFines = fines.filter(fine => !fine.paid).reduce((sum, fine) => sum + fine.fineAmount, 0);
  const paidFines = fines.filter(fine => fine.paid).reduce((sum, fine) => sum + fine.fineAmount, 0);
  const totalFines = unpaidFines + paidFines;

  return (
    <Card className="mb-4">
      <Card.Header>Fine Summary</Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h5>Total Fines</h5>
                <h3>${totalFines.toFixed(2)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h5>Unpaid Fines</h5>
                <h3>${unpaidFines.toFixed(2)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h5>Paid Fines</h5>
                <h3>${paidFines.toFixed(2)}</h3>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FineStats;