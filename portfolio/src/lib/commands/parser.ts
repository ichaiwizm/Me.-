import type { Command } from "./types";
import { validateCommand } from "./validator";
import {
  MAX_HTML_SIZE,
  MAX_WINDOWS,
  MIN_WIDTH,
  MAX_WIDTH,
  MIN_HEIGHT,
  MAX_HEIGHT
} from "@/lib/constants/windows";

export type ParseResult = {
  originalContent: string;
  displayContent: string;
  commands: Command[];
  errors: string[];
};

export function validateWindowCommand(cmd: any): { valid: boolean; error?: string } {
  if (!cmd || typeof cmd !== 'object') return { valid: false, error: "Fenêtre manquante (clé 'window')." };
  if (!cmd.title || typeof cmd.title !== 'string') return { valid: false, error: 'Titre manquant' };
  if (!cmd.contentHtml || typeof cmd.contentHtml !== 'string') return { valid: false, error: 'HTML manquant' };
  if (cmd.contentHtml.length > MAX_HTML_SIZE) return { valid: false, error: `HTML trop large (max ${MAX_HTML_SIZE/1000}KB)` };
  if (cmd.width !== undefined && (typeof cmd.width !== 'number' || cmd.width < MIN_WIDTH || cmd.width > MAX_WIDTH)) {
    return { valid: false, error: `Largeur invalide (${MIN_WIDTH}-${MAX_WIDTH}px)` };
  }
  if (cmd.height !== undefined && (typeof cmd.height !== 'number' || cmd.height < MIN_HEIGHT || cmd.height > MAX_HEIGHT)) {
    return { valid: false, error: `Hauteur invalide (${MIN_HEIGHT}-${MAX_HEIGHT}px)` };
  }
  return { valid: true };
}

// Returns a marker that ChatPreview can parse: [[CMD:type:detail]]
function getCommandMarker(cmd: Command): string {
  switch (cmd.type) {
    case "create_window":
      return `[[CMD:create_window:${cmd.window.title}]]`;
    case "resize_window":
      return `[[CMD:resize_window:${cmd.key}]]`;
    case "change_theme":
      return `[[CMD:change_theme:${cmd.theme}]]`;
    case "change_background":
      return `[[CMD:change_background:]]`;
    case "show_toast":
      // Toast messages should be hidden from chat - the toast itself shows
      return "";
    case "close_window":
      return `[[CMD:close_window:${cmd.key}]]`;
    case "modify_window":
      return `[[CMD:modify_window:${cmd.key}]]`;
    case "display_image":
      return `[[CMD:display_image:${cmd.title || cmd.imageId || "image"}]]`;
    case "display_gallery":
      return `[[CMD:display_gallery:${cmd.title || "Galerie"}]]`;
    case "set_ui":
      return ""; // UI changes are silent
    case "navigate":
      return `[[CMD:navigate:${cmd.page}]]`;
    default:
      return "";
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

      // Normalize create_window shape: allow top-level title/contentHtml
      if (parsed && parsed.type === "create_window" && !parsed.window) {
        const maybeTitle = (parsed as any).title;
        const maybeHtml = (parsed as any).contentHtml;
        const maybeWidth = (parsed as any).width;
        const maybeHeight = (parsed as any).height;
        const maybeKey = (parsed as any).key;
        if (typeof maybeTitle === "string" && typeof maybeHtml === "string") {
          (parsed as any).window = {
            title: maybeTitle,
            contentHtml: maybeHtml,
            width: typeof maybeWidth === "number" ? maybeWidth : undefined,
            height: typeof maybeHeight === "number" ? maybeHeight : undefined,
            key: typeof maybeKey === "string" ? maybeKey : undefined,
          };
          delete (parsed as any).title;
          delete (parsed as any).contentHtml;
          delete (parsed as any).width;
          delete (parsed as any).height;
          delete (parsed as any).key;
        }
      }

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
          const hint = `Exemple: {\n  \"type\": \"create_window\",\n  \"window\": { \"title\": \"Titre\", \"contentHtml\": \"<div>...</div>\", \"width\": 520, \"height\": 380 }\n}`;
          errors.push(`Fenêtre ${index + 1}: ${windowValidation.error}`);
          displayContent = displayContent.replace(match[0], `_❌ ${windowValidation.error}\n${hint}_`);
          return;
        }
      }

      // Command is valid, add it
      commands.push(parsed as Command);
      const marker = getCommandMarker(parsed as Command);
      displayContent = displayContent.replace(match[0], marker);
    } catch (e) {
      errors.push(`JSON invalide (commande ${index + 1})`);
    }
  });

  return { originalContent: content, displayContent, commands, errors };
}

export function replaceWindowCommandsInText(content: string): string {
  return parseWindowCommands(content, 0).displayContent;
}
