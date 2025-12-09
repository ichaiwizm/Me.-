import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Home, FolderKanban, Zap, User, Mail } from "lucide-react";
import type { PageId } from "@/lib/commands/types";
import { cn } from "@/lib/utils";
import { MOBILE_SPRINGS } from "@/lib/constants/animation";

// ============================================================================
// TYPES
// ============================================================================

type MobileBottomNavProps = {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
};

type NavItem = {
  id: PageId;
  icon: React.ElementType;
  labelKey: string;
};

// ============================================================================
// NAV ITEMS CONFIGURATION
// ============================================================================

const NAV_ITEMS: NavItem[] = [
  { id: "accueil", icon: Home, labelKey: "home" },
  { id: "projets", icon: FolderKanban, labelKey: "projects" },
  { id: "competences", icon: Zap, labelKey: "skills" },
  { id: "a-propos", icon: User, labelKey: "about" },
  { id: "contact", icon: Mail, labelKey: "contact" },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const { t } = useTranslation("navigation");

  return (
    <motion.nav
      className="mobile-bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", ...MOBILE_SPRINGS.nav, delay: 0.1 }}
      role="navigation"
      aria-label={t("common:aria.mainNavigation", "Main navigation")}
    >
      <div className="mobile-bottom-nav-inner">
        {NAV_ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const isActive = currentPage === id;

          return (
            <motion.button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                "mobile-nav-item touch-feedback",
                isActive ? "mobile-nav-item-active" : "mobile-nav-item-inactive"
              )}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", ...MOBILE_SPRINGS.press }}
              aria-current={isActive ? "page" : undefined}
              aria-label={t(`items.${labelKey}`)}
            >
              {/* Active indicator pill - animates between tabs */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="mobile-nav-indicator"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.9,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", ...MOBILE_SPRINGS.nav }}
              >
                <Icon className="mobile-nav-icon" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              {/* Label */}
              <motion.span
                className="mobile-nav-label"
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {t(`items.${labelKey}`)}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default MobileBottomNav;
