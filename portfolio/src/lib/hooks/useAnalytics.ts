/**
 * useAnalytics Hook
 * Provides type-safe GA4 analytics tracking methods
 * Maintains backward compatibility with existing component calls
 */

import { useCallback, useRef } from 'react';
import {
  // Navigation
  trackNavigationClick,
  trackPageView,
  trackScrollDepth,
  // Chat
  trackChatPanelOpen,
  trackChatPanelClose,
  trackChatMessageSend,
  trackChatSuggestionClick,
  trackPromptGenerate,
  // Customization
  trackThemeChange,
  trackLanguageChange,
  trackVisualModeChange,
  trackAppReset,
  // Content
  trackProjectViewStart,
  trackProjectViewEnd,
  trackProjectLinkClick,
  trackSkillCategoryViewStart,
  trackSkillCategoryViewEnd,
  trackSkillHovered,
  trackContactFormInteraction,
  trackSocialLinkClick,
  // Media
  trackLightboxOpen,
  trackLightboxNavigate,
  trackLightboxZoom,
  trackLightboxClose,
  // Windows
  trackWindowCreate,
  trackWindowClose,
  trackWindowMinimize,
  trackWindowMaximize,
  trackWindowDrag,
  trackDockInteract,
  // Performance & Errors
  trackPerformanceTiming,
  trackApiLatency,
  trackErrorJs,
  trackErrorApi,
  // Session
  trackSessionStart,
  trackFeatureAdoption,
  // Helpers
  getDeviceType,
} from '@/lib/analytics';
import { useIsMobile } from './useMediaQuery';
import type { PageId } from '@/lib/commands/types';
import type { InteractionMethod } from '@/lib/ga4/types';

/**
 * Custom hook providing comprehensive GA4 analytics tracking
 */
