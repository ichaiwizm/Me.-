import type { DynamicStyleOptions } from "@/lib/commands/types";

const FONT_MAP: Record<NonNullable<DynamicStyleOptions["fontFamily"]>, string> = {
  sans: "system-ui, -apple-system, sans-serif",
  serif: "'Playfair Display', 'EB Garamond', Georgia, serif",
  mono: "'Fira Code', 'Space Mono', monospace",
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
};

const BORDER_RADIUS_MAP: Record<NonNullable<DynamicStyleOptions["borderRadius"]>, string> = {
  none: "0",
  small: "4px",
  medium: "8px",
  large: "16px",
};

const BORDER_WIDTH_MAP: Record<NonNullable<DynamicStyleOptions["borderWidth"]>, string> = {
  none: "0",
  thin: "1px",
  medium: "2px",
  thick: "4px",
};

const TRANSITION_SPEED_MAP: Record<NonNullable<DynamicStyleOptions["transitionSpeed"]>, string> = {
  instant: "0.05s",
  fast: "0.15s",
  normal: "0.3s",
  slow: "0.5s",
};

export function generateDynamicCSS(styles: DynamicStyleOptions): string {
  const s = styles;
  const lines: string[] = [];

  // Base selector with CSS custom properties
  lines.push(`html.dynamic-visual-mode-active {`);
  if (s.fontFamily) lines.push(`  --dvm-font: ${FONT_MAP[s.fontFamily]};`);
  if (s.fontWeight) lines.push(`  --dvm-font-weight: ${FONT_WEIGHT_MAP[s.fontWeight]};`);
  if (s.letterSpacing) lines.push(`  --dvm-letter-spacing: ${LETTER_SPACING_MAP[s.letterSpacing]};`);
  if (s.borderRadius) lines.push(`  --dvm-border-radius: ${BORDER_RADIUS_MAP[s.borderRadius]};`);
  if (s.borderWidth) lines.push(`  --dvm-border-width: ${BORDER_WIDTH_MAP[s.borderWidth]};`);
  if (s.transitionSpeed) lines.push(`  --dvm-transition: ${TRANSITION_SPEED_MAP[s.transitionSpeed]};`);
  lines.push(`}`);
  lines.push(``);

  // Global typography and transitions
  lines.push(`html.dynamic-visual-mode-active * {`);
  if (s.fontFamily) lines.push(`  font-family: var(--dvm-font) !important;`);
  if (s.transitionSpeed) {
    lines.push(`  transition-duration: var(--dvm-transition) !important;`);
    if (s.transitionStyle === "steps") {
      lines.push(`  transition-timing-function: steps(3) !important;`);
    }
  }
  lines.push(`}`);
  lines.push(``);

  // Headings
  lines.push(`html.dynamic-visual-mode-active h1,`);
  lines.push(`html.dynamic-visual-mode-active h2,`);
  lines.push(`html.dynamic-visual-mode-active h3 {`);
  if (s.fontWeight) lines.push(`  font-weight: var(--dvm-font-weight) !important;`);
  if (s.textTransform === "uppercase") lines.push(`  text-transform: uppercase !important;`);
  if (s.letterSpacing) lines.push(`  letter-spacing: var(--dvm-letter-spacing) !important;`);

  // Text shadow
  if (s.textShadow === "glow") {
    lines.push(`  text-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary), 0 0 40px var(--accent) !important;`);
  } else if (s.textShadow === "multi-glow") {
    lines.push(`  text-shadow: 0 0 5px var(--primary), 0 0 10px var(--primary), 0 0 20px var(--primary), 0 0 40px var(--accent) !important;`);
  } else if (s.textShadow === "soft") {
    lines.push(`  text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;`);
  }
  lines.push(`}`);
  lines.push(``);

  // Pseudo-elements for headings
  if (s.headingPrefix) {
    lines.push(`html.dynamic-visual-mode-active h1::before { content: '${s.headingPrefix}' !important; }`);
  }
  if (s.headingSuffix) {
    lines.push(`html.dynamic-visual-mode-active h1::after {`);
    lines.push(`  content: '${s.headingSuffix}' !important;`);
    if (s.headingSuffix === "_") {
      lines.push(`  animation: dvmCursorBlink 1s infinite step-end !important;`);
    }
    lines.push(`}`);
  }
  lines.push(``);

  // Cards, buttons, glass, inputs
  lines.push(`html.dynamic-visual-mode-active .card,`);
  lines.push(`html.dynamic-visual-mode-active button,`);
  lines.push(`html.dynamic-visual-mode-active .glass,`);
  lines.push(`html.dynamic-visual-mode-active input,`);
  lines.push(`html.dynamic-visual-mode-active textarea {`);
  if (s.borderRadius) lines.push(`  border-radius: var(--dvm-border-radius) !important;`);
  if (s.borderWidth && s.borderWidth !== "none") {
    lines.push(`  border: var(--dvm-border-width) solid var(--border) !important;`);
  }

  // Box shadow
  if (s.boxShadow === "offset") {
    lines.push(`  box-shadow: 4px 4px 0 var(--foreground) !important;`);
  } else if (s.boxShadow === "glow") {
    lines.push(`  box-shadow: 0 0 10px var(--primary), 0 0 20px color-mix(in srgb, var(--primary) 50%, transparent) !important;`);
  } else if (s.boxShadow === "hard") {
    lines.push(`  box-shadow: 0 4px 0 var(--foreground) !important;`);
  } else if (s.boxShadow === "soft") {
    lines.push(`  box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;`);
  } else if (s.boxShadow === "none") {
    lines.push(`  box-shadow: none !important;`);
  }

  // Disable glassmorphism for brutal styles
  if (s.boxShadow === "offset" || s.boxShadow === "hard") {
    lines.push(`  backdrop-filter: none !important;`);
  }
  lines.push(`}`);
  lines.push(``);

  // Button hover effects based on shadow type
  if (s.boxShadow === "offset") {
    lines.push(`html.dynamic-visual-mode-active button:hover {`);
    lines.push(`  transform: translate(-2px, -2px) !important;`);
    lines.push(`  box-shadow: 6px 6px 0 var(--foreground) !important;`);
    lines.push(`}`);
    lines.push(`html.dynamic-visual-mode-active button:active {`);
    lines.push(`  transform: translate(2px, 2px) !important;`);
    lines.push(`  box-shadow: 2px 2px 0 var(--foreground) !important;`);
    lines.push(`}`);
  } else if (s.boxShadow === "glow") {
    lines.push(`html.dynamic-visual-mode-active button:hover {`);
    lines.push(`  box-shadow: 0 0 20px var(--primary), 0 0 40px var(--accent) !important;`);
    lines.push(`}`);
  }
  lines.push(``);

  // Button wrappers (terminal style)
  if (s.buttonWrapper && s.buttonWrapper !== "none") {
    const closeChar = s.buttonWrapper === "[" ? "]" : s.buttonWrapper === "{" ? "}" : ">";
    lines.push(`html.dynamic-visual-mode-active button::before { content: '${s.buttonWrapper}' !important; margin-right: 4px; }`);
    lines.push(`html.dynamic-visual-mode-active button::after { content: '${closeChar}' !important; margin-left: 4px; }`);
  }
  lines.push(``);

  // Effect: Scanlines (CRT effect)
  if (s.scanlines) {
    lines.push(`html.dynamic-visual-mode-active::after {`);
    lines.push(`  content: '' !important;`);
    lines.push(`  position: fixed !important;`);
    lines.push(`  inset: 0 !important;`);
    lines.push(`  pointer-events: none !important;`);
    lines.push(`  background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px) !important;`);
    lines.push(`  z-index: 99999 !important;`);
    lines.push(`}`);
  }

  // Effect: Noise texture
  if (s.noise) {
    lines.push(`html.dynamic-visual-mode-active::before {`);
    lines.push(`  content: '' !important;`);
    lines.push(`  position: fixed !important;`);
    lines.push(`  inset: 0 !important;`);
    lines.push(`  pointer-events: none !important;`);
    lines.push(`  opacity: 0.03 !important;`);
    lines.push(`  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E") !important;`);
    lines.push(`  z-index: 99998 !important;`);
    lines.push(`}`);
  }

  // Effect: RGB Split animation
  if (s.rgbSplit) {
    lines.push(`html.dynamic-visual-mode-active h1 {`);
    lines.push(`  animation: dvmRgbSplit 4s infinite !important;`);
    lines.push(`}`);
    lines.push(`@keyframes dvmRgbSplit {`);
    lines.push(`  0%, 100% { text-shadow: -2px 0 var(--accent), 2px 0 var(--primary); }`);
    lines.push(`  25% { text-shadow: 2px 0 var(--accent), -2px 0 var(--primary); }`);
    lines.push(`  50% { text-shadow: -1px 2px var(--accent), 1px -2px var(--primary); }`);
    lines.push(`  75% { text-shadow: 1px -1px var(--accent), -1px 1px var(--primary); }`);
    lines.push(`}`);
  }

  // Effect: CRT curvature
  if (s.crt) {
    lines.push(`html.dynamic-visual-mode-active {`);
    lines.push(`  filter: brightness(1.1) contrast(1.1) !important;`);
    lines.push(`}`);
    lines.push(`html.dynamic-visual-mode-active body {`);
    lines.push(`  overflow: hidden !important;`);
    lines.push(`}`);
  }

  // Keyframes for cursor blink
  lines.push(`@keyframes dvmCursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`);

  return lines.join("\n");
}
