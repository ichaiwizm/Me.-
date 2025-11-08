import { toast } from "sonner";
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

export function validateCommand(cmd: any): { valid: boolean; error?: string } {
  if (!cmd?.type) return { valid: false, error: "Commande invalide" };

  const t = cmd.type;
  if (t === "change_theme" && (!cmd.theme || typeof cmd.theme !== "string"))
    return { valid: false, error: "Thème invalide" };

  if (t === "change_background") {
    if (!["solid", "gradient"].includes(cmd.style)) return { valid: false, error: "Style invalide" };
    if (cmd.style === "solid" && !cmd.color) return { valid: false, error: "Couleur manquante" };
    if (cmd.style === "gradient" && (!cmd.colors || cmd.colors.length < 2))
      return { valid: false, error: "Couleurs manquantes (min 2)" };
  }

  if (t === "show_toast" && (!cmd.message || typeof cmd.message !== "string"))
    return { valid: false, error: "Message manquant" };

  if ((t === "close_window" || t === "modify_window") && !cmd.key)
    return { valid: false, error: "Clé manquante" };

  if (t === "modify_window" && !cmd.contentHtml)
    return { valid: false, error: "HTML manquant" };

  if (t === "set_ui" && cmd.chatExpanded !== undefined && typeof cmd.chatExpanded !== "boolean")
    return { valid: false, error: "chatExpanded invalide" };

  return { valid: true };
}

export function executeCommand(cmd: Command, ctx: ExecutorContext): void {
  switch (cmd.type) {
    case "create_window":
      ctx.createWindow(cmd.window);
      break;
    case "change_theme":
      ctx.changeTheme(cmd.theme);
      toast.success(`Thème changé: ${cmd.theme}`);
      break;
    case "change_background":
      const bgStyle = cmd.style === "gradient"
        ? `linear-gradient(135deg, ${cmd.colors!.join(", ")})`
        : cmd.color!;
      ctx.setBackground(bgStyle);
      toast.success("Background modifié");
      break;
    case "show_toast":
      const variant = cmd.variant || "info";
      if (variant === "success") toast.success(cmd.message);
      else if (variant === "error") toast.error(cmd.message);
      else toast(cmd.message);
      break;
    case "close_window":
      ctx.closeWindow(cmd.key);
      toast.success("Fenêtre fermée");
      break;
    case "modify_window":
      ctx.modifyWindow(cmd.key, cmd.contentHtml);
      toast.success("Fenêtre modifiée");
      break;
    case "set_ui":
      if (cmd.chatExpanded !== undefined) {
        ctx.setChatExpanded(cmd.chatExpanded);
      }
      break;
  }
}
