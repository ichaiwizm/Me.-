import type { WindowSpec } from "@/components/windows/WindowManager";

export type PageId = "accueil" | "projets" | "competences" | "a-propos" | "contact";

export type Command =
  | { type: "create_window"; window: WindowSpec }
  | { type: "change_theme"; theme: string }
  | { type: "change_background"; style: "solid" | "gradient" | "image"; color?: string; colors?: string[]; imageId?: string; imageUrl?: string; imageStyle?: string }
  | { type: "show_toast"; message: string; variant?: "success" | "error" | "info" }
  | { type: "close_window"; key: string }
  | { type: "modify_window"; key: string; contentHtml: string }
  | { type: "resize_window"; key: string; width?: number; height?: number }
  | { type: "display_image"; imageId?: string; imageUrl?: string; transforms?: string; inWindow?: boolean; title?: string; width?: number; height?: number }
  | { type: "display_gallery"; title?: string; tag?: string; category?: string; limit?: number; inWindow?: boolean; width?: number; height?: number }
  | { type: "set_ui"; chatExpanded?: boolean }
  | { type: "navigate"; page: PageId };

export type ExecutorContext = {
  createWindow: (spec: WindowSpec) => void;
  closeWindow: (key: string) => void;
  modifyWindow: (key: string, contentHtml: string) => void;
  resizeWindow: (key: string, width?: number, height?: number) => void;
  changeTheme: (theme: string) => void;
  setBackground: (style: string) => void;
  setChatExpanded: (expanded: boolean) => void;
  navigateToPage: (page: PageId) => void;
};

export const AVAILABLE_IMAGES = [
  { id: "paris-proposal", name: "Demande en mariage - Levana & Haïm à Paris", category: "personal" },
  { id: "nephew-yinone", name: "Avec Yinone, mon neveu", category: "personal" },
  { id: "ichai-wedding-djellaba", name: "Mariage d'Ichai - Tenue djellaba avec Tsipora", category: "personal" },
  { id: "childhood-yonathan", name: "Souvenirs d'enfance avec Yonathan", category: "personal" },
  { id: "childhood-tata-johanna", name: "Avec Tata Johanna", category: "personal" },
  { id: "kimono-chez-nanou", name: "Kimono japonais chez Nanou", category: "personal" },
  { id: "bat-mitzvah-speech", name: "Discours de Bat Mitzvah", category: "personal" },
  { id: "mountain-funicular", name: "Funiculaire à la montagne", category: "personal" },
  { id: "childhood-ichai-siblings", name: "Câlin avec Ichai", category: "personal" },
  { id: "venice-mood", name: "À Venise", category: "personal" },
] as const;
