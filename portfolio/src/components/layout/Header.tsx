import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { VisualModeSwitcher } from "@/components/visual-mode-switcher";
import { useVisualMode } from "@/visual-mode";
import { useChatPanelWidth } from "@/lib/hooks/useMediaQuery";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageId } from "@/lib/commands/types";

type HeaderProps = {
  onReset?: () => void;
  currentPage?: PageId;
  onNavigate?: (page: PageId) => void;
  /** Whether the chat panel is open (for layout adjustment) */
  isChatOpen?: boolean;
};

export function Header({ onReset, currentPage = "accueil", onNavigate, isChatOpen = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { t } = useTranslation("navigation");
  const { isVisualModeActive } = useVisualMode();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleNavClick = (e: React.MouseEvent, page: PageId) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  const navItems: { id: PageId; labelKey: string }[] = [
    { id: "accueil", labelKey: "home" },
    { id: "projets", labelKey: "projects" },
    { id: "competences", labelKey: "skills" },
    { id: "a-propos", labelKey: "about" },
    { id: "contact", labelKey: "contact" },
  ];

  // Chat panel width for layout calculations (responsive)
  const chatWidth = useChatPanelWidth();

  return (
    <motion.header
      className={`fixed top-0 left-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-2 bg-background/90 backdrop-blur-xl border-b border-foreground/10 shadow-sm"
          : "py-4 bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
      style={{
        // Adjust header width when chat is open
        right: isChatOpen ? `${chatWidth}px` : 0,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo / Nom */}
          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <button
              onClick={(e) => handleNavClick(e, "accueil")}
              className="group text-left cursor-pointer"
            >
              <span
                className={`font-bold tracking-tight transition-all duration-300 ${
                  isScrolled ? "text-xl" : "text-2xl"
                }`}
              >
                <span className="relative">
                  Ichai
                  <motion.span
                    className="absolute -bottom-0.5 left-0 h-0.5 bg-primary"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>{" "}
                <span className="text-primary">Wizman</span>
              </span>
            </button>
            <motion.span
              className="text-xs text-foreground/60 tracking-wide"
              animate={{
                opacity: isScrolled ? 0 : 1,
                height: isScrolled ? 0 : "auto",
                marginTop: isScrolled ? 0 : 2,
              }}
              transition={{ duration: 0.3 }}
            >
              {t("subtitle")}
            </motion.span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleNavClick(e, item.id)}
                  className={`relative px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {t(`items.${item.labelKey}`)}

                  {/* Active indicator with layoutId for smooth transitions */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                      layoutId="nav-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover underline for non-active items */}
                  {!isActive && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground/30 rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center gap-2">
            {onReset && (
              <motion.div
                whileHover={{ rotate: -180 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onReset}
                  aria-label={t("common:aria.resetApp")}
                  title={t("common:aria.resetApp")}
                  className="text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            <LanguageSwitcher />
            {/* Hide theme & visual mode switchers when a visual mode is active */}
            {!isVisualModeActive && (
              <>
                <ThemeSwitcher />
                <VisualModeSwitcher />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
