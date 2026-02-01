/**
 * GA4 Analytics Implementation
 * Ultra-detailed event tracking for portfolio
 * Replaces Vercel Analytics custom events
 */

import { GA4_CONFIG, getPerformanceRating } from './ga4/config';
import { ga4Session } from './ga4/session';
import { trackGA4AsPlausible, initPlausible } from './plausible';
import type { PageId } from './commands/types';
import type {
  DeviceType,
  GA4EventName,
  GA4EventParamsMap,
  PageViewParams,
  NavigationClickParams,
  ScrollDepthParams,
  ChatPanelOpenParams,
  ChatPanelCloseParams,
  ChatMessageSendParams,
  ChatSuggestionClickParams,
  PromptGenerateParams,
  ThemeChangeParams,
  LanguageChangeParams,
  VisualModeChangeParams,
  AppResetParams,
  ProjectViewParams,
  ProjectLinkClickParams,
  SkillCategoryViewParams,
  ContactFormParams,
  SocialLinkClickParams,
  LightboxOpenParams,
  LightboxNavigateParams,
  LightboxZoomParams,
  LightboxCloseParams,
  WindowCreateParams,
  WindowCloseParams,
  WindowMinimizeParams,
  WindowMaximizeParams,
  WindowDragParams,
  DockInteractParams,
  PerformanceTimingParams,
  ApiLatencyParams,
  ErrorJsParams,
  ErrorApiParams,
  SessionStartParams,
  FeatureAdoptionParams,
  InteractionMethod,
} from './ga4/types';

// ============================================================================
// GLOBAL TYPES
// ============================================================================

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set' | 'consent',
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// ============================================================================
// INTERNAL STATE
// ============================================================================

let visualModeStartTime = 0;
let lightboxOpenTime = 0;
let lightboxImagesViewed = 0;
let lightboxUniqueImages = new Set<string>();
let currentLightboxImageId = '';
let currentImageStartTime = 0;

// Window tracking
const windowOpenTimes = new Map<string, number>();
const windowInteracted = new Map<string, boolean>();

// Project/Skill view tracking
const projectViewStartTimes = new Map<string, number>();
const skillCategoryStartTimes = new Map<string, number>();
const skillsHovered = new Map<string, string[]>();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDeviceType(): DeviceType {
  return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop';
}

function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

// ============================================================================
// CORE TRACKING FUNCTION
// ============================================================================

