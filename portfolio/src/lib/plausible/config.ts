/**
 * Plausible Analytics Configuration
 * Centralized settings for Plausible tracking
 */

export const PLAUSIBLE_CONFIG = {
  // Debug mode - logs to console instead of sending to Plausible
  DEBUG_MODE: import.meta.env.DEV,

  // Plausible limits
  LIMITS: {
    // Maximum number of custom props per event
    MAX_PROPS: 30,
    // Maximum string length for prop values
    MAX_PROP_VALUE_LENGTH: 500,
    // Maximum string length for event names
    MAX_EVENT_NAME_LENGTH: 100,
  },

  // Props to always exclude (sensitive or redundant)
  EXCLUDED_PROPS: [
    'error_stack', // Too long and potentially sensitive
    'link_url', // Can contain tracking params
    'page_path', // Plausible tracks this automatically
    'page_title', // Plausible tracks this automatically
    'page_referrer', // Plausible tracks this automatically
  ] as const,
} as const;
