/**
 * Enhanced Theme Context with Bootstrap integration
 * Provides theme management, persistence, and animation-aware theming
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion, getAnimationDuration, EASING } from '../utils/animations';

// Modern theme configuration with Bootstrap-compatible colors
const THEME_CONFIG = {
  light: {
    name: 'light',
    colors: {
      // Bootstrap primary colors
      primary: '#0d6efd',
      primaryHover: '#0b5ed7',
      primaryActive: '#0a58ca',
      
      // Bootstrap secondary colors
      secondary: '#6c757d',
      success: '#198754',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#0dcaf0',
      
      // Background colors
      background: '#ffffff',
      backgroundSecondary: '#f8f9fa',
      
      // Surface colors
      surface: '#ffffff',
      surface2: 'rgba(0, 0, 0, 0.03)',
      surface3: 'rgba(0, 0, 0, 0.06)',
      
      // Text colors
      text: '#212529',
      textMuted: '#6c757d',
      textLight: '#adb5bd',
      
      // Border and shadow
      border: '#dee2e6',
      shadow: 'rgba(0, 0, 0, 0.15)',
      shadowHover: 'rgba(0, 0, 0, 0.25)',
    },
    animations: {
      duration: 'normal',
      enableComplexAnimations: true
    }
  },
  dark: {
    name: 'dark',
    colors: {
      // Bootstrap primary colors (adjusted for dark mode)
      primary: '#0d6efd',
      primaryHover: '#3485fd',
      primaryActive: '#0b5ed7',
      
      // Bootstrap secondary colors (dark mode)
      secondary: '#6c757d',
      success: '#198754',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#0dcaf0',
      
      // Dark backgrounds
      background: '#212529',
      backgroundSecondary: '#343a40',
      
      // Dark surfaces
      surface: '#343a40',
      surface2: 'rgba(255, 255, 255, 0.05)',
      surface3: 'rgba(255, 255, 255, 0.1)',
      
      // Dark text
      text: '#ffffff',
      textMuted: '#adb5bd',
      textLight: '#6c757d',
      
      // Dark borders and shadows
      border: '#495057',
      shadow: 'rgba(0, 0, 0, 0.5)',
      shadowHover: 'rgba(0, 0, 0, 0.7)',
    },
    animations: {
      duration: 'normal',
      enableComplexAnimations: true
    }
  },
  auto: {
    name: 'auto',
    // Will be resolved to light or dark based on system preference
  }
};

// Theme transition animation variants
const themeTransitionVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: prefersReducedMotion() ? 0.01 : 0.3,
      ease: EASING.easeInOut
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.01 : 0.15,
      ease: EASING.easeIn
    }
  }
};

// Create Theme Context
const ThemeContext = createContext({
  theme: THEME_CONFIG.dark,
  themeMode: 'dark',
  setThemeMode: () => {},
  isTransitioning: false,
  systemPreference: 'dark'
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState('dark');
  const [systemPreference, setSystemPreference] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState(THEME_CONFIG.dark);

  // Detect system theme preference
  const detectSystemTheme = useCallback(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  }, []);

  // Apply theme to CSS variables and Bootstrap
  const applyThemeToCSS = useCallback((themeConfig) => {
    const root = document.documentElement;
    
    // Apply custom CSS variables
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      const cssVar = `--brand-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Apply Bootstrap theme attribute
    root.setAttribute('data-bs-theme', themeConfig.name);
    
    // Apply theme class to body
    document.body.className = document.body.className
      .replace(/\b(light-theme|dark-theme)\b/g, '')
      .trim();
    document.body.classList.add(`${themeConfig.name}-theme`);
  }, []);

  // Resolve theme based on mode
  const resolveTheme = useCallback((mode) => {
    if (mode === 'auto') {
      return THEME_CONFIG[systemPreference];
    }
    return THEME_CONFIG[mode];
  }, [systemPreference]);

  // Set theme mode with smooth transition
  const setThemeMode = useCallback(async (newMode) => {
    if (newMode === themeMode) return;

    setIsTransitioning(true);
    
    // Small delay to allow transition animation to start
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const newTheme = resolveTheme(newMode);
    
    // Apply theme with transition
    if (!prefersReducedMotion()) {
      // Add transition styles
      document.documentElement.style.transition = 'all 0.3s ease-in-out';
    }
    
    applyThemeToCSS(newTheme);
    setTheme(newTheme);
    setThemeModeState(newMode);
    
    // Save to localStorage
    try {
      localStorage.setItem('library-theme-mode', newMode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
    
    // Remove transition styles after animation
    setTimeout(() => {
      document.documentElement.style.transition = '';
      setIsTransitioning(false);
    }, prefersReducedMotion() ? 10 : 300);
  }, [themeMode, resolveTheme, applyThemeToCSS]);

  // Initialize theme on mount
  useEffect(() => {
    // Detect system preference
    const systemTheme = detectSystemTheme();
    setSystemPreference(systemTheme);

    // Load saved theme preference
    let savedTheme = 'dark'; // default
    try {
      savedTheme = localStorage.getItem('library-theme-mode') || 'dark';
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }

    // Validate saved theme
    if (!THEME_CONFIG[savedTheme]) {
      savedTheme = 'dark';
    }

    const initialTheme = resolveTheme(savedTheme);
    applyThemeToCSS(initialTheme);
    setTheme(initialTheme);
    setThemeModeState(savedTheme);
  }, [detectSystemTheme, resolveTheme, applyThemeToCSS]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const newSystemPreference = e.matches ? 'dark' : 'light';
      setSystemPreference(newSystemPreference);
      
      // If current mode is auto, update theme
      if (themeMode === 'auto') {
        const newTheme = THEME_CONFIG[newSystemPreference];
        applyThemeToCSS(newTheme);
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [themeMode, applyThemeToCSS]);

  // Context value
  const contextValue = {
    theme,
    themeMode,
    setThemeMode,
    isTransitioning,
    systemPreference,
    availableThemes: Object.keys(THEME_CONFIG),
    isDark: theme.name === 'dark',
    isLight: theme.name === 'light'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <motion.div
          key={theme.name}
          variants={themeTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ 
            minHeight: '100vh',
            backgroundColor: theme.colors.background,
            color: theme.colors.text
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Theme-aware component wrapper
export const ThemeAware = ({ children, className = '', ...props }) => {
  const { theme, isTransitioning } = useTheme();
  
  return (
    <div 
      className={`theme-aware ${className} ${isTransitioning ? 'theme-transitioning' : ''}`}
      data-theme={theme.name}
      {...props}
    >
      {children}
    </div>
  );
};

// Hook for theme-aware animations
export const useThemeAwareAnimation = (baseVariants) => {
  const { theme, isTransitioning } = useTheme();
  
  return {
    ...baseVariants,
    transition: {
      ...baseVariants.transition,
      duration: isTransitioning 
        ? getAnimationDuration('fast') 
        : getAnimationDuration(theme.animations?.duration || 'normal')
    }
  };
};

export default ThemeContext;