function trackGA4<E extends GA4EventName>(
  eventName: E,
  params: GA4EventParamsMap[E]
): void {
  try {
    // Update session activity
    ga4Session.updateActivity();

    // In development: log to console with styling
    if (GA4_CONFIG.DEBUG_MODE) {
      console.log(
        `%c[GA4] ${eventName}`,
        'color: #4285f4; font-weight: bold; background: #e8f0fe; padding: 2px 6px; border-radius: 3px;',
        params
      );
    } else {
      // In production: send to GA4
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params as unknown as Record<string, unknown>);
      }
    }

    // Also send to Plausible (handles its own debug mode)
    trackGA4AsPlausible(eventName, params as unknown as Record<string, unknown>);
  } catch (error) {
    // Never crash the app for analytics issues
    if (GA4_CONFIG.DEBUG_MODE) {
      console.error('[GA4] Failed to track event:', error);
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initGA4(): void {
  if (GA4_CONFIG.DEBUG_MODE) {
    console.log(
      '%c[GA4] Debug mode enabled - events logged to console',
      'color: #4285f4; font-weight: bold;'
    );
  } else {
    if (typeof window.gtag !== 'function') {
      console.warn('[GA4] gtag not found. Ensure script is loaded in index.html');
    }
  }

  // Also initialize Plausible
  initPlausible();
}

// ============================================================================
// NAVIGATION TRACKING
// ============================================================================

export function trackPageView(
  pageId: PageId,
  options: {
    language?: string;
    theme?: string;
  } = {}
): void {
  const params: PageViewParams = {
    page_title: document.title,
    page_path: window.location.pathname,
    page_id: pageId,
    page_referrer: document.referrer || undefined,
    device_type: getDeviceType(),
    language: options.language || 'fr',
    theme: options.theme || 'crepuscule-dore',
  };

  // Mark page as visited
  ga4Session.markPageVisited(pageId);

  trackGA4('page_view', params);
}

export function trackNavigationClick(
  pageId: PageId,
  source: 'header' | 'mobile_nav',
  previousPage?: PageId
): void {
  const params: NavigationClickParams = {
    page_id: pageId,
    navigation_source: source,
    device_type: getDeviceType(),
    previous_page: previousPage,
  };

  trackGA4('navigation_click', params);
}

export function trackScrollDepth(
  pageId: PageId,
  threshold: 25 | 50 | 75 | 100,
  timeToThresholdMs: number
): void {
  // Only track if first time reaching this threshold
  if (!ga4Session.markScrollDepthReached(threshold)) return;

  const params: ScrollDepthParams = {
    page_path: window.location.pathname,
    page_id: pageId,
    depth_threshold: threshold,
    time_to_threshold_ms: timeToThresholdMs,
  };

  trackGA4('scroll_depth', params);
}

// ============================================================================
// CHAT TRACKING
// ============================================================================

export function trackChatPanelOpen(
  trigger: 'button' | 'keyboard' | 'suggestion' | 'fab',
  currentPage: PageId
): void {
  ga4Session.markChatOpened();
  ga4Session.markFeatureUsed('chat');

  const params: ChatPanelOpenParams = {
    trigger_type: trigger,
    device_type: getDeviceType(),
    session_message_count: ga4Session.getMessageCount(),
    time_since_session_start_ms: ga4Session.getTimeSinceSessionStart(),
    current_page: currentPage,
  };

  trackGA4('chat_panel_open', params);
}

export function trackChatPanelClose(): void {
  const { timeOpenMs, messagesWhileOpen } = ga4Session.markChatClosed();

  const params: ChatPanelCloseParams = {
    device_type: getDeviceType(),
    session_message_count: ga4Session.getMessageCount(),
    time_open_ms: timeOpenMs,
    messages_sent_while_open: messagesWhileOpen,
  };

  trackGA4('chat_panel_close', params);
}

export function trackChatMessageSend(
  messageLength: number,
  sourceVariant: 'panel' | 'standalone',
  currentPage: PageId,
  hasCommand: boolean = false,
  messageContent?: string
): void {
  const messagePosition = ga4Session.incrementMessageCount();
  const timeSinceLastMessage = ga4Session.getTimeSinceLastMessage();

  const params: ChatMessageSendParams = {
    message_length: messageLength,
    message_position: messagePosition,
    time_since_last_message_ms: timeSinceLastMessage,
    source_variant: sourceVariant,
    device_type: getDeviceType(),
    has_command: hasCommand,
    current_page: currentPage,
    message_content: messageContent ? truncate(messageContent, 500) : undefined,
  };

  trackGA4('chat_message_send', params);
}

export function trackChatSuggestionClick(
  variant: 'inline' | 'floating',
  category: string,
  position: number,
  suggestionText: string,
  isAIGenerated: boolean
): void {
  const params: ChatSuggestionClickParams = {
    suggestion_variant: variant,
    suggestion_category: category,
    suggestion_position: position,
    suggestion_text_preview: truncate(suggestionText, GA4_CONFIG.MAX_LENGTHS.SUGGESTION_PREVIEW),
    is_ai_generated: isAIGenerated,
    device_type: getDeviceType(),
  };

  trackGA4('chat_suggestion_click', params);
}

export function trackPromptGenerate(
  promptType: 'prompt_bar' | 'visual_mode' | 'inline',
  success: boolean,
  responseTimeMs: number,
  errorType?: string
): void {
  const params: PromptGenerateParams = {
    prompt_type: promptType,
    generation_success: success,
    response_time_ms: responseTimeMs,
    error_type: errorType,
    device_type: getDeviceType(),
  };

  trackGA4('prompt_generate', params);
}

// ============================================================================
// CUSTOMIZATION TRACKING
// ============================================================================

export function trackThemeChange(from: string, to: string): void {
  const changeCount = ga4Session.incrementThemeChangeCount();

  const params: ThemeChangeParams = {
    theme_from: from,
    theme_to: to,
    time_since_session_start_ms: ga4Session.getTimeSinceSessionStart(),
    change_count_session: changeCount,
    device_type: getDeviceType(),
  };

  trackGA4('theme_change', params);
}

export function trackLanguageChange(
  from: string,
  to: string,
  isRtlSwitch: boolean = false
): void {
  const params: LanguageChangeParams = {
    language_from: from,
    language_to: to,
    is_rtl_switch: isRtlSwitch,
    device_type: getDeviceType(),
  };

  trackGA4('language_change', params);
}

export function trackVisualModeChange(
  from: string,
  to: string,
  isAIGenerated: boolean = false
): void {
  const timeInPreviousMode = visualModeStartTime > 0
    ? Date.now() - visualModeStartTime
    : 0;

  visualModeStartTime = Date.now();

  if (to !== 'none' && to !== '') {
    ga4Session.markVisualModeUsed();
    ga4Session.markFeatureUsed('visual_mode');
  }

  const changeCount = ga4Session.incrementVisualModeChangeCount();

  const params: VisualModeChangeParams = {
    mode_from: from || 'none',
    mode_to: to || 'none',
    time_in_previous_mode_ms: timeInPreviousMode,
    is_ai_generated: isAIGenerated,
    change_count_session: changeCount,
  };

  trackGA4('visual_mode_change', params);
}

export function trackAppReset(
  previousTheme: string,
  previousLanguage: string,
  previousVisualMode: string | null,
  windowsClosedCount: number
): void {
  const params: AppResetParams = {
    previous_theme: previousTheme,
    previous_language: previousLanguage,
    previous_visual_mode: previousVisualMode,
    windows_closed_count: windowsClosedCount,
    device_type: getDeviceType(),
  };

  trackGA4('app_reset', params);
}

// ============================================================================
// CONTENT ENGAGEMENT TRACKING
// ============================================================================

export function trackProjectViewStart(projectId: string): void {
  projectViewStartTimes.set(projectId, Date.now());
}

export function trackProjectViewEnd(
  projectId: string,
  projectTitle: string,
  projectCategory: string,
  technologies: string[],
  wasExpanded: boolean = false
): void {
  const startTime = projectViewStartTimes.get(projectId);
  if (!startTime) return;

  const viewDuration = Date.now() - startTime;
  projectViewStartTimes.delete(projectId);

  // Only track if viewed for minimum time
  if (viewDuration < GA4_CONFIG.MIN_ENGAGEMENT.PROJECT_VIEW) return;

  const params: ProjectViewParams = {
    project_id: projectId,
    project_title: projectTitle,
    project_category: projectCategory,
    project_technologies: technologies.slice(0, 5),
    view_duration_ms: viewDuration,
    was_expanded: wasExpanded,
    device_type: getDeviceType(),
  };

  trackGA4('project_view', params);
}

export function trackProjectLinkClick(
  projectId: string,
  projectTitle: string,
  linkType: 'live' | 'github',
  projectCategory: string
): void {
  const startTime = projectViewStartTimes.get(projectId);
  const timeViewingBeforeClick = startTime ? Date.now() - startTime : 0;

  const params: ProjectLinkClickParams = {
    project_id: projectId,
    project_title: projectTitle,
    link_type: linkType,
    project_category: projectCategory,
    time_viewing_before_click_ms: timeViewingBeforeClick,
  };

  trackGA4('project_link_click', params);
}

export function trackSkillCategoryViewStart(categoryId: string): void {
  skillCategoryStartTimes.set(categoryId, Date.now());
  skillsHovered.set(categoryId, []);
}

export function trackSkillHovered(categoryId: string, skillName: string): void {
  const hovered = skillsHovered.get(categoryId) || [];
  if (!hovered.includes(skillName)) {
    hovered.push(skillName);
    skillsHovered.set(categoryId, hovered);
  }
}

export function trackSkillCategoryViewEnd(
  categoryId: string,
  categoryName: string,
  skillsCount: number
): void {
  const startTime = skillCategoryStartTimes.get(categoryId);
  if (!startTime) return;

  const viewDuration = Date.now() - startTime;
  skillCategoryStartTimes.delete(categoryId);

  // Only track if viewed for minimum time
  if (viewDuration < GA4_CONFIG.MIN_ENGAGEMENT.SKILL_CATEGORY) return;

  const params: SkillCategoryViewParams = {
    category_id: categoryId,
    category_name: categoryName,
    skills_count: skillsCount,
    view_duration_ms: viewDuration,
    skills_hovered: (skillsHovered.get(categoryId) || []).slice(0, 10),
  };

  skillsHovered.delete(categoryId);

  trackGA4('skill_category_view', params);
}

export function trackContactFormInteraction(
  step: ContactFormParams['form_step'],
  options: {
    fieldName?: string;
    fieldValueLength?: number;
    errorType?: string;
    timeOnFormMs?: number;
    fieldsFilledCount?: number;
  } = {}
): void {
  if (step === 'start') {
    ga4Session.markFeatureUsed('contact_form');
  }

  const params: ContactFormParams = {
    form_step: step,
    field_name: options.fieldName,
    field_value_length: options.fieldValueLength,
    error_type: options.errorType,
    time_on_form_ms: options.timeOnFormMs,
    fields_filled_count: options.fieldsFilledCount,
  };

  trackGA4('contact_form_interact', params);
}

export function trackSocialLinkClick(
  platform: string,
  linkUrl: string,
  clickLocation: SocialLinkClickParams['click_location']
): void {
  const params: SocialLinkClickParams = {
    platform,
    link_url: linkUrl,
    click_location: clickLocation,
    device_type: getDeviceType(),
  };

  trackGA4('social_link_click', params);
}

// ============================================================================
// MEDIA/GALLERY TRACKING
// ============================================================================

export function trackLightboxOpen(
  imageId: string,
  imageIndex: number,
  totalImages: number,
  sourceGallery: string
): void {
  lightboxOpenTime = Date.now();
  lightboxImagesViewed = 1;
  lightboxUniqueImages = new Set([imageId]);
  currentLightboxImageId = imageId;
  currentImageStartTime = Date.now();

  ga4Session.markFeatureUsed('lightbox');

  const params: LightboxOpenParams = {
    image_id: imageId,
    image_index: imageIndex,
    total_images: totalImages,
    source_gallery: sourceGallery,
    device_type: getDeviceType(),
  };

  trackGA4('lightbox_open', params);
}

export function trackLightboxNavigate(
  imageId: string,
  imageIndex: number,
  totalImages: number,
  direction: 'next' | 'previous' | 'jump',
  method: InteractionMethod
): void {
  const timeOnPreviousImage = Date.now() - currentImageStartTime;

  lightboxImagesViewed++;
  lightboxUniqueImages.add(imageId);
  currentLightboxImageId = imageId;
  currentImageStartTime = Date.now();

  const params: LightboxNavigateParams = {
    image_id: imageId,
    image_index: imageIndex,
    total_images: totalImages,
    navigation_direction: direction,
    navigation_method: method,
    time_on_previous_image_ms: timeOnPreviousImage,
  };

  trackGA4('lightbox_navigate', params);
}

export function trackLightboxZoom(
  imageId: string,
  zoomAction: 'in' | 'out',
  zoomMethod: 'button' | 'pinch' | 'double_tap'
): void {
  const params: LightboxZoomParams = {
    image_id: imageId,
    zoom_action: zoomAction,
    zoom_method: zoomMethod,
  };

  trackGA4('lightbox_zoom', params);
}

export function trackLightboxClose(
  closeMethod: 'button' | 'backdrop' | 'escape' | 'swipe'
): void {
  const totalTimeOpen = Date.now() - lightboxOpenTime;

  const params: LightboxCloseParams = {
    total_time_open_ms: totalTimeOpen,
    images_viewed_count: lightboxImagesViewed,
    images_viewed_unique: lightboxUniqueImages.size,
    last_image_id: currentLightboxImageId,
    close_method: closeMethod,
  };

  // Reset state
  lightboxOpenTime = 0;
  lightboxImagesViewed = 0;
  lightboxUniqueImages.clear();
  currentLightboxImageId = '';
  currentImageStartTime = 0;

  trackGA4('lightbox_close', params);
}

// ============================================================================
// WINDOW MANAGER TRACKING
// ============================================================================

export function trackWindowCreate(
  windowKey: string,
  windowTitle: string,
  windowType: string,
  triggerSource: WindowCreateParams['trigger_source'],
  activeWindowsCount: number
): void {
  windowOpenTimes.set(windowKey, Date.now());
  windowInteracted.set(windowKey, false);

  ga4Session.markFeatureUsed('windows');

  const params: WindowCreateParams = {
    window_key: windowKey,
    window_title: windowTitle,
    window_type: windowType,
    trigger_source: triggerSource,
    device_type: getDeviceType(),
    active_windows_count: activeWindowsCount,
  };

  trackGA4('window_create', params);
}

export function trackWindowClose(
  windowKey: string,
  windowTitle: string,
  closeMethod: WindowCloseParams['close_method']
): void {
  const openTime = windowOpenTimes.get(windowKey);
  const wasInteracted = windowInteracted.get(windowKey) || false;
  const timeOpen = openTime ? Date.now() - openTime : 0;

  windowOpenTimes.delete(windowKey);
  windowInteracted.delete(windowKey);

  const params: WindowCloseParams = {
    window_key: windowKey,
    window_title: windowTitle,
    time_open_ms: timeOpen,
    was_interacted: wasInteracted,
    close_method: closeMethod,
  };

  trackGA4('window_close', params);
}

export function trackWindowMinimize(
  windowKey: string,
  windowTitle: string,
  minimizedWindowsCount: number
): void {
  const openTime = windowOpenTimes.get(windowKey);
  const timeBeforeMinimize = openTime ? Date.now() - openTime : 0;

  const params: WindowMinimizeParams = {
    window_key: windowKey,
    window_title: windowTitle,
    time_before_minimize_ms: timeBeforeMinimize,
    minimized_windows_count: minimizedWindowsCount,
  };

  trackGA4('window_minimize', params);
}

export function trackWindowMaximize(
  windowKey: string,
  windowTitle: string,
  action: 'maximize' | 'restore'
): void {
  windowInteracted.set(windowKey, true);

  const params: WindowMaximizeParams = {
    window_key: windowKey,
    window_title: windowTitle,
    maximize_action: action,
  };

  trackGA4('window_maximize', params);
}

export function trackWindowDrag(
  windowKey: string,
  dragDistancePx: number,
  dragDurationMs: number
): void {
  windowInteracted.set(windowKey, true);

  const params: WindowDragParams = {
    window_key: windowKey,
    drag_distance_px: dragDistancePx,
    drag_duration_ms: dragDurationMs,
  };

  trackGA4('window_drag', params);
}

export function trackDockInteract(
  action: 'restore' | 'hover',
  windowKey: string,
  timeMinimizedMs: number
): void {
  const params: DockInteractParams = {
    action,
    window_key: windowKey,
    time_minimized_ms: timeMinimizedMs,
  };

  trackGA4('dock_interact', params);
}

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

export function trackPerformanceTiming(
  metricName: PerformanceTimingParams['metric_name'],
  metricValue: number,
  connectionType?: string
): void {
  const params: PerformanceTimingParams = {
    metric_name: metricName,
    metric_value: Math.round(metricName === 'CLS' ? metricValue * 1000 : metricValue),
    metric_rating: getPerformanceRating(metricName, metricValue),
    page_path: window.location.pathname,
    connection_type: connectionType,
  };

  trackGA4('performance_timing', params);
}

export function trackApiLatency(
  endpoint: string,
  method: 'GET' | 'POST',
  responseTimeMs: number,
  statusCode: number,
  success: boolean
): void {
  const params: ApiLatencyParams = {
    endpoint,
    method,
    response_time_ms: responseTimeMs,
    status_code: statusCode,
    success,
  };

  trackGA4('api_latency', params);
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

export function trackErrorJs(
  errorMessage: string,
  errorType: string,
  errorStack?: string,
  componentName?: string,
  userAction?: string
): void {
  const params: ErrorJsParams = {
    error_message: truncate(errorMessage, GA4_CONFIG.MAX_LENGTHS.ERROR_MESSAGE),
    error_type: errorType,
    error_stack: errorStack ? truncate(errorStack, GA4_CONFIG.MAX_LENGTHS.ERROR_STACK) : undefined,
    page_path: window.location.pathname,
    component_name: componentName,
    user_action: userAction,
  };

  trackGA4('error_js', params);
}

export function trackErrorApi(
  endpoint: string,
  errorMessage: string,
  statusCode?: number,
  requestType: string = 'fetch'
): void {
  const params: ErrorApiParams = {
    endpoint,
    error_message: truncate(errorMessage, GA4_CONFIG.MAX_LENGTHS.ERROR_MESSAGE),
    status_code: statusCode,
    request_type: requestType,
    page_path: window.location.pathname,
  };

  trackGA4('error_api', params);
}

// ============================================================================
// SESSION/ENGAGEMENT TRACKING
// ============================================================================

export function trackSessionStart(
  referrerType: SessionStartParams['referrer_type'],
  referrerSource?: string
): void {
  const params: SessionStartParams = {
    is_returning_user: ga4Session.isReturningUser(),
    referrer_type: referrerType,
    referrer_source: referrerSource,
    landing_page: ga4Session.getEntryPage(),
    device_type: getDeviceType(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    language_detected: navigator.language,
  };

  trackGA4('session_start', params);
}

export function trackFeatureAdoption(featureName: string): void {
  const isFirstUse = ga4Session.markFeatureUsed(featureName);

  const params: FeatureAdoptionParams = {
    feature_name: featureName,
    is_first_use: isFirstUse,
    session_number: ga4Session.getSessionNumber(),
  };

  trackGA4('feature_adoption', params);
}
