import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Breadcrumb,
  Spinner
} from 'react-bootstrap';
import {
  ExclamationTriangle,
  Book,
  Person,
  CardText,
  Hash,
  ArrowLeft,
  Check,
  PencilSquare
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp, scaleIn, hoverScale } from '../utils/animations';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setIsbn(res.data.isbn);
        setQuantity(res.data.quantity);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load book';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3000/api/book/${id}`,
        { title, author, isbn, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Book updated successfully');

      navigate('/books');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update book';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4" style={{ maxWidth: '600px' }}>
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">Loading book details...</p>
        </div>
      </Container>
    );
  }

  return (
    <div
      className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      style={{ padding: '20px' }}
    >
      <Container className="py-4" style={{ maxWidth: '600px' }}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Breadcrumbs */}
          <motion.div variants={scaleIn}>
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item 
                onClick={() => navigate('/books')}
                style={{ cursor: 'pointer', color: 'var(--bs-primary)' }}
              >
                Books
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Edit Book</Breadcrumb.Item>
            </Breadcrumb>
          </motion.div>

          {/* Header */}
          <motion.div variants={scaleIn}>
            <div className="mb-4">
              <motion.div whileHover={hoverScale} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/books')}
                  className="d-flex align-items-center gap-2 mb-3"
                >
                  <ArrowLeft size={16} />
                  Back to Books
                </Button>
              </motion.div>
            </div>

            <div className="text-center mb-5">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--bs-primary)',
                  fontSize: '40px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              >
                ✏️
              </motion.div>
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
                Edit Book
              </h1>
              <p className="text-muted fs-5">
                Update book information
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={scaleIn}>
            <Card
              className={`${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}
              style={{
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <Card.Body className="p-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="danger" className="mb-3 d-flex align-items-center">
                      <ExclamationTriangle size={16} className="me-2" />
                      <div>
                        <strong>Error</strong>
                        <div>{error}</div>
                      </div>
                    </Alert>
                  </motion.div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <Book size={16} />
                      Book Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the book title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <Person size={16} />
                      Author
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the author's name"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                      className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <CardText size={16} />
                      ISBN
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the ISBN number"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      required
                      className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <Hash size={16} />
                      Quantity
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter the number of copies"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      required
                      min={0}
                      max={1000}
                      className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                    />
                  </Form.Group>

                  <motion.div
                    whileHover={hoverScale}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                      disabled={submitting}
                      style={{ fontSize: '16px', fontWeight: 600 }}
                    >
                      {submitting ? (
                        'Updating...'
                      ) : (
                        <>
                          <PencilSquare size={16} />
                          Update Book
                        </>
                      )}
                    </Button>
                  </motion.div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default EditBook;