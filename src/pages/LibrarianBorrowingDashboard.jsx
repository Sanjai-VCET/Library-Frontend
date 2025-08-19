import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  Alert,
  Spinner
} from 'react-bootstrap';
import {
  Gear,
  Book,
  Person,
  Calendar,
  Check,
  ExclamationTriangle,
  Plus,
  Clock,
  Bookmark
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp, staggerContainer, staggerItem, hoverScale } from '../utils/animations';

const LibrarianBorrowingDashboard = () => {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [rollno, setRollno] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const recordsRes = await axios.get('http://localhost:3000/api/borrowing/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(recordsRes.data);

        const booksRes = await axios.get('http://localhost:3000/api/book');
        setBooks(booksRes.data.filter(book => book.quantity > 0));

        const usersRes = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        if (err.response?.status === 403) {
          navigate('/dashboard');
        }
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:3000/api/borrowing',
        { book_id: parseInt(bookId), rollno },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const recordsRes = await axios.get('http://localhost:3000/api/borrowing/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(recordsRes.data);
      setBookId('');
      setRollno('');
      
      toast.success('Book borrowed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Are you sure you want to mark this book as returned?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3000/api/borrowing/return/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(records.map((record) =>
        record.id === id ? { ...record, status: 'returned', return_date: new Date().toISOString() } : record
      ));
      
      toast.success('Book marked as returned');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed': return 'primary';
      case 'returned': return 'success';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const stats = [
    {
      title: 'Total Records',
      value: records.length,
      icon: Clock,
      color: 'primary'
    },
    {
      title: 'Active Loans',
      value: records.filter(r => r.status === 'borrowed').length,
      icon: Bookmark,
      color: 'warning'
    },
    {
      title: 'Returned',
      value: records.filter(r => r.status === 'returned').length,
      icon: Check,
      color: 'success'
    },
    {
      title: 'Available Books',
      value: books.length,
      icon: Book,
      color: 'info'
    }
  ];

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Loading dashboard...</p>
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
            <Gear size={32} className="text-primary me-3" />
            <div>
              <h1 className="text-primary mb-1">
                Librarian Dashboard
              </h1>
              <p className="text-muted fs-5 mb-0">
                Manage book borrowing and returns
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem}>
          <Row className="mb-4">
            {stats.map((stat, index) => (
              <Col key={stat.title} xs={12} sm={6} md={3} className="mb-3">
                <motion.div whileHover={hoverScale}>
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <small className="text-muted">{stat.title}</small>
                        <stat.icon size={20} className={`text-${stat.color}`} />
                      </div>
                      <h4 className={`text-${stat.color} mb-0`}>
                        {stat.value}
                      </h4>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Borrow Book Form */}
        <motion.div variants={staggerItem}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Plus size={24} className="text-primary me-2" />
                <h3 className="mb-0">Issue New Book</h3>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-3 d-flex align-items-center">
                  <ExclamationTriangle size={16} className="me-2" />
                  <div>
                    <strong>Error</strong>
                    <div>{error}</div>
                  </div>
                </Alert>
              )}

              <Form onSubmit={handleBorrow}>
                <Row>
                  <Col xs={12} md={5} className="mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center gap-2">
                        <Book size={16} />
                        Select Book
                      </Form.Label>
                      <Form.Select
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        required
                      >
                        <option value="">Choose a book to issue</option>
                        {books.map(book => (
                          <option key={book.id} value={book.id.toString()}>
                            {book.title} ({book.quantity} available)
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={5} className="mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center gap-2">
                        <Person size={16} />
                        Select User
                      </Form.Label>
                      <Form.Select
                        value={rollno}
                        onChange={(e) => setRollno(e.target.value)}
                        required
                      >
                        <option value="">Choose a user</option>
                        {users.map(user => (
                          <option key={user.rollno} value={user.rollno}>
                            {user.name} ({user.rollno})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={2} className="d-flex align-items-end mb-3">
                    <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }} className="w-100">
                      <Button
                        type="submit"
                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <>
                            <Plus size={16} />
                            Issue Book
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Records Table */}
        <motion.div variants={staggerItem}>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <Clock size={24} className="text-primary me-2" />
              <h3 className="mb-0">All Borrowing Records</h3>
            </Card.Header>

            {records.length === 0 ? (
              <Card.Body className="text-center py-5">
                <Clock size={48} className="text-muted mb-3" />
                <h3 className="text-muted mb-2">
                  No borrowing records found
                </h3>
                <p className="text-muted">
                  Borrowing records will appear here once books are issued
                </p>
              </Card.Body>
            ) : (
              <Card.Body className="p-0">
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Person size={16} />
                              <span>{record.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            <strong>{record.rollno || 'N/A'}</strong>
                          </td>
                          <td>
                            <strong>{record.title || 'N/A'}</strong>
                          </td>
                          <td>
                            <span className="text-muted">{record.author || 'N/A'}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Calendar size={14} />
                              <span>
                                {record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Calendar size={14} />
                              <span>
                                {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <Badge bg={getStatusColor(record.status)}>
                              {record.status || 'N/A'}
                            </Badge>
                          </td>
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
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default LibrarianBorrowingDashboard;