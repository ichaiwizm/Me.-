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

  if (t === "create_visual_mode") {
    if (!cmd.name || typeof cmd.name !== "string") {
      return { valid: false, error: "Nom du visual mode requis" };
    }
    if (!cmd.cssVariables || typeof cmd.cssVariables !== "object") {
      return { valid: false, error: "cssVariables requis" };
    }
    // Security: block injection patterns in CSS variables
    const forbidden = /url\s*\(|@import|expression\s*\(|javascript:|data:/i;
    for (const value of Object.values(cmd.cssVariables)) {
      if (typeof value === "string" && forbidden.test(value)) {
        return { valid: false, error: "Valeur CSS interdite détectée dans cssVariables" };
      }
    }
    // V3: Validate styles object (DynamicStyleOptions)
    if (cmd.styles && typeof cmd.styles === "object") {
      const validFontFamily = ["sans", "serif", "mono", "pixel"];
      const validFontWeight = ["normal", "bold", "black"];
      const validTextTransform = ["none", "uppercase"];
      const validLetterSpacing = ["tight", "normal", "wide"];
      const validBorderRadius = ["none", "small", "medium", "large"];
      const validBorderWidth = ["none", "thin", "medium", "thick"];
      const validBoxShadow = ["none", "soft", "hard", "glow", "offset"];
      const validTextShadow = ["none", "soft", "glow", "multi-glow"];
      const validTransitionSpeed = ["instant", "fast", "normal", "slow"];
      const validTransitionStyle = ["smooth", "steps"];
      const validButtonWrapper = ["[", "{", "<", "none"];

      const s = cmd.styles;
      if (s.fontFamily && !validFontFamily.includes(s.fontFamily)) {
        return { valid: false, error: `fontFamily invalide. Valides: ${validFontFamily.join(", ")}` };
      }
      if (s.fontWeight && !validFontWeight.includes(s.fontWeight)) {
        return { valid: false, error: `fontWeight invalide. Valides: ${validFontWeight.join(", ")}` };
      }
      if (s.textTransform && !validTextTransform.includes(s.textTransform)) {
        return { valid: false, error: `textTransform invalide. Valides: ${validTextTransform.join(", ")}` };
      }
      if (s.letterSpacing && !validLetterSpacing.includes(s.letterSpacing)) {
        return { valid: false, error: `letterSpacing invalide. Valides: ${validLetterSpacing.join(", ")}` };
      }
      if (s.borderRadius && !validBorderRadius.includes(s.borderRadius)) {
        return { valid: false, error: `borderRadius invalide. Valides: ${validBorderRadius.join(", ")}` };
      }
      if (s.borderWidth && !validBorderWidth.includes(s.borderWidth)) {
        return { valid: false, error: `borderWidth invalide. Valides: ${validBorderWidth.join(", ")}` };
      }
      if (s.boxShadow && !validBoxShadow.includes(s.boxShadow)) {
        return { valid: false, error: `boxShadow invalide. Valides: ${validBoxShadow.join(", ")}` };
      }
      if (s.textShadow && !validTextShadow.includes(s.textShadow)) {
        return { valid: false, error: `textShadow invalide. Valides: ${validTextShadow.join(", ")}` };
      }
      if (s.transitionSpeed && !validTransitionSpeed.includes(s.transitionSpeed)) {
        return { valid: false, error: `transitionSpeed invalide. Valides: ${validTransitionSpeed.join(", ")}` };
      }
      if (s.transitionStyle && !validTransitionStyle.includes(s.transitionStyle)) {
        return { valid: false, error: `transitionStyle invalide. Valides: ${validTransitionStyle.join(", ")}` };
      }
      if (s.buttonWrapper && !validButtonWrapper.includes(s.buttonWrapper)) {
        return { valid: false, error: `buttonWrapper invalide. Valides: ${validButtonWrapper.join(", ")}` };
      }
      // Validate boolean fields
      if (s.scanlines !== undefined && typeof s.scanlines !== "boolean") {
        return { valid: false, error: "scanlines doit être un booléen" };
      }
      if (s.noise !== undefined && typeof s.noise !== "boolean") {
        return { valid: false, error: "noise doit être un booléen" };
      }
      if (s.crt !== undefined && typeof s.crt !== "boolean") {
        return { valid: false, error: "crt doit être un booléen" };
      }
      if (s.rgbSplit !== undefined && typeof s.rgbSplit !== "boolean") {
        return { valid: false, error: "rgbSplit doit être un booléen" };
      }
      // Validate string pseudo-elements (block injection)
      if (s.headingPrefix && (typeof s.headingPrefix !== "string" || s.headingPrefix.length > 10)) {
        return { valid: false, error: "headingPrefix invalide (max 10 chars)" };
      }
      if (s.headingSuffix && (typeof s.headingSuffix !== "string" || s.headingSuffix.length > 10)) {
        return { valid: false, error: "headingSuffix invalide (max 10 chars)" };
      }
    }
    // Validate customCSS (raw CSS from Haiku - full freedom but security checks)
    if (cmd.customCSS) {
      if (typeof cmd.customCSS !== "string") {
        return { valid: false, error: "customCSS doit être une chaîne" };
      }
      if (cmd.customCSS.length > 50000) {
        return { valid: false, error: "customCSS trop long (max 50KB)" };
      }
      // Block dangerous patterns only (allow most CSS)
      const dangerous = /@import|expression\s*\(|javascript:|behavior\s*:/i;
      if (dangerous.test(cmd.customCSS)) {
        return { valid: false, error: "customCSS contient des patterns dangereux" };
      }
    }
  }

  return { valid: true };
}
