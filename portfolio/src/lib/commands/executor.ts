import { toast } from "sonner";
import type { Command, ExecutorContext } from "./types";
import { IMAGE_REGISTRY } from "@/lib/constants/images";

export function executeCommand(cmd: Command, ctx: ExecutorContext): void {
  try {
    switch (cmd.type) {
      case "create_window":
        ctx.createWindow(cmd.window);
        break;
      case "resize_window":
        ctx.resizeWindow(cmd.key, cmd.width, cmd.height);
        break;
      case "change_theme":
        ctx.changeTheme(cmd.theme);
        break;
      case "change_background":
        let bgStyle: string;
        if (cmd.style === "gradient") {
          bgStyle = `linear-gradient(135deg, ${cmd.colors!.join(", ")})`;
        } else if (cmd.style === "image") {
          const imageUrl = cmd.imageUrl || `/images/${cmd.imageId}.png`;
          const imageStyleProps = cmd.imageStyle || "cover";
          bgStyle = `url('${imageUrl}') ${imageStyleProps}`;
        } else {
          bgStyle = cmd.color!;
        }
        ctx.setBackground(bgStyle);
        break;
      case "show_toast":
        const variant = cmd.variant || "info";
        if (variant === "success") toast.success(cmd.message);
        else if (variant === "error") toast.error(cmd.message);
        else toast(cmd.message);
        break;
      case "close_window":
        ctx.closeWindow(cmd.key);
        break;
      case "modify_window":
        ctx.modifyWindow(cmd.key, cmd.contentHtml);
        break;
      case "set_ui":
        if (cmd.chatExpanded !== undefined) {
          ctx.setChatExpanded(cmd.chatExpanded);
        }
        break;
      case "display_image":
        const imgUrl = cmd.imageUrl || `/images/${cmd.imageId}.png`;
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
        break;
      case "display_gallery": {
        // Build a responsive gallery from IMAGE_REGISTRY with clickable images
        // Optional filters: tag, category, limit
        let imgs = [...IMAGE_REGISTRY];
        if (cmd.category) imgs = imgs.filter((i) => i.category === cmd.category);
        if (cmd.tag) {
          const t = String(cmd.tag).toLowerCase();
          imgs = imgs.filter((i) =>
            i.name.toLowerCase().includes(t) ||
            i.id.toLowerCase().includes(t) ||
            i.tags.some(tag => tag.toLowerCase().includes(t))
          );
        }
        if (!imgs.length) {
          toast.error("Aucune image correspondante");
          break;
        }
        const limited = typeof cmd.limit === "number" ? imgs.slice(0, cmd.limit) : imgs;
        const imageIdList = limited.map(i => i.id).join(",");
        const grid = limited
          .map((i, idx) => {
            return `
              <figure class="gallery-item" style="margin:0;cursor:pointer;transition:transform 0.2s ease;-webkit-tap-highlight-color:transparent;"
                      data-index="${idx}" data-images="${imageIdList}"
                      onclick="openLightbox(this)"
                      ontouchend="handleTouch(event, this)"
                      onmouseover="this.style.transform='scale(1.02)'"
                      onmouseout="this.style.transform='scale(1)'">
                <div style="position:relative;width:100%;padding-bottom:66.67%;overflow:hidden;border-radius:12px;
                            box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:box-shadow 0.2s ease;"
                     onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.4)'"
                     onmouseout="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)'">
                  <img src="${i.path}" alt="${i.name}"
                       style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" />
                </div>
                <figcaption style="margin-top:10px;font-size:13px;opacity:0.8;font-weight:500;text-align:center;">
                  ${i.name}
                </figcaption>
              </figure>`;
          })
          .join("");
        const html = `
          <script>
            var touchMoved = false;
            document.addEventListener('touchmove', function() { touchMoved = true; }, {passive: true});
            document.addEventListener('touchstart', function() { touchMoved = false; }, {passive: true});

            function handleTouch(e, el) {
              if (touchMoved) return;
              e.preventDefault();
              openLightbox(el);
            }

            function openLightbox(el) {
              var index = parseInt(el.dataset.index, 10);
              var images = el.dataset.images.split(',');
              window.parent.postMessage({type:'lightbox', index:index, images:images}, '*');
            }
          </script>
          <style>
            .gallery-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 20px;
            }
            @media (min-width: 800px) {
              .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px; }
            }
            @media (min-width: 1200px) {
              .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px; }
            }
          </style>
          <div style="padding:20px;background:linear-gradient(180deg, rgba(15,15,15,0.98) 0%, rgba(8,8,8,1) 100%);
                      color:#f0f0f0;height:100%;overflow:auto;font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box;">
            <div class="gallery-grid">
              ${grid}
            </div>
          </div>
        `;
        ctx.createWindow({
          title: cmd.title || "Galerie",
          contentHtml: html,
          width: cmd.width || 720,
          height: cmd.height || 520,
          key: "gallery",
        });
        break;
      }
      case "navigate":
        ctx.navigateToPage(cmd.page);
        break;
      case "create_visual_mode":
        ctx.applyDynamicVisualMode(cmd.name, cmd.cssVariables, cmd.customCSS);
        break;
    }
  } catch (error) {
    console.error(`Error executing command ${cmd.type}:`, error);
    toast.error(`Erreur lors de l'exécution de la commande: ${cmd.type}`);
  }
}
