/**
 * GA4 Analytics Type Definitions
 * Ultra-detailed event tracking for portfolio
 */

import type { PageId } from '../commands/types';

// ============================================================================
// BASE TYPES
// ============================================================================

export type DeviceType = 'mobile' | 'desktop';
export type NavigationSource = 'header' | 'mobile_nav' | 'chat' | 'keyboard';
export type InteractionMethod = 'click' | 'keyboard' | 'swipe' | 'drag';

// ============================================================================
// NAVIGATION EVENTS
// ============================================================================

export interface PageViewParams {
  page_title: string;
  page_path: string;
  page_id: PageId;
  page_referrer?: string;
  content_group?: string;
  device_type: DeviceType;
  language: string;
  theme: string;
}

export interface NavigationClickParams {
  page_id: PageId;
  navigation_source: NavigationSource;
  device_type: DeviceType;
  previous_page?: PageId;
}

export interface ScrollDepthParams {
  page_path: string;
  page_id: PageId;
  depth_threshold: 25 | 50 | 75 | 100;
  time_to_threshold_ms: number;
}

// ============================================================================
// CHAT/AI EVENTS
// ============================================================================

export interface ChatPanelOpenParams {
  trigger_type: 'button' | 'keyboard' | 'suggestion' | 'fab';
  device_type: DeviceType;
  session_message_count: number;
  time_since_session_start_ms: number;
  current_page: PageId;
}

export interface ChatPanelCloseParams {
  device_type: DeviceType;
  session_message_count: number;
  time_open_ms: number;
  messages_sent_while_open: number;
}

export interface ChatMessageSendParams {
  message_length: number;
  message_position: number; // nth message in session
  time_since_last_message_ms: number;
  source_variant: 'panel' | 'standalone';
  device_type: DeviceType;
  has_command: boolean; // starts with /
  current_page: PageId;
}

export interface ChatSuggestionClickParams {
  suggestion_variant: 'inline' | 'floating';
  suggestion_category: string;
  suggestion_position: number;
  suggestion_text_preview: string; // first 50 chars
  is_ai_generated: boolean;
  device_type: DeviceType;
}

export interface PromptGenerateParams {
  prompt_type: 'prompt_bar' | 'visual_mode' | 'inline';
  generation_success: boolean;
  response_time_ms: number;
  error_type?: string;
  device_type: DeviceType;
}

// ============================================================================
// CUSTOMIZATION EVENTS
// ============================================================================

export interface ThemeChangeParams {
  theme_from: string;
  theme_to: string;
  time_since_session_start_ms: number;
  change_count_session: number; // how many times changed this session
  device_type: DeviceType;
}

export interface LanguageChangeParams {
  language_from: string;
  language_to: string;
  is_rtl_switch: boolean; // switching to/from RTL language
  device_type: DeviceType;
}

export interface VisualModeChangeParams {
  mode_from: string;
  mode_to: string;
  time_in_previous_mode_ms: number;
  is_ai_generated: boolean;
  change_count_session: number;
}

export interface AppResetParams {
  previous_theme: string;
  previous_language: string;
  previous_visual_mode: string | null;
  windows_closed_count: number;
  device_type: DeviceType;
}

// ============================================================================
// CONTENT ENGAGEMENT EVENTS
// ============================================================================

export interface ProjectViewParams {
  project_id: string;
  project_title: string;
  project_category: string;
  project_technologies: string[]; // first 5
  view_duration_ms: number;
  was_expanded: boolean; // mobile: tapped to expand
  device_type: DeviceType;
}

export interface ProjectLinkClickParams {
  project_id: string;
  project_title: string;
  link_type: 'live' | 'github';
  project_category: string;
  time_viewing_before_click_ms: number;
}

export interface SkillCategoryViewParams {
  category_id: string;
  category_name: string;
  skills_count: number;
  view_duration_ms: number;
  skills_hovered: string[]; // skills user hovered over
}

export interface ContactFormParams {
  form_step: 'start' | 'field_focus' | 'field_blur' | 'submit' | 'success' | 'error';
  field_name?: string;
  field_value_length?: number;
  error_type?: string;
  time_on_form_ms?: number;
  fields_filled_count?: number;
}

export interface SocialLinkClickParams {
  platform: string; // github, linkedin, email, etc.
  link_url: string;
  click_location: 'header' | 'footer' | 'contact_page' | 'about_page';
  device_type: DeviceType;
}

// ============================================================================
// MEDIA/GALLERY EVENTS
// ============================================================================

export interface LightboxOpenParams {
  image_id: string;
  image_index: number;
  total_images: number;
  source_gallery: string;
  device_type: DeviceType;
}

export interface LightboxNavigateParams {
  image_id: string;
  image_index: number;
  total_images: number;
  navigation_direction: 'next' | 'previous' | 'jump';
  navigation_method: InteractionMethod;
  time_on_previous_image_ms: number;
}

export interface LightboxZoomParams {
  image_id: string;
  zoom_action: 'in' | 'out';
  zoom_method: 'button' | 'pinch' | 'double_tap';
}

export interface LightboxCloseParams {
  total_time_open_ms: number;
  images_viewed_count: number;
  images_viewed_unique: number;
  last_image_id: string;
  close_method: 'button' | 'backdrop' | 'escape' | 'swipe';
}

