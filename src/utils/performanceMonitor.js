/**
 * Performance monitoring utilities for animations
 * Tracks frame rates, memory usage, and provides automatic optimization
 */

class AnimationPerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.isMonitoring = false;
    this.performanceThreshold = 30; // FPS threshold for performance warnings
    this.memoryThreshold = 50 * 1024 * 1024; // 50MB memory threshold
    this.callbacks = [];
    this.performanceData = {
      averageFPS: 60,
      memoryUsage: 0,
      animationCount: 0,
      performanceIssues: []
    };
  }

  // Start monitoring performance
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.monitorFrame();
    
    // Monitor memory usage every 5 seconds
    this.memoryInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, 5000);
    
    console.log('Animation performance monitoring started');
  }

  // Stop monitoring performance
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    console.log('Animation performance monitoring stopped');
  }

  // Monitor frame rate
  monitorFrame() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.performanceData.averageFPS = this.fps;
      
      // Check for performance issues
      if (this.fps < this.performanceThreshold) {
        this.handlePerformanceIssue('low_fps', {
          fps: this.fps,
          timestamp: currentTime
        });
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Notify callbacks
      this.notifyCallbacks();
    }

    requestAnimationFrame(() => this.monitorFrame());
  }

  // Check memory usage
  checkMemoryUsage() {
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize;
      this.performanceData.memoryUsage = memoryUsage;
      
      if (memoryUsage > this.memoryThreshold) {
        this.handlePerformanceIssue('high_memory', {
          memoryUsage,
          timestamp: performance.now()
        });
      }
    }
  }

  // Handle performance issues
  handlePerformanceIssue(type, data) {
    const issue = {
      type,
      data,
      timestamp: Date.now()
    };
    
    this.performanceData.performanceIssues.push(issue);
    
    // Keep only last 10 issues
    if (this.performanceData.performanceIssues.length > 10) {
      this.performanceData.performanceIssues.shift();
    }
    
    console.warn(`Animation performance issue detected: ${type}`, data);
    
    // Auto-optimize if needed
    this.autoOptimize(type, data);
  }

  // Automatic optimization based on performance issues
  autoOptimize(type, data) {
    switch (type) {
      case 'low_fps':
        if (data.fps < 20) {
          // Severe performance issue - disable complex animations
          document.documentElement.style.setProperty('--animation-complexity', 'low');
          console.log('Reduced animation complexity due to low FPS');
        }
        break;
      case 'high_memory':
        // Suggest garbage collection or reduce animation instances
        console.log('High memory usage detected - consider reducing active animations');
        break;
    }
  }

  // Register callback for performance updates
  onPerformanceUpdate(callback) {
    this.callbacks.push(callback);
  }

  // Remove callback
  removeCallback(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  // Notify all callbacks
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.performanceData);
      } catch (error) {
        console.error('Error in performance callback:', error);
      }
    });
  }

  // Get current performance data
  getPerformanceData() {
    return { ...this.performanceData };
  }

  // Track animation start
  trackAnimationStart(animationId) {
    this.performanceData.animationCount++;
    console.debug(`Animation started: ${animationId}, Active count: ${this.performanceData.animationCount}`);
  }

  // Track animation end
  trackAnimationEnd(animationId) {
    this.performanceData.animationCount = Math.max(0, this.performanceData.animationCount - 1);
    console.debug(`Animation ended: ${animationId}, Active count: ${this.performanceData.animationCount}`);
  }

  // Check if device can handle complex animations
  canHandleComplexAnimations() {
    return this.fps >= this.performanceThreshold && 
           this.performanceData.memoryUsage < this.memoryThreshold;
  }

  // Get recommended animation settings based on performance
  getRecommendedSettings() {
    const canHandleComplex = this.canHandleComplexAnimations();
    
    return {
      enableComplexAnimations: canHandleComplex,
      maxConcurrentAnimations: canHandleComplex ? 10 : 5,
      animationDuration: canHandleComplex ? 'normal' : 'fast',
      enableParticleEffects: canHandleComplex,
      enableBlurEffects: canHandleComplex && this.fps >= 45
    };
  }
}

// Create singleton instance
const performanceMonitor = new AnimationPerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring();
}

// Utility functions for easy integration
export const startPerformanceMonitoring = () => performanceMonitor.startMonitoring();
export const stopPerformanceMonitoring = () => performanceMonitor.stopMonitoring();
export const trackAnimationStart = (id) => performanceMonitor.trackAnimationStart(id);
export const trackAnimationEnd = (id) => performanceMonitor.trackAnimationEnd(id);
export const getPerformanceData = () => performanceMonitor.getPerformanceData();
export const onPerformanceUpdate = (callback) => performanceMonitor.onPerformanceUpdate(callback);
export const canHandleComplexAnimations = () => performanceMonitor.canHandleComplexAnimations();
export const getRecommendedSettings = () => performanceMonitor.getRecommendedSettings();

export default performanceMonitor;