import type { DynamicStyleOptions } from "@/lib/commands/types";

// ============================================
// CONFIGURATION MAPS
// ============================================

const FONT_MAP: Record<NonNullable<DynamicStyleOptions["fontFamily"]>, string> = {
  sans: "system-ui, -apple-system, sans-serif",
  serif: "'Playfair Display', 'EB Garamond', Georgia, serif",
  mono: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
  pixel: "'Press Start 2P', monospace",
};

const FONT_WEIGHT_MAP: Record<NonNullable<DynamicStyleOptions["fontWeight"]>, string> = {
  normal: "400",
  bold: "700",
  black: "900",
};

const LETTER_SPACING_MAP: Record<NonNullable<DynamicStyleOptions["letterSpacing"]>, string> = {
  tight: "-0.03em",
  normal: "0",
  wide: "0.1em",
  extreme: "0.2em",
};

const BORDER_RADIUS_MAP: Record<NonNullable<DynamicStyleOptions["borderRadius"]>, string> = {
  none: "0",
  small: "4px",
  medium: "8px",
  large: "16px",
  pill: "9999px",
};

const BORDER_WIDTH_MAP: Record<NonNullable<DynamicStyleOptions["borderStyle"]>, string> = {
  none: "0",
  thin: "1px",
  medium: "2px",
  thick: "3px",
  brutal: "4px",
};

const ANIMATION_SPEED_MAP: Record<NonNullable<DynamicStyleOptions["animationSpeed"]>, string> = {
  instant: "0.05s",
  fast: "0.15s",
  normal: "0.3s",
  slow: "0.5s",
};

