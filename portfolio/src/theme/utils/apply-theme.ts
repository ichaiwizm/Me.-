import { getThemeById } from "../config/theme-registry";
import { ALL_THEME_CLASSNAMES } from "../config/theme-registry";
import type { ThemeId } from "../config/theme-definitions";

export function applyThemeToDocument(themeId: ThemeId): void {
  const theme = getThemeById(themeId);
  const root = document.documentElement;

  // Use requestAnimationFrame to batch DOM operations and prevent flash
  requestAnimationFrame(() => {
    // Add new theme class FIRST to ensure CSS variables are always defined
    root.classList.add(theme.className);
    if (theme.isDark) {
      root.classList.add("dark");
    }

    // Then remove old theme classes (excluding the one we just added)
    ALL_THEME_CLASSNAMES.forEach((cls) => {
      if (cls !== theme.className) {
        root.classList.remove(cls);
      }
    });

    // Clean up dark class if new theme is not dark
    if (!theme.isDark) {
      root.classList.remove("dark");
    }

    // Set data attributes for debugging and custom CSS
    root.setAttribute("data-theme", theme.id);
    root.setAttribute("data-theme-category", theme.category);
  });
}

