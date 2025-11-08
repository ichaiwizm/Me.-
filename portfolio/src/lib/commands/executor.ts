import { toast } from "sonner";
import type { Command, ExecutorContext } from "./types";

export function executeCommand(cmd: Command, ctx: ExecutorContext): void {
  try {
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
  } catch (error) {
    console.error(`Error executing command ${cmd.type}:`, error);
    toast.error(`Erreur lors de l'exécution de la commande: ${cmd.type}`);
  }
}
