import type { WindowSpec } from "@/components/windows/WindowManager";

export type Command =
  | { type: "create_window"; window: WindowSpec }
  | { type: "change_theme"; theme: string }
  | { type: "change_background"; style: "solid" | "gradient"; color?: string; colors?: string[] }
  | { type: "show_toast"; message: string; variant?: "success" | "error" | "info" }
  | { type: "close_window"; key: string }
  | { type: "modify_window"; key: string; contentHtml: string }
  | { type: "set_ui"; chatExpanded?: boolean };

export type ExecutorContext = {
  createWindow: (spec: WindowSpec) => void;
  closeWindow: (key: string) => void;
  modifyWindow: (key: string, contentHtml: string) => void;
  changeTheme: (theme: string) => void;
  setBackground: (style: string) => void;
  setChatExpanded: (expanded: boolean) => void;
};

export const VALID_THEME_IDS = [
  "lumiere",
  "nuit",
  "foret-emeraude",
  "ocean-profond",
  "crepuscule-dore",
  "lavande-zen",
  "feu-dragon",
] as const;
