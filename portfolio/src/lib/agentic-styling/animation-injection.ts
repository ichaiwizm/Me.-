/**
 * Animation Injection System
 * Safe execution of JS animations for agentic styling
 */

// Store cleanup functions for animations
const animationCleanups = new Map<string, () => void>();

// Blocked JS patterns for security
const BLOCKED_JS_PATTERNS = [
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /document\.(write|writeln|cookie|domain)/gi,
  /window\.(location|open|close|alert|confirm|prompt)/gi,
  /localStorage|sessionStorage/gi,
  /fetch\s*\(/gi,
  /XMLHttpRequest/gi,
  /import\s*\(/gi,
  /require\s*\(/gi,
  /<script/gi,
  /javascript:/gi,
  /\.innerHTML\s*=/gi,
  /\.outerHTML\s*=/gi,
  /document\.createElement\s*\(\s*['"]script/gi,
];

// Max JS code size
const MAX_JS_SIZE = 5000;

export type AnimationTrigger = "immediate" | "hover" | "click" | "scroll";

/**
 * Apply JS animation to elements matching selector
 */
export function applyElementAnimation(
  selector: string,
  jsCode: string,
  trigger: AnimationTrigger = "immediate"
): { success: boolean; error?: string } {
  // Validate JS code
  const validation = validateJS(jsCode);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Find matching elements
  let elements: NodeListOf<Element>;
  try {
    elements = document.querySelectorAll(selector);
  } catch {
    return { success: false, error: `Invalid selector: ${selector}` };
  }

  if (elements.length === 0) {
    return { success: false, error: `No elements match selector: ${selector}` };
  }

  // Clean up previous animation for this selector
  const existingCleanup = animationCleanups.get(selector);
  if (existingCleanup) {
    existingCleanup();
  }

  // Create the animation function in a sandboxed context
  const animationFn = createSandboxedAnimation(jsCode);
  if (!animationFn) {
    return { success: false, error: "Failed to create animation function" };
  }

  // Track cleanup functions
  const cleanups: Array<() => void> = [];

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;

    switch (trigger) {
      case "immediate": {
        try {
          const cleanup = animationFn(htmlEl);
          if (typeof cleanup === "function") {
            cleanups.push(cleanup);
          }
        } catch (err) {
          console.error("[AgenticAnimation] Immediate animation error:", err);
        }
        break;
      }

      case "hover": {
        const onEnter = () => {
          try {
            animationFn(htmlEl);
          } catch (err) {
            console.error("[AgenticAnimation] Hover animation error:", err);
          }
        };
        htmlEl.addEventListener("mouseenter", onEnter);
        cleanups.push(() => htmlEl.removeEventListener("mouseenter", onEnter));
        break;
      }

      case "click": {
        const onClick = () => {
          try {
            animationFn(htmlEl);
          } catch (err) {
            console.error("[AgenticAnimation] Click animation error:", err);
          }
        };
        htmlEl.addEventListener("click", onClick);
        cleanups.push(() => htmlEl.removeEventListener("click", onClick));
        break;
      }

      case "scroll": {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                try {
                  animationFn(htmlEl);
                } catch (err) {
                  console.error("[AgenticAnimation] Scroll animation error:", err);
                }
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(htmlEl);
        cleanups.push(() => observer.disconnect());
        break;
      }
    }
  });

  // Store combined cleanup function
  animationCleanups.set(selector, () => {
    cleanups.forEach((fn) => fn());
  });

  return { success: true };
}

/**
 * Remove animation from a selector
 */
export function removeElementAnimation(selector: string): void {
  const cleanup = animationCleanups.get(selector);
  if (cleanup) {
    cleanup();
    animationCleanups.delete(selector);
  }
}

/**
 * Clear all animations
 */
export function clearAllAnimations(): void {
  for (const cleanup of animationCleanups.values()) {
    cleanup();
  }
  animationCleanups.clear();
}

/**
 * Get count of active animations
 */
export function getActiveAnimationCount(): number {
  return animationCleanups.size;
}

// ============================================
// Sandboxed execution
// ============================================

type AnimationFunction = (element: HTMLElement) => (() => void) | void;

/**
 * Create a sandboxed animation function
 * Provides limited APIs for safe animation execution
 */
function createSandboxedAnimation(code: string): AnimationFunction | null {
  try {
    // Create a safe context with limited APIs
    const safeContext = {
      // Timing
      requestAnimationFrame: window.requestAnimationFrame.bind(window),
      cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
      setTimeout: window.setTimeout.bind(window),
      clearTimeout: window.clearTimeout.bind(window),
      setInterval: window.setInterval.bind(window),
      clearInterval: window.clearInterval.bind(window),

      // Math utilities
      Math,
      Date,
      parseFloat,
      parseInt,
      Number,
      isNaN,
      isFinite,

      // Console (for debugging)
      console: {
        log: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      },
    };

    // Helper functions available to animations
    const helpers = `
      function animate(keyframes, options) {
        return element.animate(keyframes, options);
      }

      function setStyle(prop, value) {
        element.style.setProperty(prop, value);
      }

      function getStyle(prop) {
        return window.getComputedStyle(element).getPropertyValue(prop);
      }

      function addClass(className) {
        element.classList.add(className);
      }

      function removeClass(className) {
        element.classList.remove(className);
      }

      function toggleClass(className) {
        element.classList.toggle(className);
      }

      function getBoundingRect() {
        return element.getBoundingClientRect();
      }
    `;

    // Build the function with safe context
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(
      "element",
      ...Object.keys(safeContext),
      `
      "use strict";
      ${helpers}
      ${code}
      `
    ) as (element: HTMLElement, ...args: unknown[]) => (() => void) | void;

    // Return a wrapper that provides the context
    return (element: HTMLElement) => {
      return fn(element, ...Object.values(safeContext));
    };
  } catch (err) {
    console.error("[AgenticAnimation] Failed to create animation:", err);
    return null;
  }
}

/**
 * Validate JS code for security
 */
function validateJS(code: string): { valid: boolean; error?: string } {
  // Check size limit
  if (code.length > MAX_JS_SIZE) {
    return {
      valid: false,
      error: `JS code exceeds size limit (${code.length} > ${MAX_JS_SIZE} bytes)`,
    };
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_JS_PATTERNS) {
    if (pattern.test(code)) {
      return {
        valid: false,
        error: `Blocked JS pattern detected: ${pattern.source}`,
      };
    }
  }

  return { valid: true };
}
