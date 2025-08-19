/**
 * Accessibility utilities for animations and UI interactions
 * Provides reduced motion support, focus management, and ARIA helpers
 */

import { getAnimationDuration, EASING } from './animations';

// Accessibility preferences detection
export const getAccessibilityPreferences = () => {
  const preferences = {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
    prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  };

  return preferences;
};

// Animation configuration based on accessibility preferences
export const getAccessibleAnimationConfig = () => {
  const prefs = getAccessibilityPreferences();
  
  if (prefs.prefersReducedMotion) {
    return {
      duration: 0.01,
      ease: 'linear',
      enableTransitions: false,
      enableHoverEffects: false,
      enableParallax: false,
      enableComplexAnimations: false
    };
  }

  return {
    duration: getAnimationDuration('normal'),
    ease: EASING.easeOut,
    enableTransitions: true,
    enableHoverEffects: true,
    enableParallax: true,
    enableComplexAnimations: true
  };
};

// Create accessible animation variants
export const createAccessibleVariants = (variants) => {
  const config = getAccessibleAnimationConfig();
  
  if (!config.enableTransitions) {
    // Return minimal variants for reduced motion
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 }
    };
  }

  // Apply accessible timing to variants
  const accessibleVariants = {};
  
  Object.entries(variants).forEach(([key, variant]) => {
    if (typeof variant === 'object' && variant.transition) {
      accessibleVariants[key] = {
        ...variant,
        transition: {
          ...variant.transition,
          duration: config.duration,
          ease: config.ease
        }
      };
    } else {
      accessibleVariants[key] = variant;
    }
  });

  return accessibleVariants;
};

// Focus management utilities
export class FocusManager {
  constructor() {
    this.focusStack = [];
    this.trapStack = [];
  }

  // Save current focus
  saveFocus() {
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  // Restore previous focus
  restoreFocus() {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && typeof previousFocus.focus === 'function') {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        try {
          previousFocus.focus();
        } catch (error) {
          console.warn('Failed to restore focus:', error);
        }
      }, 0);
    }
  }

  // Trap focus within an element
  trapFocus(element) {
    if (!element) return;

    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    this.trapStack.push({ element, handler: handleKeyDown });

    // Focus first element
    firstElement.focus();
  }

  // Remove focus trap
  removeFocusTrap() {
    const trap = this.trapStack.pop();
    if (trap) {
      trap.element.removeEventListener('keydown', trap.handler);
    }
  }

  // Get focusable elements within a container
  getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        return element.offsetWidth > 0 && 
               element.offsetHeight > 0 && 
               !element.hidden;
      });
  }
}

// Global focus manager instance
export const focusManager = new FocusManager();

// ARIA utilities
export const ariaUtils = {
  // Announce to screen readers
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  // Set loading state
  setLoadingState: (element, isLoading, loadingText = 'Loading...') => {
    if (isLoading) {
      element.setAttribute('aria-busy', 'true');
      element.setAttribute('aria-describedby', 'loading-description');
      
      // Create loading description if it doesn't exist
      let loadingDesc = document.getElementById('loading-description');
      if (!loadingDesc) {
        loadingDesc = document.createElement('div');
        loadingDesc.id = 'loading-description';
        loadingDesc.className = 'sr-only';
        document.body.appendChild(loadingDesc);
      }
      loadingDesc.textContent = loadingText;
    } else {
      element.removeAttribute('aria-busy');
      element.removeAttribute('aria-describedby');
      
      const loadingDesc = document.getElementById('loading-description');
      if (loadingDesc) {
        document.body.removeChild(loadingDesc);
      }
    }
  },

  // Set expanded state for collapsible elements
  setExpandedState: (trigger, target, isExpanded) => {
    trigger.setAttribute('aria-expanded', isExpanded.toString());
    target.setAttribute('aria-hidden', (!isExpanded).toString());
    
    if (isExpanded) {
      target.removeAttribute('hidden');
    } else {
      target.setAttribute('hidden', '');
    }
  },

  // Generate unique ID for ARIA relationships
  generateId: (prefix = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Keyboard navigation utilities
export const keyboardUtils = {
  // Handle arrow key navigation in lists
  handleArrowNavigation: (event, items, currentIndex, options = {}) => {
    const { 
      vertical = true, 
      horizontal = false, 
      loop = true,
      onSelect = null 
    } = options;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        if (vertical) {
          event.preventDefault();
          newIndex = loop && currentIndex === items.length - 1 ? 0 : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowUp':
        if (vertical) {
          event.preventDefault();
          newIndex = loop && currentIndex === 0 ? items.length - 1 : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (horizontal) {
          event.preventDefault();
          newIndex = loop && currentIndex === items.length - 1 ? 0 : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowLeft':
        if (horizontal) {
          event.preventDefault();
          newIndex = loop && currentIndex === 0 ? items.length - 1 : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'Enter':
      case ' ':
        if (onSelect) {
          event.preventDefault();
          onSelect(currentIndex);
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
      return newIndex;
    }

    return currentIndex;
  },

  // Handle escape key
  handleEscape: (callback) => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }
};

// Screen reader utilities
export const screenReaderUtils = {
  // Hide element from screen readers
  hideFromScreenReader: (element) => {
    element.setAttribute('aria-hidden', 'true');
  },

  // Show element to screen readers
  showToScreenReader: (element) => {
    element.removeAttribute('aria-hidden');
  },

  // Create screen reader only text
  createSROnlyText: (text) => {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  }
};

// Initialize accessibility features
export const initializeAccessibility = () => {
  // Add screen reader only styles if not present
  if (!document.querySelector('style[data-accessibility]')) {
    const style = document.createElement('style');
    style.setAttribute('data-accessibility', 'true');
    style.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      
      .focus-visible {
        outline: 2px solid var(--brand-primary, #7c3aed) !important;
        outline-offset: 2px !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Listen for accessibility preference changes
  const mediaQueries = [
    '(prefers-reduced-motion: reduce)',
    '(prefers-contrast: high)',
    '(prefers-reduced-transparency: reduce)'
  ];

  mediaQueries.forEach(query => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', () => {
      // Dispatch custom event for preference changes
      window.dispatchEvent(new CustomEvent('accessibilityPreferenceChange', {
        detail: getAccessibilityPreferences()
      }));
    });
  });

  console.log('Accessibility features initialized');
};

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}