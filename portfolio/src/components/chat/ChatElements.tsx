import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight, Image, Palette, Layout, Navigation, Sparkles } from "lucide-react";
import type { PageId } from "@/lib/commands/types";

// Command type to icon mapping (labels via i18n)
const COMMAND_ICONS: Record<string, { icon: React.ReactNode; labelKey: string }> = {
  display_gallery: { icon: <Image className="w-3 h-3" />, labelKey: "labels.gallery" },
  display_image: { icon: <Image className="w-3 h-3" />, labelKey: "labels.image" },
  create_window: { icon: <Layout className="w-3 h-3" />, labelKey: "labels.window" },
  change_theme: { icon: <Palette className="w-3 h-3" />, labelKey: "labels.theme" },
  change_background: { icon: <Palette className="w-3 h-3" />, labelKey: "labels.background" },
  navigate: { icon: <Navigation className="w-3 h-3" />, labelKey: "labels.navigation" },
  default: { icon: <Sparkles className="w-3 h-3" />, labelKey: "labels.action" },
};

type CommandChipProps = {
  commandType: string;
  detail?: string;
};

export function CommandChip({ commandType, detail }: CommandChipProps) {
  const { t } = useTranslation("common");
  const config = COMMAND_ICONS[commandType] || COMMAND_ICONS.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                 bg-primary/8 text-primary/80 text-[11px] font-medium
                 border border-primary/15"
    >
      <span className="opacity-60">{config.icon}</span>
      <span>{detail || t(config.labelKey)}</span>
      <Check className="w-3 h-3 text-emerald-500/80" />
    </motion.div>
  );
}

// Page config keys mapping
const PAGE_CONFIG_KEYS: Record<PageId, { titleKey: string; descKey: string }> = {
  accueil: { titleKey: "cards.home.title", descKey: "cards.home.description" },
  projets: { titleKey: "cards.skills.title", descKey: "cards.skills.description" },
  competences: { titleKey: "cards.skills.title", descKey: "cards.skills.description" },
  "a-propos": { titleKey: "cards.about.title", descKey: "cards.about.description" },
  contact: { titleKey: "cards.contact.title", descKey: "cards.contact.description" },
};

type NavigationCardProps = {
  page: PageId;
  label?: string;
  onClick?: () => void;
};

export function NavigationCard({ page, label, onClick }: NavigationCardProps) {
  const { t } = useTranslation("navigation");
  const keys = PAGE_CONFIG_KEYS[page] || { titleKey: "", descKey: "" };
  const config = {
    label: keys.titleKey ? t(keys.titleKey) : page,
    description: keys.descKey ? t(keys.descKey) : "",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.dispatchEvent(new CustomEvent("app:navigate", { detail: { page } }));
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group flex items-center justify-between w-full p-2.5 rounded-lg
                 bg-gradient-to-r from-primary/6 to-transparent
                 border border-primary/12 hover:border-primary/25
                 transition-all duration-200 cursor-pointer text-left"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-md bg-primary/10">
          <ArrowRight className="w-3 h-3 text-primary" />
        </div>
        <div>
          <span className="text-sm font-medium text-foreground/90">
            {label || config.label}
          </span>
          {config.description && (
            <span className="hidden sm:inline text-xs text-foreground/50 ml-2">
              {config.description}
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary/70
                             group-hover:translate-x-0.5 transition-all" />
    </motion.button>
  );
}

// Quick action chips that appear at the end of messages
type QuickActionProps = {
  suggestions: { label: string; page: PageId }[];
};

export function QuickActions({ suggestions }: QuickActionProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {suggestions.map((s) => (
        <motion.button
          key={s.page}
          onClick={() => window.dispatchEvent(new CustomEvent("app:navigate", { detail: { page: s.page } }))}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-2.5 py-1 rounded-md text-xs font-medium
                     bg-foreground/5 hover:bg-primary/10
                     text-foreground/70 hover:text-primary
                     border border-foreground/10 hover:border-primary/20
                     transition-all duration-150 cursor-pointer"
        >
          {s.label}
        </motion.button>
      ))}
    </div>
  );
}
