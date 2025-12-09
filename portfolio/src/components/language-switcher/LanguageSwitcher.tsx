import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useI18n } from "@/i18n";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("common");
  const { languageId, setLanguageId, languages, isRTL } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const currentLanguage = languages.find((l) => l.id === languageId);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-2 rounded-lg",
          "text-foreground/60 hover:text-foreground",
          "hover:bg-foreground/5 transition-colors",
          "cursor-pointer"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={t("aria.languageSwitcher")}
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="text-base">{currentLanguage?.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "absolute top-full mt-2 py-2 w-44",
              "rounded-xl glass shadow-xl",
              "border border-foreground/10",
              "z-50",
              isRTL ? "left-0" : "right-0"
            )}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguageId(lang.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 flex items-center gap-3",
                  "hover:bg-foreground/5 transition-colors",
                  "text-sm cursor-pointer",
                  languageId === lang.id && "text-primary"
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-start">{lang.nativeName}</span>
                {languageId === lang.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
