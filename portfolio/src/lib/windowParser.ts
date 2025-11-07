export type WindowCommand = {
  title: string;
  width?: number;
  height?: number;
  key?: string;
  contentHtml: string;
};

export type ParseResult = {
  originalContent: string;
  displayContent: string;
  windows: WindowCommand[];
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

export function parseWindowCommands(content: string, currentWindowCount = 0): ParseResult {
  const windows: WindowCommand[] = [];
  const errors: string[] = [];
  let displayContent = content;

  // More permissive regex: accepts \r\n and various whitespace
  const jsonBlockRegex = /```json[\s\r\n]+([\s\S]*?)[\s\r\n]+```/g;
  const matches = [...content.matchAll(jsonBlockRegex)];

  matches.forEach((match, index) => {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.type === "create_window" && parsed.window) {
        // Check window limit
        if (currentWindowCount + windows.length >= MAX_WINDOWS) {
          errors.push(`Limite de ${MAX_WINDOWS} fenêtres atteinte`);
          displayContent = displayContent.replace(match[0], `_❌ Limite de fenêtres atteinte_`);
          return;
        }

        const validation = validateWindowCommand(parsed.window);
        if (validation.valid) {
          windows.push(parsed.window);
          displayContent = displayContent.replace(match[0], `_✨ Fenêtre créée: "${parsed.window.title}"_`);
        } else {
          errors.push(`Fenêtre ${index + 1}: ${validation.error}`);
          displayContent = displayContent.replace(match[0], `_❌ ${validation.error}_`);
        }
      }
    } catch (e) {
      errors.push(`JSON invalide (fenêtre ${index + 1})`);
    }
  });

  return { originalContent: content, displayContent, windows, errors };
}

export function replaceWindowCommandsInText(content: string): string {
  return parseWindowCommands(content, 0).displayContent;
}