export function useAnalytics() {
  const isMobile = useIsMobile();
  const deviceType = getDeviceType();

  // Track current page for context
  const currentPageRef = useRef<PageId>('accueil');

  const setCurrentPage = useCallback((page: PageId) => {
    currentPageRef.current = page;
  }, []);

  // ============================================================================
  // NAVIGATION (backward compatible)
  // ============================================================================

  const trackNavigation = useCallback(
    (page: PageId, source: 'header' | 'mobile_nav') => {
      const previousPage = currentPageRef.current;
      trackNavigationClick(page, source, previousPage);
      currentPageRef.current = page;
    },
    []
  );

  const trackPage = useCallback(
    (pageId: PageId, language?: string, theme?: string) => {
      trackPageView(pageId, { language, theme });
      currentPageRef.current = pageId;
    },
    []
  );

  const trackScroll = useCallback(
    (threshold: 25 | 50 | 75 | 100, timeToThresholdMs: number) => {
      trackScrollDepth(currentPageRef.current, threshold, timeToThresholdMs);
    },
    []
  );

  // ============================================================================
  // CHAT (backward compatible)
  // ============================================================================

  const trackChatOpen = useCallback(
    (trigger: string) => {
      // Map legacy trigger strings to new types
      const triggerType = trigger === 'keyboard' ? 'keyboard'
        : trigger === 'suggestion' ? 'suggestion'
        : trigger === 'fab' ? 'fab'
        : 'button';

      trackChatPanelOpen(triggerType, currentPageRef.current);
    },
    []
  );

  const trackChatClose = useCallback(() => {
    trackChatPanelClose();
  }, []);

  const trackChatMessage = useCallback(
    (messageLength: number, source: string, messageContent?: string) => {
      const sourceVariant = source === 'standalone' ? 'standalone' : 'panel';
      const hasCommand = messageContent ? messageContent.startsWith('/') : false;
      trackChatMessageSend(messageLength, sourceVariant, currentPageRef.current, hasCommand, messageContent);
    },
    []
  );

  const trackSuggestionClick = useCallback(
    (variant: string, category: string, position: number = 0, suggestionText: string = '') => {
      const suggestionVariant = variant === 'floating' ? 'floating' : 'inline';
      const isAIGenerated = category === 'ai_generated';
      trackChatSuggestionClick(suggestionVariant, category, position, suggestionText, isAIGenerated);
    },
    []
  );

  // ============================================================================
  // AI/PROMPT (backward compatible)
  // ============================================================================

  const trackInlineSuggestion = useCallback(
    (type: string, source: string) => {
      const isAIGenerated = type === 'ai_generated';
      trackChatSuggestionClick('inline', source, 0, '', isAIGenerated);
    },
    []
  );

  const trackPromptGeneration = useCallback(
    (type: string, success: boolean, responseTimeMs: number = 0) => {
      const promptType = type === 'visual_mode' ? 'visual_mode'
        : type === 'inline' ? 'inline'
        : 'prompt_bar';
      trackPromptGenerate(promptType, success, responseTimeMs);
    },
    []
  );

  // ============================================================================
  // CUSTOMIZATION (backward compatible)
  // ============================================================================

  const trackThemeChangeEvent = useCallback(
    (from: string, to: string) => {
      trackThemeChange(from, to);
    },
    []
  );

  const trackLanguageChangeEvent = useCallback(
    (from: string, to: string) => {
      // Detect RTL switch
      const rtlLanguages = ['he', 'ar'];
      const wasRtl = rtlLanguages.includes(from);
      const isRtl = rtlLanguages.includes(to);
      const isRtlSwitch = wasRtl !== isRtl;
      trackLanguageChange(from, to, isRtlSwitch);
    },
    []
  );

  const trackVisualModeChangeEvent = useCallback(
    (from: string, to: string, isAIGenerated: boolean = false) => {
      trackVisualModeChange(from, to, isAIGenerated);
    },
    []
  );

  const trackReset = useCallback(
    (previousTheme: string, previousLanguage: string, previousVisualMode: string | null, windowsCount: number) => {
      trackAppReset(previousTheme, previousLanguage, previousVisualMode, windowsCount);
    },
    []
  );

  // ============================================================================
  // CONTENT ENGAGEMENT (new)
  // ============================================================================

  const trackProjectStart = useCallback(
    (projectId: string) => {
      trackProjectViewStart(projectId);
    },
    []
  );

  const trackProjectEnd = useCallback(
    (projectId: string, title: string, category: string, technologies: string[], wasExpanded: boolean = false) => {
      trackProjectViewEnd(projectId, title, category, technologies, wasExpanded);
    },
    []
  );

  const trackProjectLink = useCallback(
    (projectId: string, title: string, linkType: 'live' | 'github', category: string) => {
      trackProjectLinkClick(projectId, title, linkType, category);
    },
    []
  );

  const trackSkillStart = useCallback(
    (categoryId: string) => {
      trackSkillCategoryViewStart(categoryId);
    },
    []
  );

  const trackSkillEnd = useCallback(
    (categoryId: string, categoryName: string, skillsCount: number) => {
      trackSkillCategoryViewEnd(categoryId, categoryName, skillsCount);
    },
    []
  );

  const trackSkillHover = useCallback(
    (categoryId: string, skillName: string) => {
      trackSkillHovered(categoryId, skillName);
    },
    []
  );

  // Simple skill category view tracking (combines start for simplicity)
  const trackSkillCategory = useCallback(
    (categoryId: string, categoryName: string, skillCount: number) => {
      trackSkillCategoryViewStart(categoryId);
      trackSkillCategoryViewEnd(categoryId, categoryName, skillCount);
    },
    []
  );

  const trackContactForm = useCallback(
    (
      step: 'start' | 'field_focus' | 'field_blur' | 'submit' | 'success' | 'error',
      options?: {
        fieldName?: string;
        fieldValueLength?: number;
        errorType?: string;
        timeOnFormMs?: number;
        fieldsFilledCount?: number;
      }
    ) => {
      trackContactFormInteraction(step, options);
    },
    []
  );

  const trackSocialLink = useCallback(
    (platform: string, url: string, location: 'header' | 'footer' | 'contact_page' | 'about_page') => {
      trackSocialLinkClick(platform, url, location);
    },
    []
  );

  // ============================================================================
  // MEDIA (new)
  // ============================================================================

  const trackLightbox = useCallback(
    (
      action: 'open' | 'close' | 'navigate' | 'zoom',
      options?: {
        imageId?: string;
        imageIndex?: number;
        totalImages?: number;
        sourceGallery?: string;
        direction?: 'next' | 'previous' | 'jump';
        method?: InteractionMethod;
        closeMethod?: 'button' | 'backdrop' | 'escape' | 'swipe';
        zoomAction?: 'in' | 'out';
        zoomMethod?: 'button' | 'pinch' | 'double_tap';
      }
    ) => {
      switch (action) {
        case 'open':
          trackLightboxOpen(
            options?.imageId || '',
            options?.imageIndex || 0,
            options?.totalImages || 0,
            options?.sourceGallery || 'gallery'
          );
          break;
        case 'navigate':
          trackLightboxNavigate(
            options?.imageId || '',
            options?.imageIndex || 0,
            options?.totalImages || 0,
            options?.direction || 'next',
            options?.method || 'click'
          );
          break;
        case 'zoom':
          trackLightboxZoom(
            options?.imageId || '',
            options?.zoomAction || 'in',
            options?.zoomMethod || 'button'
          );
          break;
        case 'close':
          trackLightboxClose(options?.closeMethod || 'button');
          break;
      }
    },
    []
  );

  // ============================================================================
  // WINDOWS (new)
  // ============================================================================

  const trackWindow = useCallback(
    (
      action: 'create' | 'close' | 'minimize' | 'maximize' | 'drag',
      options: {
        windowKey: string;
        windowTitle?: string;
        windowType?: string;
        triggerSource?: 'chat_command' | 'suggestion' | 'link';
        closeMethod?: 'button' | 'command' | 'reset';
        maximizeAction?: 'maximize' | 'restore';
        dragDistancePx?: number;
        dragDurationMs?: number;
        activeWindowsCount?: number;
        minimizedWindowsCount?: number;
      }
    ) => {
      switch (action) {
        case 'create':
          trackWindowCreate(
            options.windowKey,
            options.windowTitle || '',
            options.windowType || 'custom',
            options.triggerSource || 'chat_command',
            options.activeWindowsCount || 1
          );
          break;
        case 'close':
          trackWindowClose(
            options.windowKey,
            options.windowTitle || '',
            options.closeMethod || 'button'
          );
          break;
        case 'minimize':
          trackWindowMinimize(
            options.windowKey,
            options.windowTitle || '',
            options.minimizedWindowsCount || 1
          );
          break;
        case 'maximize':
          trackWindowMaximize(
            options.windowKey,
            options.windowTitle || '',
            options.maximizeAction || 'maximize'
          );
          break;
        case 'drag':
          trackWindowDrag(
            options.windowKey,
            options.dragDistancePx || 0,
            options.dragDurationMs || 0
          );
          break;
      }
    },
    []
  );

  const trackDock = useCallback(
    (action: 'restore' | 'hover', windowKey: string, timeMinimizedMs: number) => {
      trackDockInteract(action, windowKey, timeMinimizedMs);
    },
    []
  );

  // ============================================================================
  // PERFORMANCE & ERRORS (new)
  // ============================================================================

  const trackPerformance = useCallback(
    (metric: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP', value: number, connectionType?: string) => {
      trackPerformanceTiming(metric, value, connectionType);
    },
    []
  );

  const trackApiCall = useCallback(
    (endpoint: string, method: 'GET' | 'POST', responseTimeMs: number, statusCode: number, success: boolean) => {
      trackApiLatency(endpoint, method, responseTimeMs, statusCode, success);
    },
    []
  );

  const trackJsError = useCallback(
    (message: string, type: string, stack?: string, component?: string, userAction?: string) => {
      trackErrorJs(message, type, stack, component, userAction);
    },
    []
  );

  const trackApiError = useCallback(
    (endpoint: string, message: string, statusCode?: number, requestType?: string) => {
      trackErrorApi(endpoint, message, statusCode, requestType);
    },
    []
  );

  // ============================================================================
  // SESSION (new)
  // ============================================================================

  const trackSession = useCallback(
    (referrerType: 'direct' | 'organic' | 'social' | 'referral' | 'email', referrerSource?: string) => {
      trackSessionStart(referrerType, referrerSource);
    },
    []
  );

  const trackFeature = useCallback(
    (featureName: string) => {
      trackFeatureAdoption(featureName);
    },
    []
  );

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Context
    setCurrentPage,
    deviceType,
    isMobile,

    // Navigation (backward compatible)
    trackNavigation,
    trackPage,
    trackScroll,

    // Chat (backward compatible)
    trackChatOpen,
    trackChatClose,
    trackChatMessage,
    trackSuggestionClick,

    // AI/Prompt (backward compatible)
    trackInlineSuggestion,
    trackPromptGeneration,

    // Customization (backward compatible)
    trackThemeChange: trackThemeChangeEvent,
    trackLanguageChange: trackLanguageChangeEvent,
    trackVisualModeChange: trackVisualModeChangeEvent,
    trackReset,

    // Content engagement (new)
    trackProjectStart,
    trackProjectEnd,
    trackProjectLink,
    trackSkillStart,
    trackSkillEnd,
    trackSkillHover,
    trackSkillCategory,
    trackContactForm,
    trackSocialLink,

    // Media (new)
    trackLightbox,

    // Windows (new)
    trackWindow,
    trackDock,

    // Performance & Errors (new)
    trackPerformance,
    trackApiCall,
    trackJsError,
    trackApiError,

    // Session (new)
    trackSession,
    trackFeature,
  };
}
