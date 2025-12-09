// Visual Mode System
// Temporary radical visual transformations for the portfolio

export { VisualModeProvider } from "./provider/VisualModeProvider";
export { useVisualMode } from "./provider/VisualModeContext";
export type { VisualModeContextValue } from "./provider/VisualModeContext";

export type { VisualModeId, VisualModeDef } from "./config/visual-mode-definitions";
export {
  VISUAL_MODE_DEFINITIONS,
  ALL_VISUAL_MODE_IDS,
  ALL_VISUAL_MODE_CLASSNAMES,
  getVisualModeById,
  isValidVisualModeId,
} from "./config/visual-mode-definitions";
