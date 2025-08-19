import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  Table,
  Badge,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import {
  Search,
  CurrencyDollar,
  ExclamationTriangle,
  Check,
  Filter,
  Receipt
} from 'react-bootstrap-icons';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

const FineCollection = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFines();
  }, [navigate]);

  const fetchFines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/fine/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFines(response.data.fines || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load fines');
      console.error('Failed to load fines');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (loanId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/fine/pay', { loanId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchFines();
      setError('');
      console.log('Fine paid successfully');
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to pay fine');
    }
  };

  const filteredFines = fines.filter(fine => {
    const matchesSearch = fine.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.userName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' ? true :
      (filterStatus === 'paid' ? fine.paid : !fine.paid);

    return matchesSearch && matchesStatus;
  });

  const unpaidFines = filteredFines.filter(fine => !fine.paid);
  const totalUnpaidAmount = unpaidFines.reduce((sum, fine) => sum + fine.fineAmount, 0);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">Loading fines...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <div className="d-flex align-items-center mb-5">
            <CurrencyDollar size={32} className="text-primary me-3" />
            <div>
              <h1 className="mb-1 text-primary">Fine Collection</h1>
              <p className="text-muted fs-5 mb-0">Manage overdue book fines</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={staggerItem}>
          <Row className="g-3 mb-5">
            <Col xs={12} sm={6} md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <p className="text-muted small mb-1">Total Fines</p>
                  <h4 className="text-primary mb-0 fw-bold">{fines.length}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <p className="text-muted small mb-1">Unpaid</p>
                  <h4 className="text-danger mb-0 fw-bold">{unpaidFines.length}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <p className="text-muted small mb-1">Paid</p>
                  <h4 className="text-success mb-0 fw-bold">{fines.filter(f => f.paid).length}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <p className="text-muted small mb-1">Total Due</p>
                  <h4 className="text-warning mb-0 fw-bold">${totalUnpaidAmount.toFixed(2)}</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-3">
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <div className="position-relative">
                    <Search 
                      className="position-absolute text-muted"
                      size={16}
                      style={{ 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        zIndex: 10
                      }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Search by title or user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="ps-5"
                    />
                  </div>
                </Col>
                <Col xs={12} md={3}>
                  <div className="position-relative">
                    <Filter 
                      className="position-absolute text-muted"
                      size={16}
                      style={{ 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        zIndex: 10
                      }}
                    />
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="ps-5"
                    >
                      <option value="all">All Fines</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col xs={12} md={3}>
                  <div className="d-flex align-items-center h-100">
                    <small className="text-muted">Rate: $2/day overdue</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div variants={staggerItem}>
            <Alert variant="danger" className="d-flex align-items-center mb-4">
              <ExclamationTriangle className="me-2" size={16} />
              <div>
                <strong>Error</strong>
                <div>{error}</div>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Fines Table */}
        <motion.div variants={staggerItem}>
          <Card className="border-0 shadow-sm">
            {filteredFines.length === 0 ? (
              <Card.Body className="text-center py-5">
                <Receipt size={48} className="text-muted mb-3" />
                <h4 className="text-muted mb-2">No fines found</h4>
                <p className="text-muted mb-0">
                  {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'No fines to display'}
                </p>
              </Card.Body>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Book Title</th>
                      <th>User</th>
                      <th>Days Overdue</th>
                      <th>Fine Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFines.map((fine) => (
                      <tr key={fine.loanId}>
                        <td>
                          <strong className="small">{fine.title}</strong>
                        </td>
                        <td>
                          <span className="small">{fine.userName}</span>
                        </td>
                        <td>
                          <Badge bg="warning" text="dark">
                            {fine.daysOverdue} days
                          </Badge>
                        </td>
                        <td>
                          <strong className="small">${fine.fineAmount.toFixed(2)}</strong>
                        </td>
                        <td>
                          <Badge bg={fine.paid ? 'success' : 'danger'}>
                            {fine.paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </td>
                        <td>
                          {!fine.paid && (
                            <Button
                              size="sm"
                              variant="success"
                              className="d-inline-flex align-items-center gap-1"
                              onClick={() => handlePayFine(fine.loanId)}
                            >
                              <Check size={14} />
                              Pay Fine
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default FineCollection;
