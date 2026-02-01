/**
 * Plausible Props Mapper
 * Converts GA4 event params to flat Plausible props
 */

import { PLAUSIBLE_CONFIG } from './config';
import type { PlausibleEventName, PlausibleProps } from './types';
import { PRIORITY_PROPS_BY_EVENT } from './types';

/**
 * Truncate a string to the maximum allowed length
 */
function truncate(value: string, maxLength: number = PLAUSIBLE_CONFIG.LIMITS.MAX_PROP_VALUE_LENGTH): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 3) + '...';
}

/**
 * Convert a value to a Plausible-compatible prop value
 * Arrays become comma-separated strings, objects are flattened
 */
function convertValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return truncate(value);
  }

  if (Array.isArray(value)) {
    // Convert arrays to comma-separated strings
    const stringified = value
      .map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item)))
      .join(', ');
    return truncate(stringified);
  }

  if (typeof value === 'object') {
    // Stringify objects
    return truncate(JSON.stringify(value));
  }

  return String(value);
}

/**
 * Flatten nested object keys with underscore separator
 * { a: { b: 1 } } => { a_b: 1 }
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects (but not too deep)
      if (prefix.split('_').length < 2) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      }
    } else {
      const converted = convertValue(value);
      if (converted !== null) {
        result[newKey] = converted;
      }
    }
  }

  return result;
}

/**
 * Filter props based on exclusion list
 */
function filterExcludedProps(
  props: Record<string, string | number | boolean>
): Record<string, string | number | boolean> {
  const excluded = new Set(PLAUSIBLE_CONFIG.EXCLUDED_PROPS);
  const result: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(props)) {
    if (!excluded.has(key as (typeof PLAUSIBLE_CONFIG.EXCLUDED_PROPS)[number])) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Select priority props for an event type, respecting Plausible limits
 */
function selectPriorityProps(
  eventName: PlausibleEventName,
  props: Record<string, string | number | boolean>
): PlausibleProps {
  const priorityList = PRIORITY_PROPS_BY_EVENT[eventName];
  const maxProps = PLAUSIBLE_CONFIG.LIMITS.MAX_PROPS;

  if (!priorityList) {
    // No priority list defined, take first N props
    const entries = Object.entries(props).slice(0, maxProps);
    return Object.fromEntries(entries);
  }

  const result: PlausibleProps = {};
  let count = 0;

  // First, add priority props in order
  for (const key of priorityList) {
    if (count >= maxProps) break;
    if (key in props) {
      result[key] = props[key];
      count++;
    }
  }

  // Then, add remaining props up to the limit
  for (const [key, value] of Object.entries(props)) {
    if (count >= maxProps) break;
    if (!(key in result)) {
      result[key] = value;
      count++;
    }
  }

  return result;
}

/**
 * Map GA4 event params to Plausible-compatible props
 * - Flattens nested objects
 * - Converts arrays to strings
 * - Excludes sensitive/redundant props
 * - Selects priority props within limits
 */
export function mapGA4ToPlausible(
  plausibleEventName: PlausibleEventName,
  ga4Params: Record<string, unknown>
): PlausibleProps {
  // Step 1: Flatten nested objects
  const flattened = flattenObject(ga4Params);

  // Step 2: Filter excluded props
  const filtered = filterExcludedProps(flattened);

  // Step 3: Select priority props within limits
  const selected = selectPriorityProps(plausibleEventName, filtered);

  return selected;
}
