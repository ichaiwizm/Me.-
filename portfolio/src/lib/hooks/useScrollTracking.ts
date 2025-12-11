/**
 * useScrollTracking Hook
 * Tracks scroll depth at 25%, 50%, 75%, and 100% thresholds
 */

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/analytics';
import { GA4_CONFIG } from '@/lib/ga4/config';
import type { PageId } from '@/lib/commands/types';

interface UseScrollTrackingOptions {
  pageId: PageId;
  enabled?: boolean;
}

export function useScrollTracking({ pageId, enabled = true }: UseScrollTrackingOptions) {
  const pageStartTime = useRef(Date.now());
  const thresholdsReached = useRef(new Set<number>());
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Reset on page change
    pageStartTime.current = Date.now();
    thresholdsReached.current.clear();

    const checkScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Handle case where content doesn't need scrolling
      if (scrollHeight <= 0) {
        // If no scrolling needed, immediately track 100%
        if (!thresholdsReached.current.has(100)) {
          thresholdsReached.current.add(100);
          const timeToThreshold = Date.now() - pageStartTime.current;
          trackScrollDepth(pageId, 100, timeToThreshold);
        }
        return;
      }

      const scrollPercent = (window.scrollY / scrollHeight) * 100;

      for (const threshold of GA4_CONFIG.SCROLL_THRESHOLDS) {
        if (scrollPercent >= threshold && !thresholdsReached.current.has(threshold)) {
          thresholdsReached.current.add(threshold);
          const timeToThreshold = Date.now() - pageStartTime.current;
          trackScrollDepth(pageId, threshold as 25 | 50 | 75 | 100, timeToThreshold);
        }
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(checkScrollDepth);
      }
    };

    // Check initial position (in case page is already scrolled)
    checkScrollDepth();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageId, enabled]);
}
