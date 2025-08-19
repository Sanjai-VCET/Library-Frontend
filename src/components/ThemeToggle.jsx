/**
 * Modern Theme Toggle Component with Bootstrap
 * Beautiful animated toggle for switching between light and dark themes
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { Sun, Moon } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';
import { hoverScale } from '../utils/animations';

const ThemeToggle = ({ size = 'sm' }) => {
  const { themeMode, setThemeMode, isTransitioning, isDark, theme } = useTheme();

  const handleToggle = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <motion.div
      whileHover={hoverScale}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="outline-secondary"
        size={size}
        onClick={handleToggle}
        disabled={isTransitioning}
        className="rounded-3 p-2 position-relative overflow-hidden"
        style={{
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {/* Background gradient animation */}
        <motion.div
          className="position-absolute"
          style={{
            inset: 0,
            background: isDark 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            opacity: 0.1,
            borderRadius: '0.75rem'
          }}
          animate={{
            opacity: isTransitioning ? 0.3 : 0.1,
            scale: isTransitioning ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon container */}
        <motion.div
          className="position-relative"
          style={{ zIndex: 1 }}
          animate={{
            rotate: isTransitioning ? 180 : 0,
            scale: isTransitioning ? 0.8 : 1
          }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
                }}
              >
                <Sun size={20} className="text-warning" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))'
                }}
              >
                <Moon size={20} className="text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ripple effect on click */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="position-absolute rounded-3"
              style={{
                inset: 0,
                backgroundColor: theme.colors.primary,
                opacity: 0.2
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;