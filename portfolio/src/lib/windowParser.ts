import type { Command } from "./commands/types";
import { validateCommand } from "./commands/validator";

export type ParseResult = {
  originalContent: string;
  displayContent: string;
  commands: Command[];
  errors: string[];
};

const MAX_HTML_SIZE = 50000; // 50KB
const MAX_WINDOWS = 10;

export function validateWindowCommand(cmd: any): { valid: boolean; error?: string } {
  if (!cmd || typeof cmd !== 'object') return { valid: false, error: 'Objet invalide' };
  if (!cmd.title || typeof cmd.title !== 'string') return { valid: false, error: 'Titre manquant' };
  if (!cmd.contentHtml || typeof cmd.contentHtml !== 'string') return { valid: false, error: 'HTML manquant' };
  if (cmd.contentHtml.length > MAX_HTML_SIZE) return { valid: false, error: `HTML trop large (max ${MAX_HTML_SIZE/1000}KB)` };
  if (cmd.width !== undefined && (typeof cmd.width !== 'number' || cmd.width < 100 || cmd.width > 2000)) {
    return { valid: false, error: 'Largeur invalide (100-2000px)' };
  }
  if (cmd.height !== undefined && (typeof cmd.height !== 'number' || cmd.height < 100 || cmd.height > 1500)) {
    return { valid: false, error: 'Hauteur invalide (100-1500px)' };
  }
  return { valid: true };
}

function getCommandDisplayText(cmd: Command): string {
  switch (cmd.type) {
    case "create_window":
      return `✨ Fenêtre créée: "${cmd.window.title}"`;
    case "change_theme":
      return `🎨 Thème changé: ${cmd.theme}`;
    case "change_background":
      return `🖼️ Background modifié`;
    case "show_toast":
      return `💬 ${cmd.message}`;
    case "close_window":
      return `❌ Fenêtre fermée: ${cmd.key}`;
    case "modify_window":
      return `🔧 Fenêtre modifiée: ${cmd.key}`;
    case "set_ui":
      return `⚙️ Interface mise à jour`;
    default:
      return `✓ Commande exécutée`;
  }
}

export function parseWindowCommands(content: string, currentWindowCount = 0): ParseResult {
  const commands: Command[] = [];
  const errors: string[] = [];
  let displayContent = content;

  // More permissive regex: accepts \r\n and various whitespace
  const jsonBlockRegex = /```json[\s\r\n]+([\s\S]*?)[\s\r\n]+```/g;
  const matches = [...content.matchAll(jsonBlockRegex)];

  matches.forEach((match, index) => {
    try {
      const parsed = JSON.parse(match[1]);

      // Validate command structure
      const validation = validateCommand(parsed);
      if (!validation.valid) {
        errors.push(`Commande ${index + 1}: ${validation.error}`);
        displayContent = displayContent.replace(match[0], `_❌ ${validation.error}_`);
        return;
      }

      // Additional validation for create_window
      if (parsed.type === "create_window") {
        if (currentWindowCount + commands.filter(c => c.type === "create_window").length >= MAX_WINDOWS) {
          errors.push(`Limite de ${MAX_WINDOWS} fenêtres atteinte`);
          displayContent = displayContent.replace(match[0], `_❌ Limite de fenêtres atteinte_`);
          return;
        }
        const windowValidation = validateWindowCommand(parsed.window);
        if (!windowValidation.valid) {
          errors.push(`Fenêtre ${index + 1}: ${windowValidation.error}`);
          displayContent = displayContent.replace(match[0], `_❌ ${windowValidation.error}_`);
          return;
        }
      }

      // Command is valid, add it
      commands.push(parsed as Command);
      displayContent = displayContent.replace(match[0], `_${getCommandDisplayText(parsed as Command)}_`);
    } catch (e) {
      errors.push(`JSON invalide (commande ${index + 1})`);
    }
  });

  return { originalContent: content, displayContent, commands, errors };
}

export function replaceWindowCommandsInText(content: string): string {
  return parseWindowCommands(content, 0).displayContent;
}