const ANIMATION_STYLE_MAP: Record<NonNullable<DynamicStyleOptions["animationStyle"]>, string> = {
  smooth: "ease-out",
  steps: "steps(3)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

const GLOW_INTENSITY_MAP: Record<NonNullable<DynamicStyleOptions["glowIntensity"]>, number> = {
  none: 0,
  subtle: 0.3,
  medium: 0.5,
  intense: 0.8,
  extreme: 1,
};

const SHADOW_INTENSITY_MAP: Record<NonNullable<DynamicStyleOptions["shadowIntensity"]>, number> = {
  subtle: 0.5,
  medium: 1,
  intense: 1.5,
  extreme: 2,
};

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

export function generateDynamicCSS(styles: DynamicStyleOptions): string {
  const s = normalizeStyles(styles);
  const lines: string[] = [];

  // CSS Custom Properties
  lines.push(generateCustomProperties(s));

  // Global styles
  lines.push(generateGlobalStyles(s));

  // Typography
  lines.push(generateTypography(s));

  // Components
  lines.push(generateButtons(s));
  lines.push(generateCards(s));
  lines.push(generateInputs(s));
  lines.push(generateHeader(s));
  lines.push(generateNavigation(s));
  lines.push(generateChat(s));
  lines.push(generateWindows(s));
  lines.push(generateBottomSheet(s));
  lines.push(generateLinks(s));
  lines.push(generateImages(s));
  lines.push(generateBadges(s));
  lines.push(generateScrollbar(s));
  lines.push(generateGlass(s));
  lines.push(generateMisc(s));

  // Effects
  lines.push(generateEffects(s));

  // Keyframes
  lines.push(generateKeyframes());

  return lines.filter(Boolean).join("\n\n");
}

// ============================================
// NORMALIZE STYLES (handle legacy + defaults)
// ============================================

function normalizeStyles(s: DynamicStyleOptions): DynamicStyleOptions {
  // Convert legacy properties to new ones
  const effects: DynamicStyleOptions["effects"] = s.effects || [];
  if (s.scanlines && !effects.includes("scanlines")) effects.push("scanlines");
  if (s.noise && !effects.includes("noise")) effects.push("noise");
  if (s.crt && !effects.includes("crt")) effects.push("crt");
  if (s.rgbSplit && !effects.includes("rgbSplit")) effects.push("rgbSplit");

  return {
    ...s,
    fontFamily: s.fontFamily || "sans",
    fontWeight: s.fontWeight || "normal",
    textTransform: s.textTransform || "none",
    letterSpacing: s.letterSpacing || "normal",
    borderStyle: s.borderStyle || s.borderWidth || "thin",
    borderRadius: s.borderRadius || "small",
    shadowStyle: s.shadowStyle || s.boxShadow || "soft",
    shadowIntensity: s.shadowIntensity || "medium",
    glowIntensity: s.glowIntensity || "none",
    animationSpeed: s.animationSpeed || s.transitionSpeed || "normal",
    animationStyle: s.animationStyle || (s.transitionStyle === "steps" ? "steps" : "smooth"),
    mood: s.mood || "dark",
    effects,
  };
}

// ============================================
// CSS CUSTOM PROPERTIES
// ============================================

function generateCustomProperties(s: DynamicStyleOptions): string {
  return `html.dynamic-visual-mode-active {
  --dvm-font: ${FONT_MAP[s.fontFamily!]};
  --dvm-font-weight: ${FONT_WEIGHT_MAP[s.fontWeight!]};
  --dvm-letter-spacing: ${LETTER_SPACING_MAP[s.letterSpacing!]};
  --dvm-border-radius: ${BORDER_RADIUS_MAP[s.borderRadius!]};
  --dvm-border-width: ${BORDER_WIDTH_MAP[s.borderStyle!]};
  --dvm-transition: ${ANIMATION_SPEED_MAP[s.animationSpeed!]};
  --dvm-timing: ${ANIMATION_STYLE_MAP[s.animationStyle!]};
  --dvm-glow: ${GLOW_INTENSITY_MAP[s.glowIntensity!]};
  --dvm-shadow-mult: ${SHADOW_INTENSITY_MAP[s.shadowIntensity!]};
}`;
}

// ============================================
// GLOBAL STYLES
// ============================================

function generateGlobalStyles(_s: DynamicStyleOptions): string {
  return `html.dynamic-visual-mode-active * {
  font-family: var(--dvm-font) !important;
  transition-duration: var(--dvm-transition) !important;
  transition-timing-function: var(--dvm-timing) !important;
  border-radius: var(--dvm-border-radius) !important;
}

html.dynamic-visual-mode-active *::selection {
  background: var(--primary) !important;
  color: var(--primary-foreground) !important;
}`;
}

// ============================================
// TYPOGRAPHY
// ============================================

function generateTypography(s: DynamicStyleOptions): string {
  const textTransform = s.textTransform === "uppercase" ? "text-transform: uppercase !important;" : "";
  const letterSpacing = `letter-spacing: var(--dvm-letter-spacing) !important;`;

  let textShadow = "";
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  if (glow > 0) {
    const blur1 = Math.round(10 * glow);
    const blur2 = Math.round(20 * glow);
    const blur3 = Math.round(40 * glow);
    textShadow = `text-shadow: 0 0 ${blur1}px var(--primary), 0 0 ${blur2}px var(--primary), 0 0 ${blur3}px var(--accent) !important;`;
  } else if (s.shadowStyle === "soft" || s.textShadow === "soft") {
    textShadow = "text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;";
  }

  let prefix = "";
  let suffix = "";
  if (s.mood === "brutal" || s.mood === "retro") {
    prefix = `html.dynamic-visual-mode-active h1::before { content: '> ' !important; opacity: 0.6; }`;
  } else if (s.mood === "futuristic" || s.mood === "neon") {
    prefix = `html.dynamic-visual-mode-active h1::before { content: '// ' !important; color: var(--accent); opacity: 0.7; }`;
    suffix = `html.dynamic-visual-mode-active h1::after { content: '_' !important; animation: dvmCursorBlink 1s step-end infinite; }`;
  }

  return `html.dynamic-visual-mode-active h1,
html.dynamic-visual-mode-active h2,
html.dynamic-visual-mode-active h3,
html.dynamic-visual-mode-active .text-headline,
html.dynamic-visual-mode-active .text-title {
  font-weight: var(--dvm-font-weight) !important;
  ${textTransform}
  ${letterSpacing}
  ${textShadow}
}

html.dynamic-visual-mode-active p,
html.dynamic-visual-mode-active span,
html.dynamic-visual-mode-active label {
  line-height: 1.6 !important;
}

html.dynamic-visual-mode-active .gradient-text,
html.dynamic-visual-mode-active .gradient-text-animated {
  background: none !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  -webkit-text-fill-color: var(--primary) !important;
  ${textShadow}
}

${prefix}
${suffix}`;
}

// ============================================
// BUTTONS
// ============================================

function generateButtons(s: DynamicStyleOptions): string {
  const shadow = generateBoxShadow(s, "button");
  const hoverShadow = generateBoxShadowHover(s, "button");
  const border = `border: var(--dvm-border-width) solid var(--border) !important;`;

  let wrapper = "";
  if (s.buttonWrapper && s.buttonWrapper !== "none") {
    const close = s.buttonWrapper === "[" ? "]" : s.buttonWrapper === "{" ? "}" : ">";
    wrapper = `
html.dynamic-visual-mode-active button::before { content: '${s.buttonWrapper}' !important; margin-right: 4px; opacity: 0.7; }
html.dynamic-visual-mode-active button::after { content: '${close}' !important; margin-left: 4px; opacity: 0.7; }`;
  } else if (s.mood === "brutal" || s.mood === "retro") {
    wrapper = `
html.dynamic-visual-mode-active button::before { content: '[' !important; margin-right: 4px; opacity: 0.6; }
html.dynamic-visual-mode-active button::after { content: ']' !important; margin-left: 4px; opacity: 0.6; }`;
  }

  return `html.dynamic-visual-mode-active button {
  ${border}
  ${shadow}
  background: var(--card) !important;
  color: var(--card-foreground) !important;
}

html.dynamic-visual-mode-active button:hover {
  ${hoverShadow}
  border-color: var(--primary) !important;
  ${s.shadowStyle === "offset" ? "transform: translate(-2px, -2px) !important;" : ""}
}

html.dynamic-visual-mode-active button:active {
  ${s.shadowStyle === "offset" ? "transform: translate(2px, 2px) !important; box-shadow: 2px 2px 0 var(--foreground) !important;" : ""}
}
${wrapper}`;
}

// ============================================
// CARDS
// ============================================

function generateCards(s: DynamicStyleOptions): string {
  const shadow = generateBoxShadow(s, "card");
  const hoverShadow = generateBoxShadowHover(s, "card");

  let corners = "";
  if (s.mood === "retro" || s.mood === "brutal") {
    corners = `
html.dynamic-visual-mode-active .card::before {
  content: '┌─' !important;
  position: absolute !important;
  top: -1px !important;
  left: -1px !important;
  color: var(--border) !important;
  font-size: 10px !important;
  line-height: 1 !important;
  opacity: 0.5;
}
html.dynamic-visual-mode-active .card::after {
  content: '─┘' !important;
  position: absolute !important;
  bottom: -1px !important;
  right: -1px !important;
  color: var(--border) !important;
  font-size: 10px !important;
  line-height: 1 !important;
  opacity: 0.5;
}`;
  }

  return `html.dynamic-visual-mode-active .card,
html.dynamic-visual-mode-active [class*="bg-card"] {
  border: var(--dvm-border-width) solid var(--border) !important;
  ${shadow}
  background: var(--card) !important;
  color: var(--card-foreground) !important;
  position: relative;
}

html.dynamic-visual-mode-active .card:hover,
html.dynamic-visual-mode-active [class*="bg-card"]:hover {
  ${hoverShadow}
  border-color: var(--primary) !important;
}
${corners}`;
}

// ============================================
// INPUTS
// ============================================

function generateInputs(s: DynamicStyleOptions): string {
  const shadow = generateBoxShadow(s, "input");
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const focusGlow = glow > 0
    ? `box-shadow: 0 0 ${Math.round(15 * glow)}px var(--primary), 0 0 ${Math.round(30 * glow)}px color-mix(in srgb, var(--primary) 50%, transparent) !important;`
    : "box-shadow: 0 0 0 2px var(--ring) !important;";

  return `html.dynamic-visual-mode-active input,
html.dynamic-visual-mode-active textarea,
html.dynamic-visual-mode-active select {
  border: var(--dvm-border-width) solid var(--border) !important;
  ${shadow}
  background: var(--input) !important;
  color: var(--foreground) !important;
}

html.dynamic-visual-mode-active input:focus,
html.dynamic-visual-mode-active textarea:focus,
html.dynamic-visual-mode-active select:focus {
  border-color: var(--primary) !important;
  ${focusGlow}
  outline: none !important;
}

html.dynamic-visual-mode-active input::placeholder,
html.dynamic-visual-mode-active textarea::placeholder {
  color: var(--muted-foreground) !important;
  opacity: 0.7 !important;
}`;
}

// ============================================
// HEADER
// ============================================

function generateHeader(s: DynamicStyleOptions): string {
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const shadow = glow > 0
    ? `box-shadow: 0 0 ${Math.round(20 * glow)}px color-mix(in srgb, var(--primary) 30%, transparent) !important;`
    : "";

  return `html.dynamic-visual-mode-active header {
  background: color-mix(in srgb, var(--background) 95%, transparent) !important;
  border-bottom: var(--dvm-border-width) solid var(--border) !important;
  ${shadow}
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

html.dynamic-visual-mode-active header [class*="bg-gradient"] {
  background: transparent !important;
}`;
}

// ============================================
// NAVIGATION
// ============================================

function generateNavigation(s: DynamicStyleOptions): string {
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const hoverGlow = glow > 0
    ? `text-shadow: 0 0 ${Math.round(10 * glow)}px var(--primary) !important;`
    : "";
  const activeGlow = glow > 0
    ? `text-shadow: 0 0 ${Math.round(10 * glow)}px var(--accent) !important;`
    : "";

  let prefix = "";
  if (s.mood === "brutal" || s.mood === "retro" || s.mood === "futuristic") {
    prefix = `
html.dynamic-visual-mode-active nav a::before {
  content: '>' !important;
  margin-right: 4px !important;
  opacity: 0 !important;
  transition: opacity var(--dvm-transition) var(--dvm-timing) !important;
}
html.dynamic-visual-mode-active nav a:hover::before,
html.dynamic-visual-mode-active nav a.active::before,
html.dynamic-visual-mode-active nav a[aria-current="page"]::before {
  opacity: 0.7 !important;
}`;
  }

  return `html.dynamic-visual-mode-active nav a {
  color: var(--muted-foreground) !important;
  text-decoration: none !important;
}

html.dynamic-visual-mode-active nav a:hover {
  color: var(--primary) !important;
  ${hoverGlow}
}

html.dynamic-visual-mode-active nav a.active,
html.dynamic-visual-mode-active nav a[aria-current="page"] {
  color: var(--accent) !important;
  ${activeGlow}
}
${prefix}`;
}

// ============================================
// CHAT & MESSAGES
// ============================================

function generateChat(s: DynamicStyleOptions): string {
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const shadow = glow > 0
    ? `box-shadow: -5px 0 ${Math.round(30 * glow)}px color-mix(in srgb, var(--primary) 20%, transparent) !important;`
    : "";

  let messagePrefix = "";
  if (s.mood === "brutal" || s.mood === "retro" || s.mood === "futuristic") {
    messagePrefix = `
html.dynamic-visual-mode-active [class*="message"]::before {
  content: '>' !important;
  color: var(--muted-foreground) !important;
  margin-right: 8px !important;
  opacity: 0.5;
}`;
  }

  return `html.dynamic-visual-mode-active .side-panel {
  background: color-mix(in srgb, var(--background) 98%, transparent) !important;
  border-left: var(--dvm-border-width) solid var(--border) !important;
  ${shadow}
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

html.dynamic-visual-mode-active [class*="ChatMessages"] > div,
html.dynamic-visual-mode-active [class*="message"] {
  background: var(--card) !important;
  border: var(--dvm-border-width) solid var(--border) !important;
  color: var(--card-foreground) !important;
}
${messagePrefix}`;
}

// ============================================
// WINDOWS
// ============================================

function generateWindows(s: DynamicStyleOptions): string {
  const shadow = generateBoxShadow(s, "window");
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const glowShadow = glow > 0
    ? `, inset 0 0 ${Math.round(60 * glow)}px color-mix(in srgb, var(--accent) 5%, transparent)`
    : "";

  return `html.dynamic-visual-mode-active [class*="FloatingWindow"],
html.dynamic-visual-mode-active div[style*="position: fixed"][style*="z-index"] {
  border: var(--dvm-border-width) solid var(--border) !important;
  ${shadow.replace("!important;", glowShadow + " !important;")}
  background: color-mix(in srgb, var(--background) 98%, transparent) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

html.dynamic-visual-mode-active .window-dock button {
  border: var(--dvm-border-width) solid var(--border) !important;
  background: var(--card) !important;
}

html.dynamic-visual-mode-active .window-dock button:hover {
  border-color: var(--primary) !important;
}`;
}

// ============================================
// BOTTOM SHEET (MOBILE)
// ============================================

function generateBottomSheet(s: DynamicStyleOptions): string {
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const handleGlow = glow > 0
    ? `box-shadow: 0 0 ${Math.round(10 * glow)}px var(--primary) !important;`
    : "";

  return `html.dynamic-visual-mode-active .bottom-sheet,
html.dynamic-visual-mode-active [class*="bottom-sheet"] {
  border: var(--dvm-border-width) solid var(--border) !important;
  border-bottom: none !important;
  background: color-mix(in srgb, var(--background) 98%, transparent) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

html.dynamic-visual-mode-active .bottom-sheet-backdrop {
  backdrop-filter: blur(5px) !important;
  background: color-mix(in srgb, var(--background) 80%, transparent) !important;
}

html.dynamic-visual-mode-active .bottom-sheet-handle {
  background: var(--primary) !important;
  ${handleGlow}
}`;
}

// ============================================
// LINKS
// ============================================

function generateLinks(s: DynamicStyleOptions): string {
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const hoverGlow = glow > 0
    ? `text-shadow: 0 0 ${Math.round(10 * glow)}px var(--primary) !important;`
    : "";

  let prefix = "";
  if (s.mood === "brutal" || s.mood === "retro") {
    prefix = `
html.dynamic-visual-mode-active a:hover::before {
  content: '→ ' !important;
  color: var(--primary) !important;
}`;
  }

  return `html.dynamic-visual-mode-active a {
  color: var(--accent) !important;
  text-decoration: none !important;
}

html.dynamic-visual-mode-active a:hover {
  color: var(--primary) !important;
  ${hoverGlow}
}
${prefix}`;
}

// ============================================
// IMAGES
// ============================================

function generateImages(s: DynamicStyleOptions): string {
  const shadow = generateBoxShadow(s, "image");
  const hoverShadow = generateBoxShadowHover(s, "image");

  let filter = "";
  if (s.mood === "retro") {
    filter = "filter: sepia(20%) contrast(1.1) !important;";
  } else if (s.mood === "futuristic" || s.mood === "neon") {
    filter = "filter: saturate(1.2) contrast(1.05) !important;";
  }

  return `html.dynamic-visual-mode-active img {
  border: var(--dvm-border-width) solid var(--border) !important;
  ${shadow}
  ${filter}
}

html.dynamic-visual-mode-active img:hover {
  border-color: var(--primary) !important;
  ${hoverShadow}
}`;
}

// ============================================
// BADGES & TAGS
// ============================================

function generateBadges(s: DynamicStyleOptions): string {
  const textTransform = s.textTransform === "uppercase" ? "text-transform: uppercase !important;" : "";

  return `html.dynamic-visual-mode-active [class*="badge"],
html.dynamic-visual-mode-active [class*="pill"],
html.dynamic-visual-mode-active [class*="tag"] {
  border: var(--dvm-border-width) solid var(--border) !important;
  background: var(--muted) !important;
  color: var(--muted-foreground) !important;
  ${textTransform}
  letter-spacing: 0.05em !important;
}`;
}

// ============================================
// SCROLLBAR
// ============================================

function generateScrollbar(s: DynamicStyleOptions): string {
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const thumbGlow = glow > 0
    ? `box-shadow: 0 0 ${Math.round(10 * glow)}px var(--primary) !important;`
    : "";

  return `html.dynamic-visual-mode-active *::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

html.dynamic-visual-mode-active *::-webkit-scrollbar-track {
  background: var(--background) !important;
  border-left: 1px solid var(--border) !important;
}

html.dynamic-visual-mode-active *::-webkit-scrollbar-thumb {
  background: var(--primary) !important;
  border-radius: var(--dvm-border-radius) !important;
  ${thumbGlow}
}

html.dynamic-visual-mode-active *::-webkit-scrollbar-thumb:hover {
  background: var(--accent) !important;
}`;
}

// ============================================
// GLASS ELEMENTS
// ============================================

function generateGlass(s: DynamicStyleOptions): string {
  const disableGlass = s.mood === "brutal" || s.shadowStyle === "offset" || s.shadowStyle === "hard";

  if (disableGlass) {
    return `html.dynamic-visual-mode-active .glass,
html.dynamic-visual-mode-active .glass-strong,
html.dynamic-visual-mode-active .glass-subtle,
html.dynamic-visual-mode-active [class*="backdrop-blur"] {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  background: var(--card) !important;
  border: var(--dvm-border-width) solid var(--border) !important;
}`;
  }

  return `html.dynamic-visual-mode-active .glass,
html.dynamic-visual-mode-active .glass-strong,
html.dynamic-visual-mode-active .glass-subtle,
html.dynamic-visual-mode-active [class*="backdrop-blur"] {
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  background: color-mix(in srgb, var(--card) 80%, transparent) !important;
  border: var(--dvm-border-width) solid var(--border) !important;
}`;
}

// ============================================
// MISC ELEMENTS
// ============================================

function generateMisc(s: DynamicStyleOptions): string {
  // Dividers
  let divider = `html.dynamic-visual-mode-active hr {
  border: none !important;
  height: 1px !important;
  background: linear-gradient(90deg, transparent, var(--border), transparent) !important;
  margin: 2rem 0 !important;
}`;

  if (s.mood === "brutal" || s.mood === "retro") {
    divider += `
html.dynamic-visual-mode-active hr::before {
  content: '────────────────────' !important;
  display: block !important;
  color: var(--border) !important;
  text-align: center !important;
  font-size: 8px !important;
  letter-spacing: -2px !important;
}`;
  }

  // Progress bars
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];
  const progressGlow = glow > 0
    ? `box-shadow: 0 0 ${Math.round(10 * glow)}px var(--primary) !important;`
    : "";

  const progress = `html.dynamic-visual-mode-active [role="progressbar"] {
  border: var(--dvm-border-width) solid var(--border) !important;
  background: var(--muted) !important;
}

html.dynamic-visual-mode-active [role="progressbar"] > div {
  background: var(--primary) !important;
  ${progressGlow}
}`;

  // Disable 3D effects
  const disable3D = `html.dynamic-visual-mode-active [style*="preserve-3d"],
html.dynamic-visual-mode-active [style*="perspective"] {
  transform-style: flat !important;
  perspective: none !important;
}`;

  // Exit button styling
  const exitButton = `html.dynamic-visual-mode-active .visual-mode-exit-button button {
  border: var(--dvm-border-width) solid var(--destructive) !important;
  background: transparent !important;
  color: var(--destructive) !important;
}

html.dynamic-visual-mode-active .visual-mode-exit-button button:hover {
  background: color-mix(in srgb, var(--destructive) 20%, transparent) !important;
}`;

  return `${divider}

${progress}

${disable3D}

${exitButton}`;
}

