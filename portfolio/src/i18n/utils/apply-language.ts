import { getLanguageById } from "../config/language-registry";
import type { LanguageId } from "../config/language-definitions";

export function applyLanguageToDocument(languageId: LanguageId): void {
  const language = getLanguageById(languageId);
  const root = document.documentElement;

  requestAnimationFrame(() => {
    // Set HTML lang attribute (critical for accessibility)
    root.setAttribute("lang", languageId);

    // Set direction attribute (critical for RTL)
    root.setAttribute("dir", language.direction);

    // Add RTL class for CSS targeting
    if (language.direction === "rtl") {
      root.classList.add("rtl");
    } else {
      root.classList.remove("rtl");
    }

    // Set data attribute for custom styling
    root.setAttribute("data-language", languageId);
  });
}
