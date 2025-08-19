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
  Modal,
  Alert,
  Table
} from 'react-bootstrap';
import {
  Book,
  Plus,
  Search,
  PencilSquare,
  Trash,
  Eye,
  ExclamationTriangle,
  Check,
  Bookmark,
  Person,
  Calendar
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { staggerContainer, staggerItem, hoverScale, fadeInUp } from '../utils/animations';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch books
        const booksRes = await axios.get('http://localhost:3000/api/book');
        setBooks(booksRes.data);

        // Fetch user info if token exists
        const token = localStorage.getItem('token');
        if (token) {
          const userRes = await axios.get('http://localhost:3000/api/user/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddBook = () => {
    navigate('/books/add');
  };

  const handleEditBook = (id) => {
    navigate(`/books/edit/${id}`);
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/book/${book.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((b) => b.id !== book.id));
      toast.success('Book deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const filteredBooks = books.filter(book => {
    const term = searchTerm.toLowerCase();
    return (
      book.title?.toLowerCase().includes(term) ||
      book.author?.toLowerCase().includes(term) ||
      book.isbn?.toLowerCase().includes(term)
    );
  });

  const BookCard = ({ book, index }) => (
    <motion.div
      variants={staggerItem}
      whileHover={hoverScale}
      style={{ height: '100%' }}
    >
      <Card
        className={`h-100 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}
        style={{
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: book.quantity > 0 ? 'var(--bs-success)' : 'var(--bs-danger)'
          }}
        />

        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--bs-primary)',
                color: 'white'
              }}
            >
              <Book size={24} />
            </div>
            <Badge bg={book.quantity > 0 ? 'success' : 'danger'}>
              {book.quantity > 0 ? 'Available' : 'Out of Stock'}
            </Badge>
          </div>

          <Card.Title className="mb-2" style={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
            {book.title}
          </Card.Title>
          
          <Card.Text className="text-muted mb-2 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
            <Person size={14} className="me-1" />
            {book.author}
          </Card.Text>
          
          <Card.Text className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>
            ISBN: {book.isbn}
          </Card.Text>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Bookmark size={16} color="var(--bs-primary)" className="me-1" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {book.quantity} copies
              </span>
            </div>

            {user?.role === 'librarian' && (
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  title="Edit Book"
                  onClick={() => handleEditBook(book.id)}
                >
                  <PencilSquare size={14} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Delete Book"
                  onClick={() => handleDeleteBook(book)}
                >
                  <Trash size={14} />
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <Row>
      {Array.from({ length: 8 }).map((_, index) => (
        <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <div className="placeholder-glow">
                <div className="placeholder bg-secondary rounded mb-3" style={{ height: '60px' }}></div>
                <div className="placeholder bg-secondary rounded mb-2" style={{ height: '20px' }}></div>
                <div className="placeholder bg-secondary rounded mb-2" style={{ height: '16px' }}></div>
                <div className="placeholder bg-secondary rounded mb-3" style={{ height: '14px' }}></div>
                <div className="d-flex justify-content-between">
                  <div className="placeholder bg-secondary rounded" style={{ height: '20px', width: '80px' }}></div>
                  <div className="d-flex gap-1">
                    <div className="placeholder bg-secondary rounded" style={{ height: '28px', width: '28px' }}></div>
                    <div className="placeholder bg-secondary rounded" style={{ height: '28px', width: '28px' }}></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container size="xl" py="xl">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1
                className="mb-2"
                style={{
                  background: 'var(--bs-primary)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700
                }}
              >
                Library Collection
              </h1>
              <p className="text-muted fs-5 mb-0">
                Discover and manage our book collection
              </p>
            </div>
            {user?.role === 'librarian' && (
              <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleAddBook}
                  className="d-flex align-items-center gap-2"
                >
                  <Plus size={16} />
                  Add New Book
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={staggerItem}>
          <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
            <Card.Body>
              <Form.Group className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                <Form.Control
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5 border-0 bg-transparent"
                  style={{ fontSize: '16px' }}
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

        {/* Books Grid */}
        <motion.div variants={staggerItem}>
          {loading ? (
            <LoadingSkeleton />
          ) : filteredBooks.length === 0 ? (
            <Card className={`text-center py-5 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
              <Card.Body>
                <Book size={48} className="text-muted mb-3" />
                <h3 className="text-muted mb-2">
                  {searchTerm ? 'No books found' : 'No books available'}
                </h3>
                <p className="text-muted">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Books will appear here once they are added to the library'
                  }
                </p>
              </Card.Body>
            </Card>
          ) : (
            <motion.div variants={staggerContainer}>
              <Row>
                {filteredBooks.map((book, index) => (
                  <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <BookCard book={book} index={index} />
                  </Col>
                ))}
              </Row>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {!loading && filteredBooks.length > 0 && (
          <motion.div variants={staggerItem}>
            <Card className={`mt-4 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
              <Card.Body>
                <Row className="text-center">
                  <Col>
                    <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {filteredBooks.length}
                    </div>
                    <div className="text-muted small">
                      {searchTerm ? 'Found' : 'Total'} Books
                    </div>
                  </Col>
                  <Col>
                    <div className="text-success" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {filteredBooks.filter(b => b.quantity > 0).length}
                    </div>
                    <div className="text-muted small">
                      Available
                    </div>
                  </Col>
                  <Col>
                    <div className="text-danger" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {filteredBooks.filter(b => b.quantity === 0).length}
                    </div>
                    <div className="text-muted small">
                      Out of Stock
                    </div>
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

export default Books;