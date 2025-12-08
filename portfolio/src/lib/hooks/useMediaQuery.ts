import { useState, useEffect } from "react";

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string (e.g., "(max-width: 767px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // SSR safe: default to false, will update on client
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Legacy browsers (Safari < 14)
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

/**
 * Convenience hook for mobile detection
 * @returns true if viewport is mobile (<768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Convenience hook for desktop detection
 * @returns true if viewport is desktop (≥768px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
