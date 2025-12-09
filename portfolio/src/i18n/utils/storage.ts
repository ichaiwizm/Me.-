import { sanitizeLanguageId, getDefaultLanguage } from "../config/language-registry";
import type { LanguageId } from "../config/language-definitions";

const STORAGE_KEY = "portfolio-language-id";

export function detectBrowserLanguage(): LanguageId | null {
  try {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (!browserLang) return null;

    const baseLang = browserLang.split("-")[0].toLowerCase();
    return sanitizeLanguageId(baseLang);
  } catch {
    return null;
  }
}

export function loadLanguageFromStorage(): LanguageId {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const validated = sanitizeLanguageId(stored);
    if (validated) return validated;

    const browserLang = detectBrowserLanguage();
    if (browserLang) return browserLang;

    return getDefaultLanguage();
  } catch {
    return getDefaultLanguage();
  }
}

export function saveLanguageToStorage(languageId: LanguageId): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, languageId);
  } catch (error) {
    console.warn("Unable to save language:", error);
  }
}
