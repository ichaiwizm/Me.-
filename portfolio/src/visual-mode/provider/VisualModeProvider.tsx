import React from "react";
import { VisualModeContext, type VisualModeContextValue } from "./VisualModeContext";
import type { VisualModeId } from "../config/visual-mode-definitions";
import { VISUAL_MODE_DEFINITIONS, isValidVisualModeId } from "../config/visual-mode-definitions";
import {
  applyVisualModeToDocument,
  clearVisualModeFromDocument,
} from "../utils/apply-visual-mode";

type VisualModeProviderProps = {
  children: React.ReactNode;
};

/**
 * Helper to update URL with mode parameter
 */
function updateUrlWithMode(modeId: VisualModeId | null) {
  const url = new URL(window.location.href);
  if (modeId) {
    url.searchParams.set("mode", modeId);
  } else {
    url.searchParams.delete("mode");
  }
  window.history.replaceState({}, "", url.toString());
}

/**
 * Provider for the Visual Mode system.
 * State is NOT persisted in localStorage - but can be shared via URL params.
 */
export function VisualModeProvider({ children }: VisualModeProviderProps) {
  // No localStorage - intentionally temporary (but shareable via URL)
  const [visualModeId, setVisualModeIdState] = React.useState<VisualModeId | null>(null);

  // Check URL params on mount for shared mode links
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");

    if (modeParam && isValidVisualModeId(modeParam)) {
      setVisualModeIdState(modeParam);
    }
  }, []);

  const setVisualModeId = React.useCallback((id: VisualModeId | null) => {
    setVisualModeIdState(id);
    updateUrlWithMode(id);
  }, []);

  const exitVisualMode = React.useCallback(() => {
    setVisualModeIdState(null);
    updateUrlWithMode(null);
  }, []);

  // Apply/clear visual mode when state changes
  React.useEffect(() => {
    if (visualModeId) {
      applyVisualModeToDocument(visualModeId);
    } else {
      clearVisualModeFromDocument();
    }
  }, [visualModeId]);

  const modes = React.useMemo(() => Object.values(VISUAL_MODE_DEFINITIONS), []);

  const value = React.useMemo<VisualModeContextValue>(
    () => ({
      visualModeId,
      setVisualModeId,
      exitVisualMode,
      isVisualModeActive: visualModeId !== null,
      modes,
    }),
    [visualModeId, setVisualModeId, exitVisualMode, modes]
  );

  return (
    <VisualModeContext.Provider value={value}>{children}</VisualModeContext.Provider>
  );
}
