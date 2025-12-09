import React from "react";
import type { ThemeId, ThemeCategory } from "../config/theme-definitions";

export type ThemeContextValue = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  themes: Array<{
    id: ThemeId;
    category: ThemeCategory;
  }>;
};

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
