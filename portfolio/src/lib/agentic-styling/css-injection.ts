/**
 * CSS Injection System
 * Injects scoped CSS for specific elements during agentic styling
 */

// Store for all injected style elements
const styleSheets = new Map<string, HTMLStyleElement>();

// Track all CSS variables set by the agentic system
const agenticVariables = new Set<string>();

// CSS patterns that are blocked for security
const BLOCKED_CSS_PATTERNS = [
  /@import/gi,
  /expression\s*\(/gi,
  /javascript:/gi,
  /data:\s*text\/html/gi,
  /behavior\s*:/gi,
  /-moz-binding/gi,
];

/**
 * Apply CSS to specific elements matching a selector
 * CSS is scoped to only apply when agentic mode is active
 */
export function applyElementCSS(
  selector: string,
  css: string,
  scope: "self" | "children" | "both" = "self"
): { success: boolean; error?: string } {
  // Validate CSS for security
  const validation = validateCSS(css);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Generate unique ID for this style block
  const styleId = `agentic-style-${hashSelector(selector)}`;

  // Remove existing styles for this selector
  const existing = styleSheets.get(styleId);
  if (existing) {
    existing.remove();
  }

  // Build scoped CSS
  let scopedCSS = "";
  const baseSelector = `html.agentic-visual-mode-active ${selector}`;

  if (scope === "self" || scope === "both") {
    scopedCSS += `${baseSelector} {\n  ${css}\n}\n`;
  }
  if (scope === "children" || scope === "both") {
    scopedCSS += `${baseSelector} * {\n  ${css}\n}\n`;
  }

  // Create and inject style element
  const styleEl = document.createElement("style");
  styleEl.id = styleId;
  styleEl.setAttribute("data-agentic", "true");
  styleEl.setAttribute("data-selector", selector);
  styleEl.textContent = scopedCSS;
  document.head.appendChild(styleEl);

  styleSheets.set(styleId, styleEl);

  // Ensure active class is set
  document.documentElement.classList.add("agentic-visual-mode-active");

  return { success: true };
}

/**
 * Apply CSS with hover/focus/active states
 */
export function applyElementStateCSS(
  selector: string,
  states: {
    default?: string;
    hover?: string;
    focus?: string;
    active?: string;
  }
): { success: boolean; error?: string } {
  const styleId = `agentic-state-${hashSelector(selector)}`;

  // Remove existing
  const existing = styleSheets.get(styleId);
  if (existing) {
    existing.remove();
  }

  let scopedCSS = "";
  const baseSelector = `html.agentic-visual-mode-active ${selector}`;

  if (states.default) {
    const validation = validateCSS(states.default);
    if (!validation.valid) return { success: false, error: validation.error };
    scopedCSS += `${baseSelector} {\n  ${states.default}\n}\n`;
  }

  if (states.hover) {
    const validation = validateCSS(states.hover);
    if (!validation.valid) return { success: false, error: validation.error };
    scopedCSS += `${baseSelector}:hover {\n  ${states.hover}\n}\n`;
  }

  if (states.focus) {
    const validation = validateCSS(states.focus);
    if (!validation.valid) return { success: false, error: validation.error };
    scopedCSS += `${baseSelector}:focus, ${baseSelector}:focus-visible {\n  ${states.focus}\n}\n`;
  }

  if (states.active) {
    const validation = validateCSS(states.active);
    if (!validation.valid) return { success: false, error: validation.error };
    scopedCSS += `${baseSelector}:active {\n  ${states.active}\n}\n`;
  }

  const styleEl = document.createElement("style");
  styleEl.id = styleId;
  styleEl.setAttribute("data-agentic", "true");
  styleEl.setAttribute("data-selector", selector);
  styleEl.textContent = scopedCSS;
  document.head.appendChild(styleEl);

  styleSheets.set(styleId, styleEl);
  document.documentElement.classList.add("agentic-visual-mode-active");

  return { success: true };
}

/**
 * Set CSS custom properties on :root
 */
export function setCSSVariables(
  variables: Record<string, string>
): { success: boolean; error?: string } {
  const root = document.documentElement;

  for (const [key, value] of Object.entries(variables)) {
    // Validate value
    if (BLOCKED_CSS_PATTERNS.some((pattern) => pattern.test(value))) {
      return { success: false, error: `Blocked pattern in variable ${key}` };
    }

    // Normalize variable name
    const varName = key.startsWith("--") ? key : `--${key}`;
    root.style.setProperty(varName, value);
    agenticVariables.add(varName);
  }

  document.documentElement.classList.add("agentic-visual-mode-active");
  return { success: true };
}

/**
 * Inject raw CSS block (for keyframes, complex selectors, etc.)
 */
export function injectRawCSS(
  id: string,
  css: string
): { success: boolean; error?: string } {
  const validation = validateCSS(css);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const styleId = `agentic-raw-${id}`;

  // Remove existing
  const existing = styleSheets.get(styleId);
  if (existing) {
    existing.remove();
  }

  // Wrap in agentic scope where possible
  // Keyframes and @rules are kept as-is
  let processedCSS = css;

  // For non-@rule CSS, scope it
  if (!css.trim().startsWith("@")) {
    processedCSS = `html.agentic-visual-mode-active {\n${css}\n}`;
  }

  const styleEl = document.createElement("style");
  styleEl.id = styleId;
  styleEl.setAttribute("data-agentic", "true");
  styleEl.setAttribute("data-raw", "true");
  styleEl.textContent = processedCSS;
  document.head.appendChild(styleEl);

  styleSheets.set(styleId, styleEl);
  document.documentElement.classList.add("agentic-visual-mode-active");

  return { success: true };
}

/**
 * Remove styles for a specific selector
 */
export function removeElementCSS(selector: string): void {
  const styleId = `agentic-style-${hashSelector(selector)}`;
  const existing = styleSheets.get(styleId);
  if (existing) {
    existing.remove();
    styleSheets.delete(styleId);
  }

  const stateId = `agentic-state-${hashSelector(selector)}`;
  const stateExisting = styleSheets.get(stateId);
  if (stateExisting) {
    stateExisting.remove();
    styleSheets.delete(stateId);
  }
}

/**
 * Clear all agentic styles and reset to theme defaults
 */
export function clearAgenticStyles(): void {
  // Remove all style elements
  for (const styleEl of styleSheets.values()) {
    styleEl.remove();
  }
  styleSheets.clear();

  // Remove all CSS variables set by agentic system
  const root = document.documentElement;
  for (const varName of agenticVariables) {
    root.style.removeProperty(varName);
  }
  agenticVariables.clear();

  // Remove active class
  document.documentElement.classList.remove("agentic-visual-mode-active");
  document.documentElement.removeAttribute("data-agentic-mode");
}

/**
 * Get all currently applied agentic styles
 */
export function getAppliedStyles(): Array<{ selector: string; css: string }> {
  const styles: Array<{ selector: string; css: string }> = [];

  for (const styleEl of styleSheets.values()) {
    const selector = styleEl.getAttribute("data-selector");
    if (selector) {
      styles.push({
        selector,
        css: styleEl.textContent || "",
      });
    }
  }

  return styles;
}

/**
 * Get total size of all injected CSS
 */
export function getTotalCSSSize(): number {
  let total = 0;
  for (const styleEl of styleSheets.values()) {
    total += (styleEl.textContent || "").length;
  }
  return total;
}

/**
 * Check if we're approaching size limits
 */
export function isApproachingSizeLimit(maxBytes = 50000): boolean {
  return getTotalCSSSize() > maxBytes * 0.8;
}

/**
 * Set the visual mode name for reference
 */
export function setAgenticModeName(name: string): void {
  document.documentElement.setAttribute("data-agentic-mode", name);
}

// ============================================
// Internal utilities
// ============================================

/**
 * Validate CSS for security issues
 */
function validateCSS(css: string): { valid: boolean; error?: string } {
  for (const pattern of BLOCKED_CSS_PATTERNS) {
    if (pattern.test(css)) {
      return {
        valid: false,
        error: `Blocked CSS pattern detected: ${pattern.source}`,
      };
    }
  }
  return { valid: true };
}

/**
 * Generate a hash from selector for unique IDs
 */
function hashSelector(selector: string): string {
  let hash = 0;
  for (let i = 0; i < selector.length; i++) {
    hash = (hash << 5) - hash + selector.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
