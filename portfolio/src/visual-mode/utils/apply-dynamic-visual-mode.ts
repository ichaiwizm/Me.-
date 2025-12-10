/**
 * Dynamic visual mode application with staggered animations.
 * Allows Haiku to create custom visual modes on-the-fly.
 */

const STAGGER_DELAY = 60; // ms between each variable (~500ms total for 8 vars)

/**
 * Apply a dynamic visual mode with staggered CSS variable animation.
 * Each variable is applied with a delay, creating a wave effect.
 */
export async function applyDynamicVisualMode(
  name: string,
  cssVariables: Record<string, string>,
  customCSS?: string
): Promise<void> {
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

  // 3. Inject custom CSS if provided
  if (customCSS) {
    let styleEl = document.getElementById("dynamic-visual-mode-style") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "dynamic-visual-mode-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customCSS;
  }

  // 4. Mark as active
  root.classList.add("dynamic-visual-mode-active");
  root.setAttribute("data-dynamic-visual-mode", name);

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

  // Remove custom style element
  document.getElementById("dynamic-visual-mode-style")?.remove();
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
