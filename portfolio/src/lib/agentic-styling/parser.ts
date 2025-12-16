/**
 * Agentic Command Parser
 * Parses AI responses for agentic styling commands
 */

import type { AgenticCommand, AgenticCommandType } from "./types";

export type AgenticParseResult = {
  originalContent: string;
  displayContent: string;
  commands: AgenticCommand[];
  errors: string[];
  hasInspectionCommands: boolean;
  hasStylingCommands: boolean;
  isFinished: boolean;
  wantsToContinue: boolean;
};

/**
 * All valid agentic command types
 */
const AGENTIC_COMMAND_TYPES: AgenticCommandType[] = [
  "request_element_info",
  "list_elements",
  "set_css_variables",
  "apply_element_style",
  "apply_element_state_style",
  "apply_element_animation",
  "inject_raw_css",
  "continue_styling",
  "finish_styling",
];

/**
 * Element categories for list_elements validation
 */
const VALID_CATEGORIES = [
  "layout",
  "navigation",
  "ui",
  "chat",
  "windows",
  "typography",
  "media",
  "effects",
];

/**
 * Animation triggers for validation
 */
const VALID_TRIGGERS = ["immediate", "hover", "click", "scroll"];

/**
 * CSS scopes for validation
 */
const VALID_SCOPES = ["self", "children", "both"];

/**
 * Parse agentic commands from AI response
 */
export function parseAgenticCommands(content: string): AgenticParseResult {
  const commands: AgenticCommand[] = [];
  const errors: string[] = [];
  let displayContent = content;

  // Match JSON code blocks
  const jsonBlockRegex = /```json[\s\r\n]+([\s\S]*?)[\s\r\n]+```/g;
  const matches = [...content.matchAll(jsonBlockRegex)];

  let hasInspectionCommands = false;
  let hasStylingCommands = false;
  let isFinished = false;
  let wantsToContinue = false;

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);

      // Check if it's an agentic command
      if (!parsed?.type || !AGENTIC_COMMAND_TYPES.includes(parsed.type)) {
        // Not an agentic command, skip (might be a regular command)
        continue;
      }

      // Validate the command
      const validation = validateAgenticCommand(parsed);
      if (!validation.valid) {
        errors.push(`${parsed.type}: ${validation.error}`);
        displayContent = displayContent.replace(
          match[0],
          `_❌ ${validation.error}_`
        );
        continue;
      }

      // Track command types
      if (parsed.type === "request_element_info" || parsed.type === "list_elements") {
        hasInspectionCommands = true;
      }
      if (
        parsed.type === "set_css_variables" ||
        parsed.type === "apply_element_style" ||
        parsed.type === "apply_element_state_style" ||
        parsed.type === "apply_element_animation" ||
        parsed.type === "inject_raw_css"
      ) {
        hasStylingCommands = true;
      }
      if (parsed.type === "finish_styling") {
        isFinished = true;
      }
      if (parsed.type === "continue_styling") {
        wantsToContinue = true;
      }

      commands.push(parsed as AgenticCommand);

      // Replace with marker for display
      const marker = getAgenticCommandMarker(parsed as AgenticCommand);
      displayContent = displayContent.replace(match[0], marker);
    } catch (e) {
      errors.push(`JSON invalide: ${e}`);
    }
  }

  return {
    originalContent: content,
    displayContent,
    commands,
    errors,
    hasInspectionCommands,
    hasStylingCommands,
    isFinished,
    wantsToContinue,
  };
}

/**
 * Validate an agentic command
 */
