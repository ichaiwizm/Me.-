/**
 * Centralized animation constants for consistent motion design
 * Replaces 30+ scattered easing definitions across the codebase
 */

// ============================================================================
// EASING CURVES
// ============================================================================

/**
 * Easing curves for different animation contexts
 * - standard: General UI transitions (most common)
 * - snappy: Quick micro-interactions (buttons, toggles)
 * - gentle: Page-level transitions, modals
 * - bouncy: Playful elements, hover effects
 * - linear: Progress bars, continuous animations
 */
export const EASINGS = {
  standard: [0.25, 0.46, 0.45, 0.94] as const,
  snappy: [0.16, 1, 0.3, 1] as const,
  gentle: [0.4, 0, 0.2, 1] as const,
  bouncy: [0.68, -0.55, 0.265, 1.55] as const,
  linear: [0, 0, 1, 1] as const,
} as const;

export type EasingName = keyof typeof EASINGS;
export type EasingValue = (typeof EASINGS)[EasingName];

// ============================================================================
// DURATION PRESETS
// ============================================================================

/**
 * Duration presets in seconds
 */
export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  pageTransition: 0.6,
  emphasis: 0.8,
} as const;

export type DurationName = keyof typeof DURATIONS;

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

/**
 * Spring configurations for Framer Motion
 * - snappy: Quick feedback (buttons, toggles)
 * - gentle: Smooth movement (cards, panels)
 * - bouncy: Playful effects (hover states)
 * - smooth: Page elements, list items
 */
export const SPRINGS = {
  snappy: { stiffness: 400, damping: 25 },
  gentle: { stiffness: 300, damping: 30 },
  bouncy: { stiffness: 400, damping: 17 },
  smooth: { stiffness: 200, damping: 20 },
} as const;

export type SpringName = keyof typeof SPRINGS;
export type SpringConfig = (typeof SPRINGS)[SpringName];

// ============================================================================
// STAGGER DELAYS
// ============================================================================

/**
 * Stagger delays for list animations (in seconds)
 */
export const STAGGER = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.1,
} as const;

export type StaggerName = keyof typeof STAGGER;

// ============================================================================
// PRE-BUILT TRANSITIONS
// ============================================================================

/**
 * Ready-to-use transition presets for Framer Motion
 */
export const TRANSITIONS = {
  fadeIn: {
    duration: DURATIONS.normal,
    ease: EASINGS.standard,
  },
  fadeInSlow: {
    duration: DURATIONS.slow,
    ease: EASINGS.gentle,
  },
  slideUp: {
    duration: DURATIONS.slow,
    ease: EASINGS.standard,
  },
  scale: {
    type: "spring" as const,
    ...SPRINGS.snappy,
  },
  hover: {
    type: "spring" as const,
    ...SPRINGS.bouncy,
  },
  page: {
    duration: DURATIONS.pageTransition,
    ease: EASINGS.gentle,
  },
} as const;

export type TransitionName = keyof typeof TRANSITIONS;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Common animation variants for Framer Motion
 */
export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
} as const;

export type VariantName = keyof typeof VARIANTS;

// ============================================================================
// HOVER STATES
// ============================================================================

/**
 * Common hover/tap states for interactive elements
 */
export const HOVER_STATES = {
  lift: {
    whileHover: { y: -2 },
    whileTap: { y: 0 },
  },
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  },
  scaleLift: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98, y: 0 },
  },
  glow: {
    whileHover: { boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.3)" },
  },
} as const;

export type HoverStateName = keyof typeof HOVER_STATES;
