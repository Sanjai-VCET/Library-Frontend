import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Form,
  Table,
  Badge,
  Button,
  Card,
  Alert,
  Row,
  Col
} from 'react-bootstrap';
import {
  Search,
  ClockHistory,
  ExclamationTriangle,
  Check,
  Calendar,
  Person,
  Book
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

const BorrowingHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [searchRollno, setSearchRollno] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role);

        const historyRes = await axios.get('http://localhost:3000/api/borrowing/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
        toast.error('Failed to load borrowing history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleReturn = async (id) => {
    if (!window.confirm('Are you sure you want to mark this book as returned?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3000/api/borrowing/return/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(history.map((record) =>
        record.id === id ? { ...record, status: 'returned', return_date: new Date().toISOString() } : record
      ));
      toast.success('Book marked as returned');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book');
    }
  };

  const filteredHistory = history.filter(record =>
    record.rollno?.toLowerCase().includes(searchRollno.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed': return 'primary';
      case 'returned': return 'success';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

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
            <ClockHistory size={32} color="var(--bs-primary)" className="me-3" />
            <div>
              <h1 className="text-primary mb-1">
                Borrowing History
              </h1>
              <p className="text-muted fs-5 mb-0">
                Track all borrowing activities
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={staggerItem}>
          <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
            <Card.Body>
              <Form.Group className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                <Form.Control
                  type="text"
                  placeholder="Search by roll number..."
                  value={searchRollno}
                  onChange={(e) => setSearchRollno(e.target.value)}
                  className="ps-5 border-0 bg-transparent"
                />
              </Form.Group>
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

        {/* History Table */}
        <motion.div variants={staggerItem}>
          <Card className={theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}>
            {filteredHistory.length === 0 ? (
              <Card.Body className="text-center py-5">
                <Book size={48} className="text-muted mb-3" />
                <h3 className="text-muted mb-2">
                  No borrowing history found
                </h3>
                <p className="text-muted">
                  {searchRollno ? 'Try adjusting your search' : 'Borrowing records will appear here'}
                </p>
              </Card.Body>
            ) : (
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Roll No</th>
                      <th>Book</th>
                      <th>Author</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      {userRole === 'librarian' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Person size={16} />
                            <small>{record.name || 'N/A'}</small>
                          </div>
                        </td>
                        <td>
                          <small className="fw-semibold">{record.rollno || 'N/A'}</small>
                        </td>
                        <td>
                          <small className="fw-semibold">{record.title || 'N/A'}</small>
                        </td>
                        <td>
                          <small className="text-muted">{record.author || 'N/A'}</small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={14} />
                            <small>
                              {record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={14} />
                            <small>
                              {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getStatusColor(record.status)}>
                            {record.status || 'N/A'}
                          </Badge>
                        </td>
                        {userRole === 'librarian' && (
                          <td>
                            {record.status === 'borrowed' && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => handleReturn(record.id)}
                                className="d-flex align-items-center gap-1"
                              >
                                <Check size={14} />
                                Return
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Stats */}
        {filteredHistory.length > 0 && (
          <motion.div variants={staggerItem}>
            <Card className={`mt-4 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
              <Card.Body>
                <Row className="text-center">
                  <Col>
                    <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {filteredHistory.filter(r => r.status === 'borrowed').length}
                    </div>
                    <div className="text-muted small">Active</div>
                  </Col>
                  <Col>
                    <div className="text-success" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {filteredHistory.filter(r => r.status === 'returned').length}
                    </div>
                    <div className="text-muted small">Returned</div>
                  </Col>
                  <Col>
                    <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {filteredHistory.length}
                    </div>
                    <div className="text-muted small">Total</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default BorrowingHistory;