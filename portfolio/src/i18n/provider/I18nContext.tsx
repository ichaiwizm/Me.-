import React from "react";
import type { LanguageId, Direction } from "../config/language-definitions";

export type I18nContextValue = {
  languageId: LanguageId;
  setLanguageId: (id: LanguageId) => void;
  direction: Direction;
  isRTL: boolean;
  languages: Array<{
    id: LanguageId;
    nativeName: string;
    englishName: string;
    flag: string;
  }>;
};

export const I18nContext = React.createContext<I18nContextValue | undefined>(
  undefined
);

export function useI18n(): I18nContextValue {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
