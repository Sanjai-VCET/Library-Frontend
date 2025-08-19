import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  ExclamationTriangle, 
  PersonPlus, 
  Person, 
  Lock, 
  CardText,
  Shield
} from 'react-bootstrap-icons';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp, scaleIn, hoverScale } from '../utils/animations';

const Register = () => {
  const [name, setName] = useState('');
  const [rollno, setRollno] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        rollno,
        password,
        role,
      });
      localStorage.setItem('token', res.data.token);
      console.log('Registration successful');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-4 position-relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Background Elements */}
      <div
        className="position-absolute"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at 30% 20%, ${theme.colors.primary}20 0%, transparent 50%), 
                       radial-gradient(circle at 70% 80%, ${theme.colors.secondary}15 0%, transparent 50%)`,
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0
        }}
      />

      <Container className="position-relative" style={{ maxWidth: '460px', zIndex: 1 }}>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Logo Section */}
          <motion.div
            variants={scaleIn}
            className="text-center mb-5"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-4"
              style={{
                width: '5rem',
                height: '5rem',
                background: `linear-gradient(135deg, ${theme.colors.success}, ${theme.colors.info})`,
                fontSize: '2.5rem',
                boxShadow: `0 20px 40px ${theme.colors.shadow}`
              }}
            >
              <PersonPlus size={32} className="text-white" />
            </motion.div>
            <h1
              className="mb-2 fw-bold"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.success}, ${theme.colors.info})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2rem'
              }}
            >
              Join Library
            </h1>
            <p className="text-muted fs-5">
              Create your account to get started
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div variants={scaleIn}>
            <Card
              className="border-0 shadow-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem'
              }}
            >
              <Card.Body className="p-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="danger" className="d-flex align-items-center mb-3 rounded-3">
                      <ExclamationTriangle className="me-2" size={16} />
                      <div>
                        <strong>Registration Error</strong>
                        <div className="small">{error}</div>
                      </div>
                    </Alert>
                  </motion.div>
                )}

                <Form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Full Name</Form.Label>
                      <div className="position-relative">
                        <Person 
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
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="ps-5 py-2 rounded-3"
                          style={{
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </Form.Group>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Roll Number</Form.Label>
                      <div className="position-relative">
                        <CardText 
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
                          placeholder="Enter your roll number"
                          value={rollno}
                          onChange={(e) => setRollno(e.target.value)}
                          required
                          className="ps-5 py-2 rounded-3"
                          style={{
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </Form.Group>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Password</Form.Label>
                      <div className="position-relative">
                        <Lock 
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
                          type="password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="ps-5 py-2 rounded-3"
                          style={{
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </Form.Group>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Role</Form.Label>
                      <div className="position-relative">
                        <Shield 
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
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="ps-5 py-2 rounded-3"
                          style={{
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            fontSize: '1rem'
                          }}
                        >
                          <option value="member">👤 Library Member</option>
                          <option value="librarian">👨‍💼 Librarian</option>
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={hoverScale}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-100 py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.success}, ${theme.colors.info})`,
                        border: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <PersonPlus size={16} />
                          Create Account
                        </>
                      )}
                    </Button>
                  </motion.div>
                </Form>

                <hr className="my-4" style={{ opacity: 0.3 }} />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ color: theme.colors.success }}
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;