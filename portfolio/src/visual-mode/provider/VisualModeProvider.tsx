import React from "react";
import { VisualModeContext, type VisualModeContextValue } from "./VisualModeContext";
import type { VisualModeId } from "../config/visual-mode-definitions";
import { VISUAL_MODE_DEFINITIONS } from "../config/visual-mode-definitions";
import {
  applyVisualModeToDocument,
  clearVisualModeFromDocument,
} from "../utils/apply-visual-mode";

type VisualModeProviderProps = {
  children: React.ReactNode;
};

/**
 * Provider for the Visual Mode system.
 * State is NOT persisted - resets on page refresh (it's a temporary "trip").
 */
export function VisualModeProvider({ children }: VisualModeProviderProps) {
  // No localStorage - intentionally temporary
  const [visualModeId, setVisualModeIdState] = React.useState<VisualModeId | null>(null);

  const setVisualModeId = React.useCallback((id: VisualModeId | null) => {
    setVisualModeIdState(id);
  }, []);

  const exitVisualMode = React.useCallback(() => {
    setVisualModeIdState(null);
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
