import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Alert,
  Form,
  Spinner
} from 'react-bootstrap';
import {
  Receipt,
  Calendar,
  Filter,
  ExclamationTriangle,
  CurrencyDollar,
  Check,
  Clock
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { staggerContainer, staggerItem, hoverScale } from '../utils/animations';

const FineStatus = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
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
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/fine/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFines(response.data.fines || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load fine status');
      toast.error('Failed to load fine status');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFines = () => {
    let filtered = [...fines];

    // Filter by status
    if (filterStatus === 'paid') {
      filtered = filtered.filter(f => f.paid);
    } else if (filterStatus === 'unpaid') {
      filtered = filtered.filter(f => !f.paid);
    }

    // Filter by date
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(fine => {
        const fineDate = new Date(fine.createdAt || fine.dueDate);
        switch (dateFilter) {
          case 'today':
            return fineDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return fineDate >= weekAgo;
          case 'month':
            return fineDate.getMonth() === now.getMonth() && fineDate.getFullYear() === now.getFullYear();
          case 'year':
            return fineDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredFines = getFilteredFines();

  const stats = [
    {
      title: 'Total Fines',
      value: fines.length,
      icon: Receipt,
      color: 'primary'
    },
    {
      title: 'Paid Fines',
      value: fines.filter(f => f.paid).length,
      icon: Check,
      color: 'success'
    },
    {
      title: 'Unpaid Fines',
      value: fines.filter(f => !f.paid).length,
      icon: Clock,
      color: 'danger'
    },
    {
      title: 'Total Amount',
      value: `$${fines.reduce((sum, f) => sum + f.fineAmount, 0).toFixed(2)}`,
      icon: CurrencyDollar,
      color: 'warning'
    }
  ];

  const FineCard = ({ fine }) => (
    <motion.div whileHover={hoverScale}>
      <Card className={`h-100 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title style={{ fontSize: '1rem', lineHeight: 1.3 }}>{fine.title}</Card.Title>
            <Badge bg={fine.paid ? 'success' : 'danger'}>
              {fine.paid ? 'Paid' : 'Unpaid'}
            </Badge>
          </div>
          <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>{fine.userName}</Card.Text>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Days Overdue:</small>
            <Badge bg="warning" text="dark">
              {fine.daysOverdue} days
            </Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Fine Amount:</small>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              ${fine.fineAmount.toFixed(2)}
            </span>
          </div>
          {fine.paymentDate && (
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">Paid On:</small>
              <small>{new Date(fine.paymentDate).toLocaleDateString()}</small>
            </div>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">Loading fine status...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <div className="d-flex align-items-center mb-4">
            <Receipt size={32} className="text-primary me-3" />
            <div>
              <h1 className="text-primary mb-1">Fine Status & History</h1>
              <p className="text-muted fs-5 mb-0">Track your fine payments and history</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem}>
          <Row className="mb-4">
            {stats.map((stat) => (
              <Col key={stat.title} xs={12} sm={6} md={3} className="mb-3">
                <motion.div whileHover={hoverScale}>
                  <Card className={`h-100 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">{stat.title}</small>
                        <stat.icon size={20} className={`text-${stat.color}`} />
                      </div>
                      <div className={`fs-4 fw-bold text-${stat.color}`}>
                        {stat.value}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem}>
          <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
            <Card.Body>
              <Row className="align-items-end">
                <Col xs={12} md={3} className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <Filter size={16} />
                    Filter by Status
                  </Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  >
                    <option value="all">All Fines</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </Form.Select>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <Calendar size={16} />
                    Filter by Date
                  </Form.Label>
                  <Form.Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </Form.Select>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  <Form.Label>View Mode</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Check
                      type="radio"
                      id="table-view"
                      name="viewMode"
                      label="Table"
                      checked={viewMode === 'table'}
                      onChange={() => setViewMode('table')}
                    />
                    <Form.Check
                      type="radio"
                      id="cards-view"
                      name="viewMode"
                      label="Cards"
                      checked={viewMode === 'cards'}
                      onChange={() => setViewMode('cards')}
                    />
                  </div>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                  <div className="text-end pt-4">
                    <small className="text-muted">
                      Showing {filteredFines.length} of {fines.length} fines
                    </small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div variants={staggerItem}>
            <Alert variant="danger" className="mb-4 d-flex align-items-center">
              <ExclamationTriangle size={16} className="me-2" />
              <div>
                <strong>Error</strong>
                <div>{error}</div>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Content */}
        <motion.div variants={staggerItem}>
          {filteredFines.length === 0 ? (
            <Card className={`text-center py-5 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
              <Card.Body>
                <Receipt size={48} className="text-muted mb-3" />
                <h3 className="text-muted mb-2">No fines found</h3>
                <p className="text-muted">
                  {filterStatus !== 'all' || dateFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'No fine records to display'
                  }
                </p>
              </Card.Body>
            </Card>
          ) : viewMode === 'table' ? (
            <Card className={theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}>
              <Card.Body className="p-0">
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>User</th>
                      <th>Days Overdue</th>
                      <th>Fine Amount</th>
                      <th>Status</th>
                      <th>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFines.map((fine) => (
                      <tr key={fine.loanId}>
                        <td>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{fine.title}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.9rem' }}>{fine.userName}</span>
                        </td>
                        <td>
                          <Badge bg="warning" text="dark">
                            {fine.daysOverdue} days
                          </Badge>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            ${fine.fineAmount.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <Badge bg={fine.paid ? 'success' : 'danger'}>
                            {fine.paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.9rem' }}>
                            {fine.paymentDate 
                              ? new Date(fine.paymentDate).toLocaleDateString() 
                              : 'N/A'
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {filteredFines.map((fine) => (
                <Col key={fine.loanId} xs={12} sm={6} md={4} className="mb-4">
                  <FineCard fine={fine} />
                </Col>
              ))}
            </Row>
          )}
        </motion.div>
      </motion.div>
    </Container>
  );
};


export default FineStatus;
