/**
 * Animation Utilities
 * Centralized animation helpers and utilities for consistent micro-interactions
 */

import { cn } from '../lib/utils';

/**
 * Animation duration presets
 */
export const animationDurations = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};

/**
 * Animation easing functions
 */
export const easingFunctions = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

/**
 * Common animation classes
 */
export const animationClasses = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  
  // Slide animations
  slideInFromTop: 'animate-in slide-in-from-top-4 duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left-4 duration-300',
  slideInFromRight: 'animate-in slide-in-from-right-4 duration-300',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
  
  // Combined animations
  fadeSlideIn: 'animate-in fade-in slide-in-from-bottom-4 duration-300',
  fadeScaleIn: 'animate-in fade-in zoom-in-95 duration-200',
};

/**
 * Micro-interaction classes for common elements
 */
export const microInteractionClasses = {
  // Button interactions
  buttonPress: 'active:scale-[0.98] transition-transform duration-150',
  buttonHover: 'hover:scale-105 transition-transform duration-200',
  
  // Card interactions
  cardHover: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
  cardPress: 'active:scale-[0.98] transition-transform duration-150',
  
  // Link interactions
  linkHover: 'hover:underline transition-all duration-200',
  
  // Icon interactions
  iconHover: 'hover:scale-110 transition-transform duration-200',
  iconPress: 'active:scale-95 transition-transform duration-100',
  
  // Input interactions
  inputFocus: 'focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200',
};

/**
 * Success animation classes
 */
export const successAnimations = {
  checkmark: 'animate-in zoom-in-95 duration-300',
  fadeIn: 'animate-in fade-in duration-200',
  slideUp: 'animate-in slide-in-from-bottom-2 duration-300',
};

/**
 * Error animation classes
 */
export const errorAnimations = {
  shake: 'animate-in shake duration-500',
  fadeIn: 'animate-in fade-in duration-200',
  slideDown: 'animate-in slide-in-from-top-2 duration-300',
};

/**
 * Loading animation classes
 */
export const loadingAnimations = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
};

/**
 * Stagger animation delay helper
 * Creates staggered delays for list items
 */
export const getStaggerDelay = (index, baseDelay = 50) => {
  return {
    transitionDelay: `${index * baseDelay}ms`,
  };
};

/**
 * Combine animation classes
 */
export const combineAnimations = (...classes) => {
  return cn(...classes);
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation classes respecting user preferences
 */
export const getAnimationClasses = (classes, fallback = '') => {
  if (prefersReducedMotion()) {
    return fallback || 'transition-opacity duration-150';
  }
  return classes;
};

/**
 * Page transition variants
 */
export const pageTransitionVariants = {
  fade: {
    enter: 'opacity-0',
    enterActive: 'opacity-100 transition-opacity duration-300',
    exit: 'opacity-100',
    exitActive: 'opacity-0 transition-opacity duration-200',
  },
  slide: {
    enter: 'opacity-0 translate-y-4',
    enterActive: 'opacity-100 translate-y-0 transition-all duration-300 ease-out',
    exit: 'opacity-100 translate-y-0',
    exitActive: 'opacity-0 translate-y-4 transition-all duration-200 ease-in',
  },
  scale: {
    enter: 'opacity-0 scale-95',
    enterActive: 'opacity-100 scale-100 transition-all duration-300 ease-out',
    exit: 'opacity-100 scale-100',
    exitActive: 'opacity-0 scale-95 transition-all duration-200 ease-in',
  },
};

export default {
  animationDurations,
  easingFunctions,
  animationClasses,
  microInteractionClasses,
  successAnimations,
  errorAnimations,
  loadingAnimations,
  getStaggerDelay,
  combineAnimations,
  prefersReducedMotion,
  getAnimationClasses,
  pageTransitionVariants,
};

