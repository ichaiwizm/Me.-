import { toast } from "sonner";
import type { Command, ExecutorContext } from "./types";

export function executeCommand(cmd: Command, ctx: ExecutorContext): void {
  try {
    switch (cmd.type) {
      case "create_window":
        ctx.createWindow(cmd.window);
        break;
      case "resize_window":
        ctx.resizeWindow(cmd.key, cmd.width, cmd.height);
        toast.success("Fenêtre redimensionnée");
        break;
      case "change_theme":
        ctx.changeTheme(cmd.theme);
        toast.success(`Thème changé: ${cmd.theme}`);
        break;
      case "change_background":
        let bgStyle: string;
        if (cmd.style === "gradient") {
          bgStyle = `linear-gradient(135deg, ${cmd.colors!.join(", ")})`;
        } else if (cmd.style === "image") {
          const imageUrl = cmd.imageUrl || `/images/${cmd.imageId}.jpg`;
          const imageStyleProps = cmd.imageStyle || "cover";
          bgStyle = `url('${imageUrl}') ${imageStyleProps}`;
        } else {
          bgStyle = cmd.color!;
        }
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
      case "display_image":
        const imgUrl = cmd.imageUrl || `/images/${cmd.imageId}.jpg`;
        const transforms = cmd.transforms || "";
        const imgTitle = cmd.title || "Image";

        if (cmd.inWindow !== false) {
          const imgHtml = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000;">
              <img src="${imgUrl}" alt="${imgTitle}" style="max-width: 100%; max-height: 100%; object-fit: contain; ${transforms}" />
            </div>
          `;
          ctx.createWindow({
            title: imgTitle,
            contentHtml: imgHtml,
            width: cmd.width || 600,
            height: cmd.height || 400,
          });
        } else {
          const imgStyle = `url('${imgUrl}') center/cover`;
          ctx.setBackground(imgStyle);
        }
        toast.success("Image affichée");
        break;
      case "navigate":
        ctx.navigateToPage(cmd.page);
        const pageNames: Record<string, string> = {
          accueil: "Accueil",
          projets: "Projets",
          competences: "Compétences",
          "a-propos": "À propos",
          contact: "Contact",
        };
        toast.success(`Navigation vers ${pageNames[cmd.page]}`);
        break;
    }
  } catch (error) {
    console.error(`Error executing command ${cmd.type}:`, error);
    toast.error(`Erreur lors de l'exécution de la commande: ${cmd.type}`);
  }
}
