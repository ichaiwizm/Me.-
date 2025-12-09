// Re-export everything needed from i18n module
export { I18nProvider } from "./provider/I18nProvider";
export { I18nContext, useI18n } from "./provider/I18nContext";
export type { I18nContextValue } from "./provider/I18nContext";

export {
  LANGUAGE_DEFINITIONS,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  type LanguageId,
  type Direction,
  type LanguageDef,
} from "./config/language-definitions";

export {
  ALL_LANGUAGE_IDS,
  isValidLanguageId,
  getLanguageById,
  sanitizeLanguageId,
  getDefaultLanguage,
  isRTL,
} from "./config/language-registry";
