/**
 * useErrorTracking Hook
 * Captures and tracks JavaScript errors and unhandled promise rejections
 */

import { useEffect, useCallback } from 'react';
import { trackErrorJs, trackErrorApi } from '@/lib/analytics';

interface UseErrorTrackingOptions {
  enabled?: boolean;
  componentName?: string;
}

export function useErrorTracking({ enabled = true, componentName }: UseErrorTrackingOptions = {}) {
  // Track errors manually from components
  const trackError = useCallback(
    (error: Error | string, userAction?: string) => {
      const errorMessage = typeof error === 'string' ? error : error.message;
      const errorType = typeof error === 'string' ? 'custom' : error.name || 'Error';
      const errorStack = typeof error === 'string' ? undefined : error.stack;

      trackErrorJs(errorMessage, errorType, errorStack, componentName, userAction);
    },
    [componentName]
  );

  useEffect(() => {
    if (!enabled) return;

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      // Ignore errors from extensions or third-party scripts
      if (event.filename && !event.filename.includes(window.location.origin)) {
        return;
      }

      trackErrorJs(
        event.message || 'Unknown error',
        'uncaught',
        event.error?.stack,
        componentName,
        undefined
      );
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Unhandled promise rejection';
      const errorStack = error instanceof Error ? error.stack : undefined;

      trackErrorJs(
        errorMessage,
        'unhandled_rejection',
        errorStack,
        componentName,
        undefined
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enabled, componentName]);

  return { trackError };
}

/**
 * Higher-order function to wrap async operations with error tracking
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    componentName?: string;
    userAction?: string;
  } = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorType = error instanceof Error ? error.name : 'Error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      trackErrorJs(errorMessage, errorType, errorStack, options.componentName, options.userAction);

      throw error; // Re-throw to maintain original behavior
    }
  }) as T;
}

/**
 * Track API errors specifically
 */
export function trackFetchError(
  endpoint: string,
  error: Error | Response,
  requestType: string = 'fetch'
) {
  if (error instanceof Response) {
    // HTTP error response
    trackErrorApi(endpoint, `HTTP ${error.status}: ${error.statusText}`, error.status, requestType);
  } else {
    // Network or other error
    trackErrorApi(endpoint, error.message, undefined, requestType);
  }
}
