import { THEME_DEFINITIONS, type ThemeId, type ThemeDef } from "./theme-definitions";

export const ALL_THEME_IDS = Object.keys(THEME_DEFINITIONS) as ThemeId[];

export const ALL_THEME_CLASSNAMES = Object.values(THEME_DEFINITIONS).map((t) => t.className);

export function getThemeById(id: ThemeId): ThemeDef {
  return THEME_DEFINITIONS[id];
}

export function sanitizeThemeId(value: string | null | undefined): ThemeId | null {
  if (!value) return null;
  const key = value as ThemeId;
  return THEME_DEFINITIONS[key] ? key : null;
}

export function getDefaultTheme(): ThemeId {
  return "crepuscule-dore";
}

export function isValidThemeId(value: string): value is ThemeId {
  return value in THEME_DEFINITIONS;
}

