/**
 * Main utilities export file
 * Provides easy access to all animation, theme, and accessibility utilities
 */

// Animation utilities
export * from './animations';
export * from './performanceMonitor';
export * from './accessibility';

// Re-export commonly used functions with shorter names
export { 
  fadeInUp as fadeUp,
  fadeIn as fade,
  slideInLeft as slideLeft,
  slideInRight as slideRight,
  scaleIn as scale,
  hoverScale,
  tapScale,
  hoverElevation,
  staggerContainer,
  staggerItem,
  pageTransition
} from './animations';

export {
  startPerformanceMonitoring as startPerfMonitoring,
  stopPerformanceMonitoring as stopPerfMonitoring,
  trackAnimationStart as trackStart,
  trackAnimationEnd as trackEnd,
  getPerformanceData as getPerfData,
  canHandleComplexAnimations as canHandleComplex
} from './performanceMonitor';

export {
  getAccessibilityPreferences as getA11yPrefs,
  getAccessibleAnimationConfig as getA11yConfig,
  createAccessibleVariants as createA11yVariants,
  focusManager,
  ariaUtils,
  keyboardUtils,
  screenReaderUtils
} from './accessibility';