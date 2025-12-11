import { track } from '@vercel/analytics';
import type { PageId } from './commands/types';

// Définitions de types pour tous les événements
type NavigationEvent = {
  name: 'navigation_clicked';
  properties: {
    page: PageId;
    source: 'header' | 'mobile_nav';
  };
};

type ChatEvent =
  | {
      name: 'chat_opened';
      properties: {
        source: string;
        trigger: string;
      };
    }
  | {
      name: 'chat_closed';
      properties: {
        source: string;
      };
    }
  | {
      name: 'chat_message_sent';
      properties: {
        source: string;
        length: number;
      };
    }
  | {
      name: 'chat_suggestion_clicked';
      properties: {
        variant: string;
        category: string;
      };
    };

type CustomizationEvent =
  | {
      name: 'theme_changed';
      properties: {
        from: string;
        to: string;
      };
    }
  | {
      name: 'language_changed';
      properties: {
        from: string;
        to: string;
      };
    }
  | {
      name: 'visual_mode_changed';
      properties: {
        from: string;
        to: string;
      };
    };

type InteractionEvent =
  | {
      name: 'inline_suggestion_clicked';
      properties: {
        type: string;
        source: string;
      };
    }
  | {
      name: 'prompt_generated';
      properties: {
        type: string;
        success: boolean;
      };
    };

export type AnalyticsEvent =
  | NavigationEvent
  | ChatEvent
  | CustomizationEvent
  | InteractionEvent;

/**
 * Track custom events to Vercel Analytics
 * @param event - Event name
 * @param properties - Event properties
 */
export function trackEvent<E extends AnalyticsEvent>(
  event: E['name'],
  properties?: E['properties']
): void {
  try {
    // En développement : log console uniquement
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties);
      return;
    }

    // En production : envoyer à Vercel Analytics
    track(event, properties as Record<string, string | number | boolean>);
  } catch (error) {
    // Ne jamais faire planter l'app pour un problème d'analytics
    console.error('[Analytics] Failed to track event:', error);
  }
}