// ============================================
// EFFECTS (scanlines, noise, vignette, etc.)
// ============================================

function generateEffects(s: DynamicStyleOptions): string {
  const effects = s.effects || [];
  const lines: string[] = [];

  // Scanlines
  if (effects.includes("scanlines")) {
    lines.push(`html.dynamic-visual-mode-active::after {
  content: '' !important;
  position: fixed !important;
  inset: 0 !important;
  pointer-events: none !important;
  background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px) !important;
  z-index: 99999 !important;
}`);
  }

  // Noise
  if (effects.includes("noise")) {
    lines.push(`html.dynamic-visual-mode-active::before {
  content: '' !important;
  position: fixed !important;
  inset: 0 !important;
  pointer-events: none !important;
  opacity: 0.03 !important;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E") !important;
  z-index: 99998 !important;
}`);
  }

  // Vignette
  if (effects.includes("vignette")) {
    lines.push(`html.dynamic-visual-mode-active body::after {
  content: '' !important;
  position: fixed !important;
  inset: 0 !important;
  pointer-events: none !important;
  background: radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%) !important;
  z-index: 99997 !important;
}`);
  }

  // CRT
  if (effects.includes("crt")) {
    lines.push(`html.dynamic-visual-mode-active {
  filter: brightness(1.1) contrast(1.1) !important;
}`);
  }

  // RGB Split on headings
  if (effects.includes("rgbSplit")) {
    lines.push(`html.dynamic-visual-mode-active h1 {
  animation: dvmRgbSplit 4s infinite !important;
}`);
  }

  return lines.join("\n\n");
}

