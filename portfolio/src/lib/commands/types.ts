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
  { id: "family-event", name: "Moment en famille", category: "personal" },
  { id: "rooftop-night", name: "Soirée sur le toit", category: "personal" },
  { id: "park-moment", name: "Balade au parc", category: "personal" },
  { id: "aquarium-fun", name: "Fun à l'aquarium", category: "personal" },
  { id: "paris-champs-elysees", name: "Champs-Élysées, Paris", category: "personal" },
] as const;
