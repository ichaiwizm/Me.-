/**
 * Agentic Styling Module
 * Provides AI-driven iterative visual styling capabilities
 */

// Types
export * from "./types";

// Parsing
export { parseAgenticCommands, validateAgenticCommand, hasAgenticCommands } from "./parser";
export type { AgenticParseResult } from "./parser";

// Execution
export {
  executeAgenticCommand,
  executeAgenticCommands,
  formatResultsForAI,
  shouldContinueStyling,
  isFinished,
  getFinishedModeName,
} from "./executor";

// CSS Injection
export {
  applyElementCSS,
  applyElementStateCSS,
  setCSSVariables,
  injectRawCSS,
  removeElementCSS,
  clearAgenticStyles,
  getAppliedStyles,
  getTotalCSSSize,
  isApproachingSizeLimit,
  setAgenticModeName,
} from "./css-injection";

// Animation Injection
export {
  applyElementAnimation,
  removeElementAnimation,
  clearAllAnimations,
  getActiveAnimationCount,
} from "./animation-injection";
export type { AnimationTrigger } from "./animation-injection";

// Context & Provider
export { AgenticStylingProvider, useAgenticStyling } from "./context";
