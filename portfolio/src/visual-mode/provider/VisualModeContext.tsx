import React from "react";
import type { VisualModeId, VisualModeDef } from "../config/visual-mode-definitions";

export type VisualModeContextValue = {
  /** Current active visual mode, or null if no mode is active */
  visualModeId: VisualModeId | null;
  /** Set the active visual mode (null to exit) */
  setVisualModeId: (id: VisualModeId | null) => void;
  /** Exit the current visual mode (convenience function) */
  exitVisualMode: () => void;
  /** Whether any visual mode is currently active */
  isVisualModeActive: boolean;
  /** List of all available visual modes */
  modes: VisualModeDef[];
};

export const VisualModeContext = React.createContext<VisualModeContextValue | undefined>(
  undefined
);

export function useVisualMode(): VisualModeContextValue {
  const context = React.useContext(VisualModeContext);
  if (!context) {
    throw new Error("useVisualMode must be used within a VisualModeProvider");
  }
  return context;
}
