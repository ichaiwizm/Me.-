export type LanguageId = "en" | "fr" | "he";
export type Direction = "ltr" | "rtl";

export type LanguageDef = {
  id: LanguageId;
  nativeName: string;
  englishName: string;
  direction: Direction;
  flag: string;
};

export const LANGUAGE_DEFINITIONS: Record<LanguageId, LanguageDef> = {
  en: {
    id: "en",
    nativeName: "English",
    englishName: "English",
    direction: "ltr",
    flag: "🇬🇧",
  },
  fr: {
    id: "fr",
    nativeName: "Français",
    englishName: "French",
    direction: "ltr",
    flag: "🇫🇷",
  },
  he: {
    id: "he",
    nativeName: "עברית",
    englishName: "Hebrew",
    direction: "rtl",
    flag: "🇮🇱",
  },
} as const;

export const DEFAULT_LANGUAGE: LanguageId = "en";
export const FALLBACK_LANGUAGE: LanguageId = "en";
