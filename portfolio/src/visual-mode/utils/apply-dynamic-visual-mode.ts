/**
 * Dynamic visual mode application with staggered animations.
 * V3: Full CSS generation from style options.
 */

import type { DynamicStyleOptions } from "@/lib/commands/types";
import { generateDynamicCSS } from "./generate-dynamic-css";

const STAGGER_DELAY = 50; // ms between each variable (~400ms total for 8 vars)

/**
 * Apply a dynamic visual mode with staggered CSS variable animation.
 * V3: Now accepts styles object for full CSS generation.
 */
export async function applyDynamicVisualMode(
  name: string,
  cssVariables: Record<string, string>,
  styles?: DynamicStyleOptions,
  customCSS?: string
): Promise<void> {
  console.log("[DynamicVisualMode] Applying:", name);
  console.log("[DynamicVisualMode] CSS Variables:", cssVariables);
  console.log("[DynamicVisualMode] Custom CSS length:", customCSS?.length || 0);

  const root = document.documentElement;

  // Clear any existing dynamic mode first
  clearDynamicVisualMode();

  // 1. Enable transitions on all elements
  root.classList.add("dynamic-visual-mode-transitioning");

  // 2. Apply CSS variables one by one with stagger delay
  const entries = Object.entries(cssVariables);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    await new Promise((r) => setTimeout(r, STAGGER_DELAY));
    root.style.setProperty(`--${key}`, value);
  }

  // 3. Collect all CSS to inject
  let finalCSS = "";

  // 3a. Always generate CSS (base styles + any style options)
  finalCSS += generateDynamicCSS(styles || {});

  // 3b. Append raw customCSS from Haiku (full creative freedom)
  if (customCSS && customCSS.trim().length > 0) {
    finalCSS += "\n\n/* Custom CSS by Haiku */\n" + customCSS;
  }

  // 3c. Inject combined CSS
  if (finalCSS.trim().length > 0) {
    let styleEl = document.getElementById("dynamic-visual-mode-css") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "dynamic-visual-mode-css";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = finalCSS;
    console.log("[DynamicVisualMode] CSS injected, length:", finalCSS.length);
  }

  // 4. Mark as active
  root.classList.add("dynamic-visual-mode-active");
  root.setAttribute("data-dynamic-visual-mode", name);
  console.log("[DynamicVisualMode] Active class added, mode:", name);

  // 5. Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove("dynamic-visual-mode-transitioning");
  }, 300);
}

/**
 * List of CSS variables that can be overridden by dynamic modes.
 */
const OVERRIDABLE_VARS = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "muted",
  "muted-foreground",
  "border",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "input",
  "ring",
  "destructive",
  "destructive-foreground",
];

/**
 * Clear the dynamic visual mode and restore theme defaults.
 */
export function clearDynamicVisualMode(): void {
  const root = document.documentElement;

  // Remove active classes
  root.classList.remove("dynamic-visual-mode-active", "dynamic-visual-mode-transitioning");
  root.removeAttribute("data-dynamic-visual-mode");

  // Remove custom CSS variables (restore theme values)
  OVERRIDABLE_VARS.forEach((v) => root.style.removeProperty(`--${v}`));

  // Remove generated CSS style elements
  document.getElementById("dynamic-visual-mode-css")?.remove();
}

/**
 * Check if a dynamic visual mode is currently active.
 */
export function isDynamicVisualModeActive(): boolean {
  return document.documentElement.hasAttribute("data-dynamic-visual-mode");
}

/**
 * Get the name of the currently active dynamic visual mode.
 */
export function getActiveDynamicVisualModeName(): string | null {
  return document.documentElement.getAttribute("data-dynamic-visual-mode");
}
