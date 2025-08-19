import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { pageTransition } from './utils/animations';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import BorrowingHistory from './pages/BorrowingHistory';
import LibrarianBorrowingDashboard from './pages/LibrarianBorrowingDashboard';
import FineCollection from './pages/FineCollection';
import FineStatus from './pages/FineStatus';
import AppNavbar from './components/Navbar';
import AppFooter from './components/Footer';

// Animated Routes component
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/edit/:id" element={<EditBook />} />
          <Route path="/borrowing/history" element={<BorrowingHistory />} />
          <Route path="/borrowing/dashboard" element={<LibrarianBorrowingDashboard />} />
          <Route path="/fines/collection" element={<FineCollection />} />
          <Route path="/fines/status" element={<FineStatus />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppNavbar>
          <AnimatedRoutes />
          <AppFooter />
        </AppNavbar>
      </Router>
    </ThemeProvider>
  );
}

export default App;
