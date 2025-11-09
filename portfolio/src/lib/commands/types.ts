import type { WindowSpec } from "@/components/windows/WindowManager";

export type Command =
  | { type: "create_window"; window: WindowSpec }
  | { type: "change_theme"; theme: string }
  | { type: "change_background"; style: "solid" | "gradient" | "image"; color?: string; colors?: string[]; imageId?: string; imageUrl?: string; imageStyle?: string }
  | { type: "show_toast"; message: string; variant?: "success" | "error" | "info" }
  | { type: "close_window"; key: string }
  | { type: "modify_window"; key: string; contentHtml: string }
  | { type: "resize_window"; key: string; width?: number; height?: number }
  | { type: "display_image"; imageId?: string; imageUrl?: string; transforms?: string; inWindow?: boolean; title?: string; width?: number; height?: number }
  | { type: "set_ui"; chatExpanded?: boolean };

export type ExecutorContext = {
  createWindow: (spec: WindowSpec) => void;
  closeWindow: (key: string) => void;
  modifyWindow: (key: string, contentHtml: string) => void;
  resizeWindow: (key: string, width?: number, height?: number) => void;
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

export const AVAILABLE_IMAGES = [
  { id: "landscape-1", name: "Paysage montagneux", category: "nature" },
  { id: "abstract-1", name: "Art abstrait coloré", category: "abstract" },
  { id: "city-1", name: "Ville moderne", category: "urban" },
  { id: "pattern-1", name: "Motif géométrique", category: "pattern" },
  { id: "nature-1", name: "Forêt luxuriante", category: "nature" },
] as const;