// ============================================
// KEYFRAMES
// ============================================

function generateKeyframes(): string {
  return `@keyframes dvmCursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes dvmRgbSplit {
  0%, 100% { text-shadow: -2px 0 var(--accent), 2px 0 var(--primary); }
  25% { text-shadow: 2px 0 var(--accent), -2px 0 var(--primary); }
  50% { text-shadow: -1px 2px var(--accent), 1px -2px var(--primary); }
  75% { text-shadow: 1px -1px var(--accent), -1px 1px var(--primary); }
}

@keyframes dvmGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}`;
}

// ============================================
// HELPER: Box Shadow Generation
// ============================================

function generateBoxShadow(s: DynamicStyleOptions, _element: string): string {
  const style = s.shadowStyle || "soft";
  const mult = SHADOW_INTENSITY_MAP[s.shadowIntensity!];
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];

  switch (style) {
    case "none":
      return "box-shadow: none !important;";
    case "soft":
      return `box-shadow: 0 ${Math.round(4 * mult)}px ${Math.round(20 * mult)}px rgba(0,0,0,0.15) !important;`;
    case "hard":
      return `box-shadow: 0 ${Math.round(4 * mult)}px 0 var(--foreground) !important;`;
    case "offset":
      return `box-shadow: ${Math.round(4 * mult)}px ${Math.round(4 * mult)}px 0 var(--foreground) !important;`;
    case "glow":
      return `box-shadow: 0 0 ${Math.round(15 * mult)}px color-mix(in srgb, var(--primary) ${Math.round(30 * mult)}%, transparent) !important;`;
    case "neon":
      const neonMult = Math.max(glow, 0.5) * mult;
      return `box-shadow: 0 0 ${Math.round(10 * neonMult)}px var(--primary), 0 0 ${Math.round(20 * neonMult)}px color-mix(in srgb, var(--primary) 50%, transparent), 0 0 ${Math.round(40 * neonMult)}px color-mix(in srgb, var(--accent) 30%, transparent) !important;`;
    default:
      return "box-shadow: none !important;";
  }
}

