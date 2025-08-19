/**
 * Centralized animation configuration and utilities using Framer Motion
 * Provides consistent animation variants, timing, and accessibility controls
 */

// Animation duration constants
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  extra_slow: 0.8
};

// Easing curves for different animation types
export const EASING = {
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: { type: "spring", stiffness: 300, damping: 30 }
};

// Stagger timing for list animations
export const STAGGER = {
  children: 0.1,
  items: 0.05,
  cards: 0.15
};

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get animation duration based on user preference
export const getAnimationDuration = (duration = 'normal') => {
  if (prefersReducedMotion()) {
    return 0.01; // Nearly instant for reduced motion
  }
  return ANIMATION_DURATION[duration] || ANIMATION_DURATION.normal;
};

// Common animation variants
export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: getAnimationDuration('fast'),
      ease: EASING.easeIn
    }
  }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: getAnimationDuration('fast'),
      ease: EASING.easeIn
    }
  }
};

export const slideInLeft = {
  initial: { 
    opacity: 0, 
    x: -30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: {
      duration: getAnimationDuration('fast'),
      ease: EASING.easeIn
    }
  }
};

export const slideInRight = {
  initial: { 
    opacity: 0, 
    x: 30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: {
      duration: getAnimationDuration('fast'),
      ease: EASING.easeIn
    }
  }
};

export const scaleIn = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: getAnimationDuration('fast'),
      ease: EASING.easeIn
    }
  }
};

// Hover and interaction variants
export const hoverScale = {
  scale: prefersReducedMotion() ? 1 : 1.02,
  transition: {
    duration: getAnimationDuration('fast'),
    ease: EASING.easeOut
  }
};

export const tapScale = {
  scale: prefersReducedMotion() ? 1 : 0.98,
  transition: {
    duration: getAnimationDuration('fast'),
    ease: EASING.easeInOut
  }
};

export const hoverElevation = {
  y: prefersReducedMotion() ? 0 : -2,
  boxShadow: prefersReducedMotion() 
    ? "0 0 0 rgba(0,0,0,0)" 
    : "0 10px 24px rgba(0,0,0,0.15)",
  transition: {
    duration: getAnimationDuration('fast'),
    ease: EASING.easeOut
  }
};

// Container variants for staggered animations
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : STAGGER.children,
      delayChildren: prefersReducedMotion() ? 0 : 0.1
    }
  }
};

export const staggerItem = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  }
};

// Loading and skeleton variants
export const pulseAnimation = {
  animate: {
    opacity: prefersReducedMotion() ? 1 : [0.5, 1, 0.5],
    transition: {
      duration: prefersReducedMotion() ? 0 : 1.5,
      repeat: prefersReducedMotion() ? 0 : Infinity,
      ease: EASING.easeInOut
    }
  }
};

export const spinAnimation = {
  animate: {
    rotate: prefersReducedMotion() ? 0 : 360,
    transition: {
      duration: prefersReducedMotion() ? 0 : 1,
      repeat: prefersReducedMotion() ? 0 : Infinity,
      ease: "linear"
    }
  }
};

// Page transition variants
export const pageTransition = {
  initial: { 
    opacity: 0, 
    x: prefersReducedMotion() ? 0 : 20 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: getAnimationDuration('normal'),
      ease: EASING.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: prefersReducedMotion() ? 0 : -20,
    transition: {
      duration: getAnimationDuration('fast'),
      ease: EASING.easeIn
    }
  }
};

// Utility function to create custom variants with reduced motion support
export const createVariant = (initial, animate, exit = null) => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: exit ? { opacity: 0 } : undefined
    };
  }
  
  return {
    initial,
    animate: {
      ...animate,
      transition: {
        duration: getAnimationDuration('normal'),
        ease: EASING.easeOut,
        ...animate.transition
      }
    },
    exit: exit ? {
      ...exit,
      transition: {
        duration: getAnimationDuration('fast'),
        ease: EASING.easeIn,
        ...exit.transition
      }
    } : undefined
  };
};