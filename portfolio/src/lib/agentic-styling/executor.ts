/**
 * Agentic Command Executor
 * Executes agentic styling commands and returns results
 */

import type {
  AgenticCommand,
  CommandResult,
  AppliedStyle,
} from "./types";
import type { ElementCategory } from "../element-registry/types";
import { getElementInfo, getCurrentCSSVariables } from "../element-registry/introspect";
import { buildElementList } from "../element-registry/registry";
import {
  applyElementCSS,
  applyElementStateCSS,
  setCSSVariables,
  injectRawCSS,
  setAgenticModeName,
} from "./css-injection";
import { applyElementAnimation } from "./animation-injection";

/**
 * Execute a single agentic command and return the result
 */
export function executeAgenticCommand(cmd: AgenticCommand): CommandResult {
  switch (cmd.type) {
    case "request_element_info": {
      const info = getElementInfo(cmd.selector);
      return {
        type: "element_info",
        info,
      };
    }

    case "list_elements": {
      const list = buildElementList(cmd.category as ElementCategory | undefined);
      return {
        type: "element_list",
        list,
      };
    }

    case "set_css_variables": {
      const result = setCSSVariables(cmd.variables);
      return {
        type: "variables_set",
        variables: cmd.variables,
        success: result.success,
        error: result.error,
      };
    }

    case "apply_element_style": {
      const result = applyElementCSS(cmd.selector, cmd.css, cmd.scope);
      return {
        type: "style_applied",
        selector: cmd.selector,
        success: result.success,
        error: result.error,
      };
    }

    case "apply_element_state_style": {
      const result = applyElementStateCSS(cmd.selector, cmd.states);
      return {
        type: "style_applied",
        selector: cmd.selector,
        success: result.success,
        error: result.error,
      };
    }

    case "apply_element_animation": {
      const result = applyElementAnimation(
        cmd.selector,
        cmd.js,
        cmd.trigger || "immediate"
      );
      return {
        type: "animation_applied",
        selector: cmd.selector,
        success: result.success,
        error: result.error,
      };
    }

    case "inject_raw_css": {
      const result = injectRawCSS(cmd.id, cmd.css);
      return {
        type: "raw_css_injected",
        id: cmd.id,
        success: result.success,
        error: result.error,
      };
    }

    case "continue_styling": {
      return {
        type: "continue",
        thinking: cmd.thinking,
      };
    }

    case "finish_styling": {
      setAgenticModeName(cmd.name);
      return {
        type: "finished",
        name: cmd.name,
        message: cmd.message,
      };
    }

    default:
      return {
        type: "error",
        message: `Unknown command type: ${(cmd as { type: string }).type}`,
      };
  }
}

/**
 * Execute multiple commands and collect results
 */
export function executeAgenticCommands(
  commands: AgenticCommand[]
): CommandResult[] {
  return commands.map(executeAgenticCommand);
}

/**
 * Format command results as a message for the AI
 * This will be sent back to the AI in the next iteration
 */
export function formatResultsForAI(results: CommandResult[]): string {
  if (results.length === 0) {
    return "No commands executed.";
  }

  const parts: string[] = [];

  for (const result of results) {
    switch (result.type) {
      case "element_info": {
        if (result.info.found) {
          parts.push(
            `## Element: ${result.info.selector}\n` +
              `- Found: ${result.info.count} element(s)\n` +
              `- Tag: ${result.info.tagName}\n` +
              `- Classes: ${result.info.classList.slice(0, 10).join(", ") || "none"}\n` +
              `- Size: ${result.info.boundingBox.width}x${result.info.boundingBox.height}px\n` +
              `- Current styles:\n${formatStyles(result.info.currentStyles)}`
          );
        } else {
          parts.push(
            `## Element: ${result.info.selector}\n- **Not found** (0 elements match this selector)`
          );
        }
        break;
      }

      case "element_list": {
        const categories = result.list.categories;
        let listStr = "## Available Elements\n";
        for (const cat of categories) {
          listStr += `\n### ${cat.name}\n`;
          for (const el of cat.elements) {
            listStr += `- \`${el.selector}\` - ${el.name}: ${el.description}\n`;
          }
        }
        parts.push(listStr);
        break;
      }

      case "style_applied": {
        if (result.success) {
          parts.push(`✓ Style applied to \`${result.selector}\``);
        } else {
          parts.push(`✗ Failed to apply style to \`${result.selector}\`: ${result.error}`);
        }
        break;
      }

      case "animation_applied": {
        if (result.success) {
          parts.push(`✓ Animation applied to \`${result.selector}\``);
        } else {
          parts.push(`✗ Failed to apply animation to \`${result.selector}\`: ${result.error}`);
        }
        break;
      }

      case "variables_set": {
        if (result.success) {
          parts.push(`✓ Set ${Object.keys(result.variables).length} CSS variables`);
        } else {
          parts.push(`✗ Failed to set CSS variables: ${result.error}`);
        }
        break;
      }

      case "raw_css_injected": {
        if (result.success) {
          parts.push(`✓ Injected raw CSS block: ${result.id}`);
        } else {
          parts.push(`✗ Failed to inject CSS: ${result.error}`);
        }
        break;
      }

      case "finished": {
        parts.push(`✓ Styling complete: "${result.name}"`);
        break;
      }

      case "continue": {
        // No message needed
        break;
      }

      case "error": {
        parts.push(`✗ Error: ${result.message}`);
        break;
      }
    }
  }

  // Add current CSS variables for context
  const currentVars = getCurrentCSSVariables();
  if (Object.keys(currentVars).length > 0) {
    parts.push(
      "\n## Current CSS Variables\n" +
        Object.entries(currentVars)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join("\n")
    );
  }

  return parts.join("\n\n");
}

/**
 * Format styles object for display
 */
function formatStyles(styles: Record<string, string>): string {
  const entries = Object.entries(styles);
  if (entries.length === 0) return "  (none)";

  return entries
    .slice(0, 15) // Limit to 15 most important
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join("\n");
}

/**
 * Track applied styles for state management
 */
export function createAppliedStyleEntry(
  selector: string,
  css: string
): AppliedStyle {
  return {
    selector,
    css,
    timestamp: Date.now(),
  };
}

/**
 * Check if results indicate the styling session should continue
 */
export function shouldContinueStyling(results: CommandResult[]): boolean {
  // Check for explicit continue command
  const hasContinue = results.some((r) => r.type === "continue");
  // Check for finish command
  const hasFinish = results.some((r) => r.type === "finished");
  // Check for inspection commands that need followup
  const hasInspection = results.some(
    (r) => r.type === "element_info" || r.type === "element_list"
  );

  // Continue if explicitly requested, or if there were inspection commands
  // (AI needs to see the results and decide what to style)
  return (hasContinue || hasInspection) && !hasFinish;
}

/**
 * Check if results indicate completion
 */
export function isFinished(results: CommandResult[]): boolean {
  return results.some((r) => r.type === "finished");
}

/**
 * Get the visual mode name from results if finished
 */
export function getFinishedModeName(results: CommandResult[]): string | null {
  const finishResult = results.find((r) => r.type === "finished");
  if (finishResult && finishResult.type === "finished") {
    return finishResult.name;
  }
  return null;
}
