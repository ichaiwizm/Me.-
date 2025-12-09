import { motion, AnimatePresence } from "framer-motion";
import { Minimize2 } from "lucide-react";
import { SPRINGS } from "@/lib/constants/animation";

type Item = { id: string; title: string };

type Props = {
  items: Item[];
  onRestore: (id: string) => void;
};

/**
 * WindowDock - Floating Chips style for minimized windows
 *
 * Features:
 * - Subtle vertical stack of pill-shaped chips
 * - Consistent with portfolio design system (glass, rounded-full)
 * - Minimal animations
 * - Title truncation for long window names
 */
export function WindowDock({ items, onRestore }: Props) {
  if (items.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[900] flex flex-col gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => onRestore(item.id)}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full
                       bg-card/80 backdrop-blur-md border border-foreground/10
                       hover:border-primary/40 hover:bg-card/95
                       shadow-sm hover:shadow-md
                       transition-colors duration-200 cursor-pointer"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              ...SPRINGS.snappy,
              delay: index * 0.05,
            }}
          >
            {/* Window icon */}
            <Minimize2 className="w-3.5 h-3.5 text-foreground/40 group-hover:text-primary/70 transition-colors" />

            {/* Title */}
            <span className="text-tiny font-medium text-foreground/60 group-hover:text-foreground/80 transition-colors truncate max-w-[140px]">
              {item.title}
            </span>

            {/* Restore indicator on hover */}
            <motion.span
              className="text-[10px] text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            >
              ↗
            </motion.span>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
