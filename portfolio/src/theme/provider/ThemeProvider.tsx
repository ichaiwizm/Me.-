import React from "react";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import { THEME_DEFINITIONS } from "../config/theme-definitions";
import type { ThemeId } from "../config/theme-definitions";
import { applyThemeToDocument } from "../utils/apply-theme";
import { loadThemeFromStorage, saveThemeToStorage } from "../utils/storage";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeIdState] = React.useState<ThemeId>(loadThemeFromStorage);

  const setThemeId = React.useCallback((id: ThemeId) => {
    setThemeIdState(id);
    saveThemeToStorage(id);
    // Theme application handled by useEffect below to avoid double application
  }, []);

  // Application initiale du thème
  React.useEffect(() => {
    applyThemeToDocument(themeId);
  }, [themeId]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      themeId,
      setThemeId,
      themes: Object.values(THEME_DEFINITIONS).map((t) => ({
        id: t.id,
        label: t.label,
        description: t.description,
        category: t.category,
      })),
    }),
    [themeId, setThemeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

