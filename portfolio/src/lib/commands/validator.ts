import { VALID_THEME_IDS } from "./types";

export function validateCommand(cmd: any): { valid: boolean; error?: string } {
  if (!cmd?.type) return { valid: false, error: "Commande invalide" };

  const t = cmd.type;
  if (t === "change_theme") {
    if (!cmd.theme || typeof cmd.theme !== "string") {
      return { valid: false, error: "Thème invalide" };
    }
    if (!VALID_THEME_IDS.includes(cmd.theme)) {
      return {
        valid: false,
        error: `Thème inconnu: ${cmd.theme}. Thèmes valides: ${VALID_THEME_IDS.join(", ")}`
      };
    }
  }

  if (t === "change_background") {
    if (!["solid", "gradient"].includes(cmd.style)) {
      return { valid: false, error: "Style invalide" };
    }
    if (cmd.style === "solid" && !cmd.color) {
      return { valid: false, error: "Couleur manquante" };
    }
    if (cmd.style === "gradient" && (!cmd.colors || cmd.colors.length < 2)) {
      return { valid: false, error: "Couleurs manquantes (min 2)" };
    }
  }

  if (t === "show_toast" && (!cmd.message || typeof cmd.message !== "string")) {
    return { valid: false, error: "Message manquant" };
  }

  if ((t === "close_window" || t === "modify_window") && !cmd.key) {
    return { valid: false, error: "Clé manquante" };
  }

  if (t === "modify_window" && !cmd.contentHtml) {
    return { valid: false, error: "HTML manquant" };
  }

  if (t === "set_ui" && cmd.chatExpanded !== undefined && typeof cmd.chatExpanded !== "boolean") {
    return { valid: false, error: "chatExpanded invalide" };
  }

  return { valid: true };
}
