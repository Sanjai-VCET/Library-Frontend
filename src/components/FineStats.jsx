import React from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col } from 'react-bootstrap';

const FineStats = ({ fines }) => {
  const calculateStats = () => {
    const totalFines = fines.length;
    const paidFines = fines.filter(fine => fine.paid).length;
    const unpaidFines = totalFines - paidFines;
    const totalAmount = fines.reduce((sum, fine) => sum + (fine.fineAmount || 0), 0);
    const paidAmount = fines.reduce((sum, fine) => sum + (fine.paid ? fine.fineAmount || 0 : 0), 0);
    const unpaidAmount = totalAmount - paidAmount;

    return {
      totalFines,
      paidFines,
      unpaidFines,
      totalAmount,
      paidAmount,
      unpaidAmount
    };
  };

  const stats = calculateStats();

  return (
    <Row className="mb-4">
      <Col md={3} sm={6} xs={12} className="mb-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .3 }}>
        <Card className="text-center bg-primary text-white shadow-hover">
          <Card.Body>
            <Card.Title>{stats.totalFines}</Card.Title>
            <Card.Text>Total Fines</Card.Text>
          </Card.Body>
        </Card>
        </motion.div>
      </Col>
      <Col md={3} sm={6} xs={12} className="mb-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .3, delay: .05 }}>
        <Card className="text-center bg-success text-white shadow-hover">
          <Card.Body>
            <Card.Title>{stats.paidFines}</Card.Title>
            <Card.Text>Paid Fines</Card.Text>
          </Card.Body>
        </Card>
        </motion.div>
      </Col>
      <Col md={3} sm={6} xs={12} className="mb-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .3, delay: .1 }}>
        <Card className="text-center bg-danger text-white shadow-hover">
          <Card.Body>
            <Card.Title>{stats.unpaidFines}</Card.Title>
            <Card.Text>Unpaid Fines</Card.Text>
          </Card.Body>
        </Card>
        </motion.div>
      </Col>
      <Col md={3} sm={6} xs={12} className="mb-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .3, delay: .15 }}>
        <Card className="text-center bg-warning text-dark shadow-hover">
          <Card.Body>
            <Card.Title>${stats.unpaidAmount.toFixed(2)}</Card.Title>
            <Card.Text>Amount Due</Card.Text>
          </Card.Body>
        </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default FineStats;
