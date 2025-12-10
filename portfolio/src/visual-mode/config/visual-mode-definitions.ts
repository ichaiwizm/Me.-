/**
 * Visual Mode Definitions
 * Six radical visual transformations for the portfolio
 */

export type VisualModeId =
  | "neo-brutalism"
  | "retro-pixel"
  | "newspaper"
  | "matrix"
  | "glitch";

export type VisualModeDef = {
  id: VisualModeId;
  className: string;
  labelKey: string;
  descriptionKey: string;
};

export const VISUAL_MODE_DEFINITIONS: Record<VisualModeId, VisualModeDef> = {
  "neo-brutalism": {
    id: "neo-brutalism",
    className: "visual-mode-neo-brutalism",
    labelKey: "visualModes.neoBrutalism.label",
    descriptionKey: "visualModes.neoBrutalism.description",
  },
  "retro-pixel": {
    id: "retro-pixel",
    className: "visual-mode-retro-pixel",
    labelKey: "visualModes.retroPixel.label",
    descriptionKey: "visualModes.retroPixel.description",
  },
  "newspaper": {
    id: "newspaper",
    className: "visual-mode-newspaper",
    labelKey: "visualModes.newspaper.label",
    descriptionKey: "visualModes.newspaper.description",
  },
  "matrix": {
    id: "matrix",
    className: "visual-mode-matrix",
    labelKey: "visualModes.matrix.label",
    descriptionKey: "visualModes.matrix.description",
  },
  "glitch": {
    id: "glitch",
    className: "visual-mode-glitch",
    labelKey: "visualModes.glitch.label",
    descriptionKey: "visualModes.glitch.description",
  },
};

export const ALL_VISUAL_MODE_IDS = Object.keys(VISUAL_MODE_DEFINITIONS) as VisualModeId[];

export const ALL_VISUAL_MODE_CLASSNAMES = Object.values(VISUAL_MODE_DEFINITIONS).map(
  (m) => m.className
);

export function getVisualModeById(id: VisualModeId): VisualModeDef {
  return VISUAL_MODE_DEFINITIONS[id];
}

export function isValidVisualModeId(id: string): id is VisualModeId {
  return id in VISUAL_MODE_DEFINITIONS;
}
