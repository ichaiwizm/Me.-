import { motion } from "framer-motion";
import { X, MessageSquare, Minimize2 } from "lucide-react";

type ChatPanelHeaderProps = {
  onClose: () => void;
  isMobile?: boolean;
};

export function ChatPanelHeader({ onClose, isMobile }: ChatPanelHeaderProps) {
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
          <h2 className="text-sm font-semibold text-foreground">Assistant</h2>
          <p className="text-[10px] text-foreground/40">Posez vos questions</p>
        </div>
      </div>

      <motion.button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMobile ? "Fermer" : "Réduire"}
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
