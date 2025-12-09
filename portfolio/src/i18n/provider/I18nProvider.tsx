import React from "react";
import { useTranslation } from "react-i18next";
import { I18nContext, type I18nContextValue } from "./I18nContext";
import { LANGUAGE_DEFINITIONS, type LanguageId } from "../config/language-definitions";
import { applyLanguageToDocument } from "../utils/apply-language";
import { loadLanguageFromStorage, saveLanguageToStorage } from "../utils/storage";
import { isRTL } from "../config/language-registry";

type I18nProviderProps = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation();
  const [languageId, setLanguageIdState] = React.useState<LanguageId>(
    loadLanguageFromStorage
  );

  const setLanguageId = React.useCallback(
    (id: LanguageId) => {
      setLanguageIdState(id);
      saveLanguageToStorage(id);
      i18n.changeLanguage(id);
    },
    [i18n]
  );

  // Apply language to document on change
  React.useEffect(() => {
    applyLanguageToDocument(languageId);
  }, [languageId]);

  // Sync with i18next on mount
  React.useEffect(() => {
    if (i18n.language !== languageId) {
      i18n.changeLanguage(languageId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = React.useMemo<I18nContextValue>(
    () => ({
      languageId,
      setLanguageId,
      direction: LANGUAGE_DEFINITIONS[languageId].direction,
      isRTL: isRTL(languageId),
      languages: Object.values(LANGUAGE_DEFINITIONS).map((l) => ({
        id: l.id,
        nativeName: l.nativeName,
        englishName: l.englishName,
        flag: l.flag,
      })),
    }),
    [languageId, setLanguageId]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
