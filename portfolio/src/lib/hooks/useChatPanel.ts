import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "portfolio-chat-panel-open";
const DEFAULT_OPEN = true; // Panel ouvert par défaut

type UseChatPanelReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

/**
 * Hook to manage chat panel open/closed state with localStorage persistence
 */
export function useChatPanel(): UseChatPanelReturn {
  // Initialize with default, then hydrate from localStorage
  const [isOpen, setIsOpen] = useState(DEFAULT_OPEN);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsOpen(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read chat panel state from localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when state changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isOpen));
    } catch (e) {
      console.warn("Failed to save chat panel state to localStorage:", e);
    }
  }, [isOpen, isHydrated]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
