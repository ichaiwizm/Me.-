/**
 * Plausible Analytics Type Definitions
 * Maps GA4 events to Plausible-compatible events
 */

import type { GA4EventName } from '../ga4/types';

// ============================================================================
// GLOBAL TYPES
// ============================================================================

declare global {
  interface Window {
    plausible: PlausibleFunction & {
      q?: unknown[];
      o?: Record<string, unknown>;
      init?: (options?: Record<string, unknown>) => void;
    };
  }
}

export type PlausibleFunction = (
  eventName: string,
  options?: { props?: PlausibleProps; callback?: () => void }
) => void;

// Plausible props are flat key-value pairs (no nesting, no arrays)
export type PlausibleProps = Record<string, string | number | boolean>;

// ============================================================================
// PLAUSIBLE EVENT NAMES
// ============================================================================

export type PlausibleEventName =
  | 'pageview'
  | 'navigation'
  | 'scroll'
  | 'chat_open'
  | 'chat_close'
  | 'chat_message'
  | 'chat_suggestion'
  | 'prompt_generate'
  | 'theme_change'
  | 'language_change'
  | 'visual_mode'
  | 'app_reset'
  | 'project_view'
  | 'project_link'
  | 'skill_view'
  | 'contact_form'
  | 'social_link'
  | 'lightbox_open'
  | 'lightbox_navigate'
  | 'lightbox_zoom'
  | 'lightbox_close'
  | 'window_create'
  | 'window_close'
  | 'window_minimize'
  | 'window_maximize'
  | 'window_drag'
  | 'dock_interact'
  | 'performance'
  | 'api_latency'
  | 'error_js'
  | 'error_api'
  | 'session_start'
  | 'feature_adoption';

// ============================================================================
// GA4 TO PLAUSIBLE EVENT MAPPING
// ============================================================================

export const GA4_TO_PLAUSIBLE_EVENT_MAP: Record<GA4EventName, PlausibleEventName> = {
  // Navigation
  page_view: 'pageview',
  navigation_click: 'navigation',
  scroll_depth: 'scroll',
  // Chat/AI
  chat_panel_open: 'chat_open',
  chat_panel_close: 'chat_close',
  chat_message_send: 'chat_message',
  chat_suggestion_click: 'chat_suggestion',
  prompt_generate: 'prompt_generate',
  // Customization
  theme_change: 'theme_change',
  language_change: 'language_change',
  visual_mode_change: 'visual_mode',
  app_reset: 'app_reset',
  // Content
  project_view: 'project_view',
  project_link_click: 'project_link',
  skill_category_view: 'skill_view',
  contact_form_interact: 'contact_form',
  social_link_click: 'social_link',
  // Media
  lightbox_open: 'lightbox_open',
  lightbox_navigate: 'lightbox_navigate',
  lightbox_zoom: 'lightbox_zoom',
  lightbox_close: 'lightbox_close',
  // Window
  window_create: 'window_create',
  window_close: 'window_close',
  window_minimize: 'window_minimize',
  window_maximize: 'window_maximize',
  window_drag: 'window_drag',
  dock_interact: 'dock_interact',
  // Performance
  performance_timing: 'performance',
  api_latency: 'api_latency',
  // Errors
  error_js: 'error_js',
  error_api: 'error_api',
  // Session
  session_start: 'session_start',
  feature_adoption: 'feature_adoption',
} as const;

// ============================================================================
// PRIORITY PROPS PER EVENT TYPE
// ============================================================================

// Plausible has limits on number of props, so we prioritize the most important ones
export const PRIORITY_PROPS_BY_EVENT: Partial<Record<PlausibleEventName, string[]>> = {
  pageview: ['page_id', 'device_type', 'language', 'theme'],
  navigation: ['page_id', 'navigation_source', 'previous_page', 'device_type'],
  scroll: ['page_id', 'depth_threshold', 'time_to_threshold_ms'],
  chat_open: ['trigger_type', 'current_page', 'session_message_count', 'device_type'],
  chat_close: ['time_open_ms', 'messages_sent_while_open', 'device_type'],
  chat_message: ['message_length', 'source_variant', 'message_content', 'current_page', 'has_command'],
  chat_suggestion: ['suggestion_variant', 'suggestion_category', 'suggestion_position', 'is_ai_generated'],
  prompt_generate: ['prompt_type', 'generation_success', 'response_time_ms', 'error_type'],
  theme_change: ['theme_from', 'theme_to', 'change_count_session'],
  language_change: ['language_from', 'language_to', 'is_rtl_switch'],
  visual_mode: ['mode_from', 'mode_to', 'is_ai_generated', 'time_in_previous_mode_ms'],
  app_reset: ['previous_theme', 'previous_language', 'windows_closed_count'],
  project_view: ['project_id', 'project_title', 'project_category', 'view_duration_ms'],
  project_link: ['project_id', 'link_type', 'project_category'],
  skill_view: ['category_id', 'category_name', 'skills_count', 'view_duration_ms'],
  contact_form: ['form_step', 'field_name', 'error_type'],
  social_link: ['platform', 'click_location', 'device_type'],
  lightbox_open: ['image_id', 'source_gallery', 'total_images', 'device_type'],
  lightbox_navigate: ['image_id', 'navigation_direction', 'navigation_method'],
  lightbox_zoom: ['image_id', 'zoom_action', 'zoom_method'],
  lightbox_close: ['total_time_open_ms', 'images_viewed_count', 'close_method'],
  window_create: ['window_key', 'window_type', 'trigger_source', 'active_windows_count'],
  window_close: ['window_key', 'time_open_ms', 'close_method', 'was_interacted'],
  window_minimize: ['window_key', 'time_before_minimize_ms'],
  window_maximize: ['window_key', 'maximize_action'],
  window_drag: ['window_key', 'drag_distance_px', 'drag_duration_ms'],
  dock_interact: ['action', 'window_key', 'time_minimized_ms'],
  performance: ['metric_name', 'metric_value', 'metric_rating'],
  api_latency: ['endpoint', 'method', 'response_time_ms', 'success'],
  error_js: ['error_message', 'error_type', 'component_name'],
  error_api: ['endpoint', 'error_message', 'status_code'],
  session_start: ['is_returning_user', 'referrer_type', 'landing_page', 'device_type'],
  feature_adoption: ['feature_name', 'is_first_use', 'session_number'],
} as const;
