/**
 * GA4 Configuration
 * Centralized settings for Google Analytics 4 tracking
 */

export const GA4_CONFIG = {
  // GA4 Measurement ID
  MEASUREMENT_ID: 'G-2JL2R1D3SH',

  // Debug mode - logs to console instead of sending to GA4
  DEBUG_MODE: import.meta.env.DEV,

  // Session timeout in minutes (matches GA4 default)
  SESSION_TIMEOUT_MINUTES: 30,

  // Scroll depth thresholds to track (percentage)
  SCROLL_THRESHOLDS: [25, 50, 75, 100] as const,

  // Debounce times in milliseconds
  DEBOUNCE: {
    SCROLL: 100,
    RESIZE: 250,
    INPUT: 300,
  },

  // Minimum durations to count as engagement (milliseconds)
  MIN_ENGAGEMENT: {
    PROJECT_VIEW: 500,
    SKILL_CATEGORY: 300,
    LIGHTBOX_IMAGE: 500,
    WINDOW_INTERACTION: 1000,
  },

  // Performance metric thresholds (based on Google's Core Web Vitals)
  PERFORMANCE_THRESHOLDS: {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  },

  // Maximum string lengths for event parameters
  MAX_LENGTHS: {
    ERROR_MESSAGE: 100,
    ERROR_STACK: 500,
    SUGGESTION_PREVIEW: 50,
  },
} as const;

// Custom dimension names (must match GA4 Admin configuration)
export const CUSTOM_DIMENSIONS = {
  // User-scoped
  USER_LANGUAGE: 'user_language_preference',
  USER_THEME: 'user_theme_preference',
  USER_DEVICE: 'user_device_type',
  USER_RETURN_STATUS: 'user_return_status',

  // Session-scoped
  SESSION_ENTRY_PAGE: 'session_entry_page',
  SESSION_CHAT_USED: 'session_chat_used',
  SESSION_VISUAL_MODE_USED: 'session_visual_mode_used',
  SESSION_REFERRER_TYPE: 'session_referrer_type',
} as const;

// Custom metric names
export const CUSTOM_METRICS = {
  MESSAGE_LENGTH: 'message_length',
  SESSION_MESSAGE_COUNT: 'session_message_count',
  VIEW_DURATION_MS: 'view_duration_ms',
  SCROLL_TIME_MS: 'scroll_time_ms',
  IMAGES_VIEWED: 'images_viewed',
} as const;

/**
 * Get performance rating based on metric value
 */
export function getPerformanceRating(
  metric: keyof typeof GA4_CONFIG.PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs_improvement' | 'poor' {
  const thresholds = GA4_CONFIG.PERFORMANCE_THRESHOLDS[metric];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs_improvement';
  return 'poor';
}