export function validateAgenticCommand(
  cmd: unknown
): { valid: boolean; error?: string } {
  if (!cmd || typeof cmd !== "object") {
    return { valid: false, error: "Commande invalide" };
  }

  const command = cmd as Record<string, unknown>;

  if (!command.type || typeof command.type !== "string") {
    return { valid: false, error: "Type de commande manquant" };
  }

  switch (command.type) {
    case "request_element_info": {
      if (!command.selector || typeof command.selector !== "string") {
        return { valid: false, error: "Sélecteur requis" };
      }
      if (command.selector.length > 200) {
        return { valid: false, error: "Sélecteur trop long (max 200 chars)" };
      }
      break;
    }

    case "list_elements": {
      if (
        command.category &&
        (typeof command.category !== "string" ||
          !VALID_CATEGORIES.includes(command.category))
      ) {
        return {
          valid: false,
          error: `Catégorie invalide. Valides: ${VALID_CATEGORIES.join(", ")}`,
        };
      }
      break;
    }

    case "set_css_variables": {
      if (!command.variables || typeof command.variables !== "object") {
        return { valid: false, error: "Variables requises" };
      }
      // Security check on values
      const forbidden = /url\s*\(|@import|expression\s*\(|javascript:|data:/i;
      for (const [key, value] of Object.entries(
        command.variables as Record<string, unknown>
      )) {
        if (typeof value !== "string") {
          return { valid: false, error: `Variable ${key} doit être une chaîne` };
        }
        if (forbidden.test(value)) {
          return { valid: false, error: `Valeur interdite dans ${key}` };
        }
      }
      break;
    }

    case "apply_element_style": {
      if (!command.selector || typeof command.selector !== "string") {
        return { valid: false, error: "Sélecteur requis" };
      }
      if (!command.css || typeof command.css !== "string") {
        return { valid: false, error: "CSS requis" };
      }
      if ((command.css as string).length > 10000) {
        return { valid: false, error: "CSS trop long (max 10KB)" };
      }
      if (
        command.scope &&
        (typeof command.scope !== "string" ||
          !VALID_SCOPES.includes(command.scope))
      ) {
        return {
          valid: false,
          error: `Scope invalide. Valides: ${VALID_SCOPES.join(", ")}`,
        };
      }
      // Security check
      const dangerousCSS = /@import|expression\s*\(|javascript:|behavior\s*:/i;
      if (dangerousCSS.test(command.css as string)) {
        return { valid: false, error: "CSS contient des patterns dangereux" };
      }
      break;
    }

    case "apply_element_state_style": {
      if (!command.selector || typeof command.selector !== "string") {
        return { valid: false, error: "Sélecteur requis" };
      }
      if (!command.states || typeof command.states !== "object") {
        return { valid: false, error: "States requis" };
      }
      const states = command.states as Record<string, unknown>;
      const validStateKeys = ["default", "hover", "focus", "active"];
      for (const [key, value] of Object.entries(states)) {
        if (!validStateKeys.includes(key)) {
          return { valid: false, error: `État invalide: ${key}` };
        }
        if (typeof value !== "string") {
          return { valid: false, error: `CSS pour ${key} doit être une chaîne` };
        }
        if ((value as string).length > 5000) {
          return { valid: false, error: `CSS pour ${key} trop long` };
        }
      }
      break;
    }

    case "apply_element_animation": {
      if (!command.selector || typeof command.selector !== "string") {
        return { valid: false, error: "Sélecteur requis" };
      }
      if (!command.js || typeof command.js !== "string") {
        return { valid: false, error: "JS requis" };
      }
      if ((command.js as string).length > 5000) {
        return { valid: false, error: "JS trop long (max 5KB)" };
      }
      if (
        command.trigger &&
        (typeof command.trigger !== "string" ||
          !VALID_TRIGGERS.includes(command.trigger))
      ) {
        return {
          valid: false,
          error: `Trigger invalide. Valides: ${VALID_TRIGGERS.join(", ")}`,
        };
      }
      break;
    }

    case "inject_raw_css": {
      if (!command.id || typeof command.id !== "string") {
        return { valid: false, error: "ID requis" };
      }
      if (!command.css || typeof command.css !== "string") {
        return { valid: false, error: "CSS requis" };
      }
      if ((command.css as string).length > 20000) {
        return { valid: false, error: "CSS trop long (max 20KB)" };
      }
      const dangerousCSS = /@import|expression\s*\(|javascript:|behavior\s*:/i;
      if (dangerousCSS.test(command.css as string)) {
        return { valid: false, error: "CSS contient des patterns dangereux" };
      }
      break;
    }

    case "continue_styling": {
      if (command.thinking && typeof command.thinking !== "string") {
        return { valid: false, error: "Thinking doit être une chaîne" };
      }
      break;
    }

    case "finish_styling": {
      if (!command.name || typeof command.name !== "string") {
        return { valid: false, error: "Nom requis" };
      }
      if ((command.name as string).length > 100) {
        return { valid: false, error: "Nom trop long (max 100 chars)" };
      }
      if (command.message && typeof command.message !== "string") {
        return { valid: false, error: "Message doit être une chaîne" };
      }
      break;
    }

    default:
      return { valid: false, error: `Type de commande inconnu: ${command.type}` };
  }

  return { valid: true };
}

/**
 * Get display marker for an agentic command
 */
function getAgenticCommandMarker(cmd: AgenticCommand): string {
  switch (cmd.type) {
    case "request_element_info":
      return `[[AGENTIC:inspect:${cmd.selector}]]`;
    case "list_elements":
      return `[[AGENTIC:list:${cmd.category || "all"}]]`;
    case "set_css_variables":
      return `[[AGENTIC:variables:${Object.keys(cmd.variables).length} vars]]`;
    case "apply_element_style":
      return `[[AGENTIC:style:${cmd.selector}]]`;
    case "apply_element_state_style":
      return `[[AGENTIC:states:${cmd.selector}]]`;
    case "apply_element_animation":
      return `[[AGENTIC:animation:${cmd.selector}]]`;
    case "inject_raw_css":
      return `[[AGENTIC:raw_css:${cmd.id}]]`;
    case "continue_styling":
      return "[[AGENTIC:continue]]";
    case "finish_styling":
      return `[[AGENTIC:finish:${cmd.name}]]`;
    default:
      return "";
  }
}

/**
 * Check if a response contains agentic commands
 */
export function hasAgenticCommands(content: string): boolean {
  const jsonBlockRegex = /```json[\s\r\n]+([\s\S]*?)[\s\r\n]+```/g;
  const matches = [...content.matchAll(jsonBlockRegex)];

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed?.type && AGENTIC_COMMAND_TYPES.includes(parsed.type)) {
        return true;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return false;
}
