import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navbar, 
  Nav, 
  Container, 
  Offcanvas, 
  Badge, 
  Dropdown,
  Button
} from 'react-bootstrap';
import { 
  Book, 
  HouseDoor, 
  ClockHistory, 
  CurrencyDollar,
  Person,
  Gear,
  BoxArrowRight,
  Bell,
  List
} from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { fadeInUp, hoverScale } from '../utils/animations';

const AppNavbar = ({ children }) => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: HouseDoor,
      active: pathname === '/dashboard'
    },
    { 
      label: 'Books', 
      path: '/books', 
      icon: Book,
      active: pathname.startsWith('/books')
    },
    { 
      label: 'Borrowing', 
      path: '/borrowing/history', 
      icon: ClockHistory,
      active: pathname.startsWith('/borrowing')
    },
    { 
      label: 'Fines', 
      path: '/fines/collection', 
      icon: CurrencyDollar,
      active: pathname.startsWith('/fines')
    }
  ];

  const NavLink = ({ item, mobile = false, onClick }) => {
    const Icon = item.icon;
    
    return (
      <motion.div
        whileHover={hoverScale}
        whileTap={{ scale: 0.95 }}
      >
        <Nav.Link
          as={Link}
          to={item.path}
          onClick={onClick}
          className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
            item.active ? 'bg-primary text-white fw-semibold' : 'text-body'
          }`}
          style={{
            backgroundColor: item.active ? theme.colors.primary : 'transparent',
            color: item.active ? 'white' : theme.colors.text,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            border: 'none'
          }}
        >
          <Icon size={20} />
          <span className="fs-6">{item.label}</span>
        </Nav.Link>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Navbar 
          expand="lg" 
          className="sticky-top mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '0 0 1.5rem 1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '1rem 0'
          }}
        >
          <Container fluid className="px-4">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: theme.colors.primary,
                    fontSize: '1.25rem'
                  }}
                >
                  📚
                </div>
                <span 
                  className="h4 mb-0 fw-bold"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Library
                </span>
              </Navbar.Brand>
            </motion.div>

            {/* Desktop Navigation */}
            <Nav className="mx-auto d-none d-lg-flex gap-1">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </Nav>

            {/* Right Section */}
            <div className="d-flex align-items-center gap-3">
              {/* Notifications */}
              <motion.div whileHover={hoverScale}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="position-relative rounded-3 p-2"
                  style={{ border: `1px solid ${theme.colors.border}` }}
                >
                  <Bell size={20} />
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    3
                  </Badge>
                </Button>
              </motion.div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <Dropdown>
                <Dropdown.Toggle
                  as={motion.button}
                  whileHover={hoverScale}
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-3 p-2 d-flex align-items-center gap-2 border"
                  style={{ 
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: 'transparent'
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: theme.colors.primary
                    }}
                  >
                    <Person size={16} className="text-white" />
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="shadow-lg border-0 rounded-3">
                  <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                    <Person size={16} />
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                    <Gear size={16} />
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    className="d-flex align-items-center gap-2 py-2 text-danger"
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                  >
                    <BoxArrowRight size={16} />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Mobile Menu Toggle */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-lg-none rounded-3 p-2"
                onClick={() => setShowOffcanvas(true)}
              >
                <List size={20} />
              </Button>
            </div>
          </Container>
        </Navbar>
      </motion.div>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        className="w-75"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-2">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                item={item} 
                mobile 
                onClick={() => setShowOffcanvas(false)}
              />
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {children}
    </>
  );
};

export default AppNavbar;
