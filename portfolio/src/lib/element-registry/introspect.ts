/**
 * Element Introspection
 * Runtime inspection of DOM elements for the AI to understand current styling
 */

import type { ElementInfo } from "./types";

/**
 * Key CSS properties to extract for element inspection
 */
const KEY_CSS_PROPERTIES = [
  // Colors
  "color",
  "backgroundColor",
  "borderColor",
  // Typography
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "textDecoration",
  "textAlign",
  // Box model
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  // Border
  "border",
  "borderWidth",
  "borderStyle",
  "borderRadius",
  // Layout
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "width",
  "height",
  "maxWidth",
  "maxHeight",
  "overflow",
  "zIndex",
  // Flexbox
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
  // Effects
  "boxShadow",
  "textShadow",
  "opacity",
  "transform",
  "transition",
  "backdropFilter",
  "filter",
  // Background
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
];

/**
 * Get detailed information about an element by selector
 */
export function getElementInfo(selector: string): ElementInfo {
  // Try to find elements matching the selector
  let elements: NodeListOf<Element>;
  try {
    elements = document.querySelectorAll(selector);
  } catch {
    // Invalid selector
    return createEmptyElementInfo(selector);
  }

  if (elements.length === 0) {
    return createEmptyElementInfo(selector);
  }

  const el = elements[0] as HTMLElement;
  const computed = window.getComputedStyle(el);

  // Extract key CSS properties
  const currentStyles: Record<string, string> = {};
  for (const prop of KEY_CSS_PROPERTIES) {
    const value = computed.getPropertyValue(camelToKebab(prop)) || (computed as unknown as Record<string, unknown>)[prop];
    if (value && value !== "none" && value !== "normal" && value !== "auto") {
      currentStyles[prop] = String(value);
    }
  }

  // Get inline styles
  const inlineStyles: Record<string, string> = {};
  for (let i = 0; i < el.style.length; i++) {
    const prop = el.style[i];
    inlineStyles[prop] = el.style.getPropertyValue(prop);
  }

  // Get bounding box
  const rect = el.getBoundingClientRect();

  // Get children summary (first 10)
  const children = Array.from(el.children)
    .slice(0, 10)
    .map((child) => ({
      tagName: child.tagName.toLowerCase(),
      className: child.className
        .toString()
        .split(" ")
        .slice(0, 5)
        .join(" "),
    }));

  // Get attributes (excluding class and style)
  const attributes: Record<string, string> = {};
  for (const attr of el.attributes) {
    if (!["class", "style"].includes(attr.name)) {
      attributes[attr.name] = attr.value;
    }
  }

  // Get pseudo-element styles if they exist
  const pseudoElements = extractPseudoElementStyles(el);

  return {
    selector,
    found: true,
    count: elements.length,
    tagName: el.tagName.toLowerCase(),
    classList: Array.from(el.classList),
    currentStyles,
    inlineStyles,
    boundingBox: {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      left: Math.round(rect.left),
    },
    children,
    attributes,
    pseudoElements,
  };
}

/**
 * Get multiple elements' info at once
 */
export function getMultipleElementsInfo(selectors: string[]): Record<string, ElementInfo> {
  const result: Record<string, ElementInfo> = {};
  for (const selector of selectors) {
    result[selector] = getElementInfo(selector);
  }
  return result;
}

/**
 * Get CSS variables currently set on :root
 */
export function getCurrentCSSVariables(): Record<string, string> {
  const root = document.documentElement;
  const computed = window.getComputedStyle(root);
  const variables: Record<string, string> = {};

  // Common CSS variables used in the portfolio
  const varNames = [
    "--background",
    "--foreground",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--accent",
    "--accent-foreground",
    "--muted",
    "--muted-foreground",
    "--card",
    "--card-foreground",
    "--border",
    "--input",
    "--ring",
    "--destructive",
    "--destructive-foreground",
  ];

  for (const name of varNames) {
    const value = computed.getPropertyValue(name).trim();
    if (value) {
      variables[name] = value;
    }
  }

  return variables;
}

/**
 * Create an empty ElementInfo for when element is not found
 */
function createEmptyElementInfo(selector: string): ElementInfo {
  return {
    selector,
    found: false,
    count: 0,
    tagName: "",
    classList: [],
    currentStyles: {},
    inlineStyles: {},
    boundingBox: { width: 0, height: 0, top: 0, left: 0 },
    children: [],
    attributes: {},
  };
}

/**
 * Extract pseudo-element styles (::before, ::after)
 */
function extractPseudoElementStyles(
  el: HTMLElement
): { before?: Record<string, string>; after?: Record<string, string> } | undefined {
  const beforeStyles = window.getComputedStyle(el, "::before");
  const afterStyles = window.getComputedStyle(el, "::after");

  const result: { before?: Record<string, string>; after?: Record<string, string> } = {};

  if (beforeStyles.content && beforeStyles.content !== "none" && beforeStyles.content !== '""') {
    result.before = {
      content: beforeStyles.content,
      position: beforeStyles.position,
      background: beforeStyles.background,
      color: beforeStyles.color,
      width: beforeStyles.width,
      height: beforeStyles.height,
    };
  }

  if (afterStyles.content && afterStyles.content !== "none" && afterStyles.content !== '""') {
    result.after = {
      content: afterStyles.content,
      position: afterStyles.position,
      background: afterStyles.background,
      color: afterStyles.color,
      width: afterStyles.width,
      height: afterStyles.height,
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
