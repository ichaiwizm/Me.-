/**
 * DOM manipulation utilities for applying/removing visual modes
 */

import { VISUAL_MODE_DEFINITIONS, ALL_VISUAL_MODE_CLASSNAMES } from "../config/visual-mode-definitions";
import type { VisualModeId } from "../config/visual-mode-definitions";

/**
 * Apply a visual mode to the document root.
 * Visual mode classes have higher CSS specificity than theme classes.
 */
export function applyVisualModeToDocument(modeId: VisualModeId): void {
  const mode = VISUAL_MODE_DEFINITIONS[modeId];
  const root = document.documentElement;

  requestAnimationFrame(() => {
    // Add new mode class first
    root.classList.add(mode.className);

    // Remove other mode classes (if switching between modes)
    ALL_VISUAL_MODE_CLASSNAMES.forEach((cls) => {
      if (cls !== mode.className) {
        root.classList.remove(cls);
      }
    });

    // Set data attribute for debugging and CSS selectors
    root.setAttribute("data-visual-mode", mode.id);
  });
}

/**
 * Remove all visual mode classes from the document root.
 * Restores the underlying theme.
 */
export function clearVisualModeFromDocument(): void {
  const root = document.documentElement;

  requestAnimationFrame(() => {
    // Remove all mode classes
    ALL_VISUAL_MODE_CLASSNAMES.forEach((cls) => {
      root.classList.remove(cls);
    });

    // Clear data attribute
    root.removeAttribute("data-visual-mode");
  });
}
