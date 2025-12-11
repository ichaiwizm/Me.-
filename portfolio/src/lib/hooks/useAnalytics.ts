import { useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useIsMobile } from './useMediaQuery';
import type { PageId } from '@/lib/commands/types';

/**
 * Custom hook providing type-safe analytics tracking methods
 * @returns Object with tracking functions for different event categories
 */
export function useAnalytics() {
  const isMobile = useIsMobile();

  // Navigation tracking
  const trackNavigation = useCallback(
    (page: PageId, source: 'header' | 'mobile_nav') => {
      trackEvent('navigation_clicked', { page, source });
    },
    []
  );

  // Chat tracking
  const trackChatOpen = useCallback(
    (trigger: string) => {
      trackEvent('chat_opened', {
        source: isMobile ? 'mobile' : 'desktop',
        trigger,
      });
    },
    [isMobile]
  );

  const trackChatClose = useCallback(() => {
    trackEvent('chat_closed', {
      source: isMobile ? 'mobile' : 'desktop',
    });
  }, [isMobile]);

  const trackChatMessage = useCallback((messageLength: number, source: string) => {
    trackEvent('chat_message_sent', { source, length: messageLength });
  }, []);

  const trackSuggestionClick = useCallback((variant: string, category: string) => {
    trackEvent('chat_suggestion_clicked', { variant, category });
  }, []);

  // Customization tracking
  const trackThemeChange = useCallback((from: string, to: string) => {
    trackEvent('theme_changed', { from, to });
  }, []);

  const trackLanguageChange = useCallback((from: string, to: string) => {
    trackEvent('language_changed', { from, to });
  }, []);

  const trackVisualModeChange = useCallback((from: string, to: string) => {
    trackEvent('visual_mode_changed', { from, to });
  }, []);

  // Interaction tracking
  const trackInlineSuggestion = useCallback((type: string, source: string) => {
    trackEvent('inline_suggestion_clicked', { type, source });
  }, []);

  const trackPromptGeneration = useCallback((type: string, success: boolean) => {
    trackEvent('prompt_generated', { type, success });
  }, []);

  return {
    trackNavigation,
    trackChatOpen,
    trackChatClose,
    trackChatMessage,
    trackSuggestionClick,
    trackThemeChange,
    trackLanguageChange,
    trackVisualModeChange,
    trackInlineSuggestion,
    trackPromptGeneration,
  };
}
