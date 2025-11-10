import { AVAILABLE_IMAGES } from "./types";
import { MIN_WIDTH, MAX_WIDTH, MIN_HEIGHT, MAX_HEIGHT } from "@/lib/constants/windows";
import { isValidThemeId, ALL_THEME_IDS } from "@/theme/config/theme-registry";

export function validateCommand(cmd: any): { valid: boolean; error?: string } {
  if (!cmd?.type) return { valid: false, error: "Commande invalide" };

  const t = cmd.type;
  if (t === "change_theme") {
    if (!cmd.theme || typeof cmd.theme !== "string") {
      return { valid: false, error: "Thème invalide" };
    }
    if (!isValidThemeId(cmd.theme)) {
      return {
        valid: false,
        error: `Thème inconnu: ${cmd.theme}. Thèmes valides: ${ALL_THEME_IDS.join(", ")}`
      };
    }
  }

  if (t === "change_background") {
    if (!["solid", "gradient", "image"].includes(cmd.style)) {
      return { valid: false, error: "Style invalide (solid, gradient, image)" };
    }
    if (cmd.style === "solid" && !cmd.color) {
      return { valid: false, error: "Couleur manquante" };
    }
    if (cmd.style === "gradient" && (!cmd.colors || cmd.colors.length < 2)) {
      return { valid: false, error: "Couleurs manquantes (min 2)" };
    }
    if (cmd.style === "image") {
      if (!cmd.imageId && !cmd.imageUrl) {
        return { valid: false, error: "imageId ou imageUrl requis pour style image" };
      }
      if (cmd.imageId && !AVAILABLE_IMAGES.find(img => img.id === cmd.imageId)) {
        const validIds = AVAILABLE_IMAGES.map(img => img.id).join(", ");
        return { valid: false, error: `Image inconnue: ${cmd.imageId}. Images disponibles: ${validIds}` };
      }
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

  if (t === "resize_window") {
    if (!cmd.key) return { valid: false, error: "Clé manquante" };
    if (cmd.width === undefined && cmd.height === undefined) {
      return { valid: false, error: "Aucune dimension fournie" };
    }
    if (cmd.width !== undefined && (typeof cmd.width !== "number" || cmd.width < MIN_WIDTH || cmd.width > MAX_WIDTH)) {
      return { valid: false, error: `Largeur invalide (${MIN_WIDTH}-${MAX_WIDTH}px)` };
    }
    if (cmd.height !== undefined && (typeof cmd.height !== "number" || cmd.height < MIN_HEIGHT || cmd.height > MAX_HEIGHT)) {
      return { valid: false, error: `Hauteur invalide (${MIN_HEIGHT}-${MAX_HEIGHT}px)` };
    }
  }

  if (t === "set_ui" && cmd.chatExpanded !== undefined && typeof cmd.chatExpanded !== "boolean") {
    return { valid: false, error: "chatExpanded invalide" };
  }

  if (t === "display_image") {
    if (!cmd.imageId && !cmd.imageUrl) {
      return { valid: false, error: "imageId ou imageUrl requis" };
    }
    if (cmd.imageId && !AVAILABLE_IMAGES.find(img => img.id === cmd.imageId)) {
      const validIds = AVAILABLE_IMAGES.map(img => img.id).join(", ");
      return { valid: false, error: `Image inconnue: ${cmd.imageId}. Images disponibles: ${validIds}` };
    }
    if (cmd.width !== undefined && (typeof cmd.width !== "number" || cmd.width < MIN_WIDTH || cmd.width > MAX_WIDTH)) {
      return { valid: false, error: `Largeur invalide (${MIN_WIDTH}-${MAX_WIDTH}px)` };
    }
    if (cmd.height !== undefined && (typeof cmd.height !== "number" || cmd.height < MIN_HEIGHT || cmd.height > MAX_HEIGHT)) {
      return { valid: false, error: `Hauteur invalide (${MIN_HEIGHT}-${MAX_HEIGHT}px)` };
    }
  }

  if (t === "display_gallery") {
    if (cmd.limit !== undefined) {
      const n = Number(cmd.limit);
      if (!Number.isFinite(n) || n < 1 || n > 24) {
        return { valid: false, error: "Limite invalide (1-24)" };
      }
    }
    if (cmd.category && typeof cmd.category !== "string") {
      return { valid: false, error: "Catégorie invalide" };
    }
    if (cmd.tag && typeof cmd.tag !== "string") {
      return { valid: false, error: "Tag invalide" };
    }
  }

  return { valid: true };
}
