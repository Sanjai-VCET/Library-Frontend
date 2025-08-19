import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { Heart, Code } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp } from '../utils/animations';

const AppFooter = () => {
  const { theme } = useTheme();
  
  return (
    <motion.footer
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="mt-5 position-relative"
      style={{
        padding: '2.5rem 0',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '1.5rem 1.5rem 0 0',
        marginTop: '5rem'
      }}
    >
      {/* Gradient accent */}
      <div
        className="position-absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`,
          borderRadius: '1.5rem 1.5rem 0 0'
        }}
      />
      
      <Container fluid className="px-4">
        <Row className="align-items-center justify-content-between">
          <Col xs="auto">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted small">
                © {new Date().getFullYear()} Library System
              </span>
            </div>
          </Col>
          
          <Col xs="auto">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted small d-flex align-items-center gap-1">
                Built with
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart size={14} className="text-danger" />
                </motion.span>
                using React & Bootstrap
                <Code size={14} />
              </span>
            </div>
          </Col>
        </Row>
        
        <hr 
          className="my-3"
          style={{ 
            border: 'none',
            borderTop: `1px solid ${theme.colors.border}`,
            opacity: 0.5
          }}
        />
        
        <Row>
          <Col className="text-center">
            <small className="text-muted">
              Modern Library Management System with stunning UI design
            </small>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  );
};

export default AppFooter;