// ============================================================================
// WINDOW MANAGER EVENTS
// ============================================================================

export interface WindowCreateParams {
  window_key: string;
  window_title: string;
  window_type: string; // cv, gallery, custom, etc.
  trigger_source: 'chat_command' | 'suggestion' | 'link';
  device_type: DeviceType;
  active_windows_count: number;
}

export interface WindowCloseParams {
  window_key: string;
  window_title: string;
  time_open_ms: number;
  was_interacted: boolean;
  close_method: 'button' | 'command' | 'reset';
}

export interface WindowMinimizeParams {
  window_key: string;
  window_title: string;
  time_before_minimize_ms: number;
  minimized_windows_count: number;
}

export interface WindowMaximizeParams {
  window_key: string;
  window_title: string;
  maximize_action: 'maximize' | 'restore';
}

export interface WindowDragParams {
  window_key: string;
  drag_distance_px: number;
  drag_duration_ms: number;
}

export interface DockInteractParams {
  action: 'restore' | 'hover';
  window_key: string;
  time_minimized_ms: number;
}

// ============================================================================
// PERFORMANCE EVENTS
// ============================================================================

export interface PerformanceTimingParams {
  metric_name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP';
  metric_value: number;
  metric_rating: 'good' | 'needs_improvement' | 'poor';
  page_path: string;
  connection_type?: string;
}

export interface ApiLatencyParams {
  endpoint: string;
  method: 'GET' | 'POST';
  response_time_ms: number;
  status_code: number;
  success: boolean;
}

// ============================================================================
// ERROR EVENTS
// ============================================================================

export interface ErrorJsParams {
  error_message: string;
  error_type: string;
  error_stack?: string;
  page_path: string;
  component_name?: string;
  user_action?: string;
}

export interface ErrorApiParams {
  endpoint: string;
  error_message: string;
  status_code?: number;
  request_type: string;
  page_path: string;
}

// ============================================================================
// SESSION/ENGAGEMENT EVENTS
// ============================================================================

export interface SessionStartParams {
  is_returning_user: boolean;
  referrer_type: 'direct' | 'organic' | 'social' | 'referral' | 'email';
  referrer_source?: string;
  landing_page: PageId;
  device_type: DeviceType;
  screen_resolution: string;
  language_detected: string;
}

export interface FeatureAdoptionParams {
  feature_name: string; // chat, visual_mode, theme_switch, etc.
  is_first_use: boolean;
  session_number: number;
}

// ============================================================================
// GA4 EVENT NAMES
// ============================================================================

export type GA4EventName =
  // Navigation
  | 'page_view'
  | 'navigation_click'
  | 'scroll_depth'
  // Chat/AI
  | 'chat_panel_open'
  | 'chat_panel_close'
  | 'chat_message_send'
  | 'chat_suggestion_click'
  | 'prompt_generate'
  // Customization
  | 'theme_change'
  | 'language_change'
  | 'visual_mode_change'
  | 'app_reset'
  // Content
  | 'project_view'
  | 'project_link_click'
  | 'skill_category_view'
  | 'contact_form_interact'
  | 'social_link_click'
  // Media
  | 'lightbox_open'
  | 'lightbox_navigate'
  | 'lightbox_zoom'
  | 'lightbox_close'
  // Window
  | 'window_create'
  | 'window_close'
  | 'window_minimize'
  | 'window_maximize'
  | 'window_drag'
  | 'dock_interact'
  // Performance
  | 'performance_timing'
  | 'api_latency'
  // Errors
  | 'error_js'
  | 'error_api'
  // Session
  | 'session_start'
  | 'feature_adoption';

// ============================================================================
// EVENT PARAMS MAPPING
// ============================================================================

export interface GA4EventParamsMap {
  page_view: PageViewParams;
  navigation_click: NavigationClickParams;
  scroll_depth: ScrollDepthParams;
  chat_panel_open: ChatPanelOpenParams;
  chat_panel_close: ChatPanelCloseParams;
  chat_message_send: ChatMessageSendParams;
  chat_suggestion_click: ChatSuggestionClickParams;
  prompt_generate: PromptGenerateParams;
  theme_change: ThemeChangeParams;
  language_change: LanguageChangeParams;
  visual_mode_change: VisualModeChangeParams;
  app_reset: AppResetParams;
  project_view: ProjectViewParams;
  project_link_click: ProjectLinkClickParams;
  skill_category_view: SkillCategoryViewParams;
  contact_form_interact: ContactFormParams;
  social_link_click: SocialLinkClickParams;
  lightbox_open: LightboxOpenParams;
  lightbox_navigate: LightboxNavigateParams;
  lightbox_zoom: LightboxZoomParams;
  lightbox_close: LightboxCloseParams;
  window_create: WindowCreateParams;
  window_close: WindowCloseParams;
  window_minimize: WindowMinimizeParams;
  window_maximize: WindowMaximizeParams;
  window_drag: WindowDragParams;
  dock_interact: DockInteractParams;
  performance_timing: PerformanceTimingParams;
  api_latency: ApiLatencyParams;
  error_js: ErrorJsParams;
  error_api: ErrorApiParams;
  session_start: SessionStartParams;
  feature_adoption: FeatureAdoptionParams;
}
