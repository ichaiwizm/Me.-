/**
 * Agentic Styling Types
 * Types for the agentic visual mode system
 */

import type { ElementCategory, ElementInfo, ElementListResponse } from "../element-registry/types";
import type { AnimationTrigger } from "./animation-injection";

// ============================================
// Agent Commands (sent by AI)
// ============================================

/**
 * Request info about a specific element
 */
export type RequestElementInfoCommand = {
  type: "request_element_info";
  selector: string;
};

/**
 * Request list of all styleable elements
 */
export type ListElementsCommand = {
  type: "list_elements";
  category?: ElementCategory;
};

/**
 * Set CSS custom properties (color palette)
 */
export type SetCSSVariablesCommand = {
  type: "set_css_variables";
  variables: Record<string, string>;
};

/**
 * Apply CSS to specific elements
 */
export type ApplyElementStyleCommand = {
  type: "apply_element_style";
  selector: string;
  css: string;
  scope?: "self" | "children" | "both";
};

/**
 * Apply CSS with multiple states (hover, focus, active)
 */
export type ApplyElementStateStyleCommand = {
  type: "apply_element_state_style";
  selector: string;
  states: {
    default?: string;
    hover?: string;
    focus?: string;
    active?: string;
  };
};

/**
 * Apply JS animation to elements
 */
export type ApplyElementAnimationCommand = {
  type: "apply_element_animation";
  selector: string;
  js: string;
  trigger?: AnimationTrigger;
};

/**
 * Inject raw CSS (keyframes, complex selectors)
 */
export type InjectRawCSSCommand = {
  type: "inject_raw_css";
  id: string;
  css: string;
};

/**
 * AI signals it wants to continue styling
 */
export type ContinueStylingCommand = {
  type: "continue_styling";
  thinking?: string;
};

/**
 * AI signals completion
 */
export type FinishStylingCommand = {
  type: "finish_styling";
  name: string;
  message?: string;
};

/**
 * Union of all agentic commands
 */
export type AgenticCommand =
  | RequestElementInfoCommand
  | ListElementsCommand
  | SetCSSVariablesCommand
  | ApplyElementStyleCommand
  | ApplyElementStateStyleCommand
  | ApplyElementAnimationCommand
  | InjectRawCSSCommand
  | ContinueStylingCommand
  | FinishStylingCommand;

/**
 * All agentic command types
 */
export type AgenticCommandType = AgenticCommand["type"];

// ============================================
// Command Results (system responses)
// ============================================

export type ElementInfoResult = {
  type: "element_info";
  info: ElementInfo;
};

export type ElementListResult = {
  type: "element_list";
  list: ElementListResponse;
};

export type StyleAppliedResult = {
  type: "style_applied";
  selector: string;
  success: boolean;
  error?: string;
};

export type AnimationAppliedResult = {
  type: "animation_applied";
  selector: string;
  success: boolean;
  error?: string;
};

export type VariablesSetResult = {
  type: "variables_set";
  variables: Record<string, string>;
  success: boolean;
  error?: string;
};

export type RawCSSInjectedResult = {
  type: "raw_css_injected";
  id: string;
  success: boolean;
  error?: string;
};

export type FinishedResult = {
  type: "finished";
  name: string;
  message?: string;
};

export type ContinueResult = {
  type: "continue";
  thinking?: string;
};

export type ErrorResult = {
  type: "error";
  message: string;
};

export type CommandResult =
  | ElementInfoResult
  | ElementListResult
  | StyleAppliedResult
  | AnimationAppliedResult
  | VariablesSetResult
  | RawCSSInjectedResult
  | FinishedResult
  | ContinueResult
  | ErrorResult;

// ============================================
// Agent Loop State
// ============================================

export type AgentLoopStatus =
  | "idle"
  | "running"
  | "waiting_for_ai"
  | "processing_commands"
  | "completed"
  | "error"
  | "cancelled";

export type AgentMessage = {
  role: "system" | "user" | "assistant" | "tool_result";
  content: string;
};

export type AppliedStyle = {
  selector: string;
  css: string;
  timestamp: number;
};

export type AgentLoopState = {
  status: AgentLoopStatus;
  iteration: number;
  maxIterations: number;
  conversationHistory: AgentMessage[];
  appliedStyles: AppliedStyle[];
  appliedAnimations: string[];
  cssVariables: Record<string, string>;
  visualModeName?: string;
  error?: string;
  lastCommandResults: CommandResult[];
};

// ============================================
// Configuration
// ============================================

export type AgenticStylingConfig = {
  maxIterations: number;
  iterationTimeout: number;
  maxCSSSize: number;
  maxJSSize: number;
  enableAnimations: boolean;
  debugMode: boolean;
};

export const DEFAULT_CONFIG: AgenticStylingConfig = {
  maxIterations: 10,
  iterationTimeout: 30000,
  maxCSSSize: 50000,
  maxJSSize: 5000,
  enableAnimations: true,
  debugMode: false,
};
