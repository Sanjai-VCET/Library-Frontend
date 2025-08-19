import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Container, Card, Row, Col, Badge, Button, Form, Alert, Table } from 'react-bootstrap';
import { ExclamationTriangle, Search, Eye } from 'react-bootstrap-icons';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get('http://localhost:3000/api/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const booksRes = await axios.get('http://localhost:3000/api/book', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(booksRes.data);

        const finesRes = await axios.get('http://localhost:3000/api/fine/calculate', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFines(finesRes.data.fines);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handlePayFine = async (loanId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/api/fine/pay', { loanId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFines(fines.filter(fine => fine.loanId !== loanId));
  alert('Fine paid successfully');
    } catch (err) {
  setError(err.response?.data?.message || 'Failed to pay fine');
    }
  };

  const term = searchTerm.toLowerCase().trim();
  const filteredBooks = books.filter(book => {
    if (!term) return true;
    const title = (book.title || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    const isbn = (book.isbn || '').toLowerCase();
    return title.includes(term) || author.includes(term) || isbn.includes(term);
  });

  const totalFines = fines.reduce((sum, f) => sum + f.fineAmount, 0);
  const stats = [
    { title: 'Total Books', value: books.length, color: 'primary' },
    { title: 'Active Loans', value: fines.length, color: 'success' },
    { title: 'Outstanding Fines', value: `$${totalFines.toFixed(2)}`, color: 'danger' },
    { title: 'Books Available', value: books.filter(b => b.quantity > 0).length, color: 'warning' }
  ];

  const quickActions = [
    { title: 'Browse Books', description: 'Explore our collection', action: () => navigate('/books') },
    { title: 'Borrowing History', description: 'View your loans', action: () => navigate('/borrowing/history') },
    { title: 'Fine Collection', description: 'Manage your fines', action: () => navigate('/fines/collection') },
    { title: 'Fine Status', description: 'Check fine details', action: () => navigate('/fines/status') }
  ];

  if (user?.role === 'librarian') {
    quickActions.splice(1, 0, {
      title: 'Librarian Dashboard',
      description: 'Manage library operations',
      action: () => navigate('/borrowing/dashboard')
    });
  }

  if (loading) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <p className="mb-0">Loading dashboard...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Dashboard</h2>
            {user && <p className="text-muted mb-0">Welcome back, {user.name}! 👋</p>}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="d-flex align-items-center mb-4">
            <ExclamationTriangle className="me-2" size={16} />
            {error}
          </Alert>
        )}

        {/* User Profile Card */}
        {user && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h5 className="mb-2">{user.name}</h5>
              <Badge bg="primary" className="mt-1">{user.role}</Badge>
            </Card.Body>
          </Card>
        )}

        {/* Stats Grid */}
        <Row className="g-3 mb-5">
          {stats.map((s) => (
            <Col key={s.title} xs={12} sm={6} md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <p className="text-muted small mb-1">{s.title}</p>
                  <h4 className="mb-0">{s.value}</h4>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="mb-3">Quick Actions</h4>
          <Row className="g-3 mb-4">
            {quickActions.map((action) => (
              <Col key={action.title} xs={12} md={6} lg={4}>
                <Card 
                  className="border-0 shadow-sm h-100" 
                  style={{ cursor: 'pointer' }}
                  onClick={action.action}
                >
                  <Card.Body className="p-4">
                    <h6 className="mb-2">{action.title}</h6>
                    <p className="text-muted small mb-0">{action.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Fines Section */}
        {fines.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-danger mb-0">Outstanding Fines</h5>
                  <Badge bg="danger">${totalFines.toFixed(2)}</Badge>
                </div>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Loan ID</th>
                        <th>Title</th>
                        <th>Days Overdue</th>
                        <th>Fine Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fines.map(fine => (
                        <tr key={fine.loanId}>
                          <td>{fine.loanId}</td>
                          <td>{fine.title}</td>
                          <td>
                            <Badge bg="warning" text="dark">{fine.daysOverdue} days</Badge>
                          </td>
                          <td>${fine.fineAmount.toFixed(2)}</td>
                          <td>
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => handlePayFine(fine.loanId)}
                            >
                              Pay Fine
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Books Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Library Collection</h5>
                <div className="position-relative" style={{ width: '250px' }}>
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
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-5"
                  />
                </div>
              </div>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>ISBN</th>
                      <th>Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <span className="text-muted">No books found</span>
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.slice(0, 10).map((book) => (
                        <tr key={book.id}>
                          <td><strong>{book.title || 'N/A'}</strong></td>
                          <td>{book.author || 'N/A'}</td>
                          <td><span className="text-muted small">{book.isbn || 'N/A'}</span></td>
                          <td>
                            <Badge bg={book.quantity > 0 ? 'success' : 'danger'}>
                              {book.quantity || 0} copies
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {filteredBooks.length > 10 && (
                <div className="text-center mt-3">
                  <Button 
                    variant="primary" 
                    className="d-inline-flex align-items-center gap-2"
                    onClick={() => navigate('/books')}
                  >
                    <Eye size={16} />
                    View All Books
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Dashboard;