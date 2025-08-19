import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Alert
} from 'react-bootstrap';
import {
  Book,
  Plus,
  Search,
  PencilSquare,
  ExclamationTriangle
} from 'react-bootstrap-icons';
import axios from 'axios';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [userRes, booksRes] = await Promise.all([
          axios.get('http://localhost:3000/api/user/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/api/book', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setBooks(booksRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading books...</p>
        </div>
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
          <div className="d-flex align-items-center">
            <Book size={32} className="text-primary me-3" />
            <div>
              <h1 className="mb-1 text-primary">Library Books</h1>
              <p className="text-muted mb-0">Browse our collection</p>
            </div>
          </div>
          {user?.role === 'librarian' && (
            <Button 
              variant="primary" 
              className="d-inline-flex align-items-center gap-2"
              onClick={() => navigate('/books/add')}
            >
              <Plus size={16} />
              Add Book
            </Button>
          )}
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3">
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
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-5"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="d-flex align-items-center mb-4">
            <ExclamationTriangle className="me-2" size={16} />
            {error}
          </Alert>
        )}

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <Book size={48} className="text-muted mb-3" />
              <h4 className="text-muted mb-2">No books found</h4>
              <p className="text-muted mb-0">
                {searchTerm ? 'Try adjusting your search terms' : 'No books available'}
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-3">
            {filteredBooks.map((book) => (
              <Col key={book.id} xs={12} sm={6} md={4} lg={3}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-3">
                      <h6 className="fw-bold mb-2">{book.title}</h6>
                      <p className="text-muted small mb-2">by {book.author}</p>
                      <p className="text-muted small mb-3">ISBN: {book.isbn}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg={book.quantity > 0 ? 'success' : 'danger'}>
                          {book.quantity > 0 ? `${book.quantity} available` : 'Out of stock'}
                        </Badge>
                        {user?.role === 'librarian' && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate(`/books/edit/${book.id}`)}
                          >
                            <PencilSquare size={14} />
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </motion.div>
    </Container>
  );
};

export default Books;