function generateBoxShadowHover(s: DynamicStyleOptions, _element: string): string {
  const style = s.shadowStyle || "soft";
  const mult = SHADOW_INTENSITY_MAP[s.shadowIntensity!] * 1.5;
  const glow = GLOW_INTENSITY_MAP[s.glowIntensity!];

  switch (style) {
    case "none":
      return "";
    case "soft":
      return `box-shadow: 0 ${Math.round(6 * mult)}px ${Math.round(30 * mult)}px rgba(0,0,0,0.2) !important;`;
    case "hard":
      return `box-shadow: 0 ${Math.round(6 * mult)}px 0 var(--foreground) !important;`;
    case "offset":
      return `box-shadow: ${Math.round(6 * mult)}px ${Math.round(6 * mult)}px 0 var(--foreground) !important;`;
    case "glow":
      return `box-shadow: 0 0 ${Math.round(25 * mult)}px color-mix(in srgb, var(--primary) ${Math.round(50 * mult)}%, transparent) !important;`;
    case "neon":
      const neonMult = Math.max(glow, 0.5) * mult;
      return `box-shadow: 0 0 ${Math.round(20 * neonMult)}px var(--primary), 0 0 ${Math.round(40 * neonMult)}px var(--primary), 0 0 ${Math.round(60 * neonMult)}px var(--accent) !important;`;
    default:
      return "";
  }
}
