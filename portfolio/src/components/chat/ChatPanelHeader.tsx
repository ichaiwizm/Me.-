import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, MessageSquare, Minimize2 } from "lucide-react";

type ChatPanelHeaderProps = {
  onClose: () => void;
  isMobile?: boolean;
};

export function ChatPanelHeader({ onClose, isMobile }: ChatPanelHeaderProps) {
  const { t } = useTranslation("common");

  return (
    <motion.div
      className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-background/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("chat.title")}</h2>
          <p className="text-[10px] text-foreground/40">{t("chat.subtitle")}</p>
        </div>
      </div>

      <motion.button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMobile ? t("buttons.close") : t("buttons.minimize")}
      >
        {isMobile ? (
          <X className="w-5 h-5" />
        ) : (
          <Minimize2 className="w-5 h-5" />
        )}
      </motion.button>
    </motion.div>
  );
}
