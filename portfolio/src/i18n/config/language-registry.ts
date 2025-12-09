import {
  LANGUAGE_DEFINITIONS,
  DEFAULT_LANGUAGE,
  type LanguageId,
  type LanguageDef,
} from "./language-definitions";

export const ALL_LANGUAGE_IDS = Object.keys(LANGUAGE_DEFINITIONS) as LanguageId[];

export function isValidLanguageId(id: unknown): id is LanguageId {
  return typeof id === "string" && id in LANGUAGE_DEFINITIONS;
}

export function getLanguageById(id: LanguageId): LanguageDef {
  return LANGUAGE_DEFINITIONS[id];
}

export function sanitizeLanguageId(id: unknown): LanguageId | null {
  if (isValidLanguageId(id)) return id;
  return null;
}

export function getDefaultLanguage(): LanguageId {
  return DEFAULT_LANGUAGE;
}

export function isRTL(id: LanguageId): boolean {
  return LANGUAGE_DEFINITIONS[id].direction === "rtl";
}
