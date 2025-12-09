import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from "./language-definitions";

// Import English translations
import enCommon from "../locales/en/common.json";
import enNavigation from "../locales/en/navigation.json";
import enPages from "../locales/en/pages.json";
import enThemes from "../locales/en/themes.json";
import enErrors from "../locales/en/errors.json";
import enData from "../locales/en/data.json";

// Import French translations
import frCommon from "../locales/fr/common.json";
import frNavigation from "../locales/fr/navigation.json";
import frPages from "../locales/fr/pages.json";
import frThemes from "../locales/fr/themes.json";
import frErrors from "../locales/fr/errors.json";
import frData from "../locales/fr/data.json";

// Import Hebrew translations
import heCommon from "../locales/he/common.json";
import heNavigation from "../locales/he/navigation.json";
import hePages from "../locales/he/pages.json";
import heThemes from "../locales/he/themes.json";
import heErrors from "../locales/he/errors.json";
import heData from "../locales/he/data.json";

export const NAMESPACES = [
  "common",
  "navigation",
  "pages",
  "themes",
  "errors",
  "data",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    pages: enPages,
    themes: enThemes,
    errors: enErrors,
    data: enData,
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    pages: frPages,
    themes: frThemes,
    errors: frErrors,
    data: frData,
  },
  he: {
    common: heCommon,
    navigation: heNavigation,
    pages: hePages,
    themes: heThemes,
    errors: heErrors,
    data: heData,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    defaultNS: "common",
    ns: NAMESPACES,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "portfolio-language-id",
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: false, // Disable for better compatibility
    },
  });

export default i18n;
