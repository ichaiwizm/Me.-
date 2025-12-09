import { sanitizeLanguageId, getDefaultLanguage } from "../config/language-registry";
import type { LanguageId } from "../config/language-definitions";

const STORAGE_KEY = "portfolio-language-id";

export function loadLanguageFromStorage(): LanguageId {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const validated = sanitizeLanguageId(stored);
    return validated ?? getDefaultLanguage();
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
