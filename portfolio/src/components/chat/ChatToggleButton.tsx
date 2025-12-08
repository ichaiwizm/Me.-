import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

type ChatToggleButtonProps = {
  onClick: () => void;
  hasUnread?: boolean;
};

export function ChatToggleButton({ onClick, hasUnread = true }: ChatToggleButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-45
                 w-12 h-28 rounded-l-2xl
                 bg-background/80 backdrop-blur-xl
                 border border-r-0 border-foreground/10
                 shadow-[-8px_0_30px_-10px_rgba(0,0,0,0.15)]
                 flex items-center justify-center
                 hover:bg-background/90 hover:w-14
                 transition-all duration-300 cursor-pointer
                 group"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Ouvrir le chat"
    >
      <div className="relative">
        <MessageSquare className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" />

        {/* Pulse indicator */}
        {hasUnread && (
          <motion.span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Hover hint */}
      <motion.span
        className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium
                   opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        Chat
      </motion.span>
    </motion.button>
  );
}
