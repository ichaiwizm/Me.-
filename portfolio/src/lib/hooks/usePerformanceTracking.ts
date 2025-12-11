/**
 * usePerformanceTracking Hook
 * Tracks Core Web Vitals: FCP, LCP, FID, CLS, TTFB, INP
 */

import { useEffect, useRef } from 'react';
import { trackPerformanceTiming } from '@/lib/analytics';
import { GA4_CONFIG } from '@/lib/ga4/config';

interface UsePerformanceTrackingOptions {
  enabled?: boolean;
}

export function usePerformanceTracking({ enabled = true }: UsePerformanceTrackingOptions = {}) {
  const hasTracked = useRef({
    FCP: false,
    LCP: false,
    FID: false,
    CLS: false,
    TTFB: false,
    INP: false,
  });

  useEffect(() => {
    // Only track in production
    if (!enabled || GA4_CONFIG.DEBUG_MODE) return;

    // Check for PerformanceObserver support
    if (!('PerformanceObserver' in window)) {
      console.warn('[Performance] PerformanceObserver not supported');
      return;
    }

    const observers: PerformanceObserver[] = [];
    let clsValue = 0;

    // Get connection type if available
    const getConnectionType = (): string | undefined => {
      const nav = navigator as Navigator & {
        connection?: { effectiveType?: string };
      };
      return nav.connection?.effectiveType;
    };

    // Track Time to First Byte (TTFB)
    try {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && !hasTracked.current.TTFB) {
        const navEntry = navEntries[0];
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        if (ttfb > 0) {
          trackPerformanceTiming('TTFB', ttfb, getConnectionType());
          hasTracked.current.TTFB = true;
        }
      }
    } catch (e) {
      // Silently fail
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint' && !hasTracked.current.FCP) {
            trackPerformanceTiming('FCP', entry.startTime, getConnectionType());
            hasTracked.current.FCP = true;
            fcpObserver.disconnect();
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      observers.push(fcpObserver);
    } catch (e) {
      // Silently fail
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          // LCP is reported multiple times, use the last one
          const lastEntry = entries[entries.length - 1];
          if (!hasTracked.current.LCP) {
            trackPerformanceTiming('LCP', lastEntry.startTime, getConnectionType());
            hasTracked.current.LCP = true;
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);
    } catch (e) {
      // Silently fail
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          if (!hasTracked.current.FID) {
            const fid = fidEntry.processingStart - fidEntry.startTime;
            trackPerformanceTiming('FID', fid, getConnectionType());
            hasTracked.current.FID = true;
            fidObserver.disconnect();
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);
    } catch (e) {
      // Silently fail
    }

    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          // Only count shifts without recent user input
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);
    } catch (e) {
      // Silently fail
    }

    // Interaction to Next Paint (INP)
    try {
      let maxINP = 0;
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as PerformanceEventTiming;
          const duration = eventEntry.duration;
          if (duration > maxINP) {
            maxINP = duration;
          }
        }
      });
      inpObserver.observe({ entryTypes: ['event'] });
      observers.push(inpObserver);

      // Report INP on page hide
      const reportINP = () => {
        if (maxINP > 0 && !hasTracked.current.INP) {
          trackPerformanceTiming('INP', maxINP, getConnectionType());
          hasTracked.current.INP = true;
        }
      };

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportINP();
        }
      });
    } catch (e) {
      // Silently fail
    }

    // Report CLS on page hide
    const reportCLS = () => {
      if (!hasTracked.current.CLS && clsValue > 0) {
        trackPerformanceTiming('CLS', clsValue, getConnectionType());
        hasTracked.current.CLS = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also report on beforeunload for browsers that don't fire visibilitychange
    window.addEventListener('beforeunload', reportCLS);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', reportCLS);
    };
  }, [enabled]);
}
