export type ThemeId =
  | "lumiere"
  | "nuit"
  | "ocean-profond"
  | "crepuscule-dore"
  | "feu-dragon";

export type ThemeCategory = "apaisant" | "energique" | "sophistique";

export type ThemeDef = {
  id: ThemeId;
  className: string;
  isDark: boolean;
  category: ThemeCategory;
};

export const THEME_DEFINITIONS: Record<ThemeId, ThemeDef> = {
  "lumiere": {
    id: "lumiere",
    className: "theme-lumiere",
    isDark: false,
    category: "apaisant",
  },
  "nuit": {
    id: "nuit",
    className: "theme-nuit",
    isDark: true,
    category: "sophistique",
  },
  "ocean-profond": {
    id: "ocean-profond",
    className: "theme-ocean-profond",
    isDark: false,
    category: "apaisant",
  },
  "crepuscule-dore": {
    id: "crepuscule-dore",
    className: "theme-crepuscule-dore",
    isDark: false,
    category: "sophistique",
  },
  "feu-dragon": {
    id: "feu-dragon",
    className: "theme-feu-dragon",
    isDark: true,
    category: "energique",
  },
};
