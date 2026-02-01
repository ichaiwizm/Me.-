/**
 * Plausible Analytics Implementation
 * Privacy-friendly analytics alongside GA4
 */

import { PLAUSIBLE_CONFIG } from './config';
import { mapGA4ToPlausible } from './mapper';
import type { GA4EventName } from '../ga4/types';
import type { PlausibleEventName, PlausibleProps } from './types';
import { GA4_TO_PLAUSIBLE_EVENT_MAP } from './types';

// ============================================================================
// CORE TRACKING FUNCTION
// ============================================================================

/**
 * Track an event directly to Plausible
 */
export function trackPlausible(
  eventName: PlausibleEventName,
  props?: PlausibleProps
): void {
  try {
    // In development: log to console with styling
    if (PLAUSIBLE_CONFIG.DEBUG_MODE) {
      console.log(
        `%c[Plausible] ${eventName}`,
        'color: #5850EC; font-weight: bold; background: #EEF2FF; padding: 2px 6px; border-radius: 3px;',
        props || {}
      );
      return;
    }

    // In production: send to Plausible
    if (typeof window.plausible === 'function') {
      if (props && Object.keys(props).length > 0) {
        window.plausible(eventName, { props });
      } else {
        window.plausible(eventName);
      }
    }
  } catch (error) {
    // Never crash the app for analytics issues
    if (PLAUSIBLE_CONFIG.DEBUG_MODE) {
      console.error('[Plausible] Failed to track event:', error);
    }
  }
}

// ============================================================================
// GA4 BRIDGE FUNCTION
// ============================================================================

/**
 * Convert and send a GA4 event to Plausible
 * This is the main integration point with the existing GA4 tracking
 */
export function trackGA4AsPlausible(
  ga4EventName: GA4EventName,
  ga4Params: Record<string, unknown>
): void {
  try {
    // Map GA4 event name to Plausible event name
    const plausibleEventName = GA4_TO_PLAUSIBLE_EVENT_MAP[ga4EventName];

    if (!plausibleEventName) {
      if (PLAUSIBLE_CONFIG.DEBUG_MODE) {
        console.warn(`[Plausible] No mapping for GA4 event: ${ga4EventName}`);
      }
      return;
    }

    // Convert GA4 params to Plausible props
    const plausibleProps = mapGA4ToPlausible(plausibleEventName, ga4Params);

    // Send to Plausible
    trackPlausible(plausibleEventName, plausibleProps);
  } catch (error) {
    if (PLAUSIBLE_CONFIG.DEBUG_MODE) {
      console.error('[Plausible] Failed to track GA4 event as Plausible:', error);
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize Plausible Analytics
 */
export function initPlausible(): void {
  if (PLAUSIBLE_CONFIG.DEBUG_MODE) {
    console.log(
      '%c[Plausible] Debug mode enabled - events logged to console',
      'color: #5850EC; font-weight: bold;'
    );
    return;
  }

  if (typeof window.plausible !== 'function') {
    console.warn('[Plausible] plausible not found. Ensure script is loaded in index.html');
  }
}

// Re-export types for convenience
export type { PlausibleEventName, PlausibleProps } from './types';
export { GA4_TO_PLAUSIBLE_EVENT_MAP } from './types';
