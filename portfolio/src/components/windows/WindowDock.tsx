import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Item = { id: string; title: string };

type Props = {
  items: Item[];
  onRestore: (id: string) => void;
};

/**
 * WindowDock - macOS-style dock for minimized windows
 *
 * Features:
 * - Horizontal pill-shaped bar at bottom-left
 * - Glassmorphism with intense blur
 * - Magnification effect on hover
 * - Animated tooltips
 * - Glowing indicator dots
 * - Spring animations throughout
 */
export function WindowDock({ items, onRestore }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[900]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Dock container - glassmorphism pill */}
      <div className="flex items-end gap-1 px-2 py-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <DockItem
              key={item.id}
              item={item}
              index={index}
              isHovered={hoveredId === item.id}
              onHover={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
              onRestore={onRestore}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

type DockItemProps = {
  item: Item;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onRestore: (id: string) => void;
};

function DockItem({ item, index, isHovered, onHover, onLeave, onRestore }: DockItemProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: index * 0.05
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <span className="text-[11px] font-medium text-white/90">
              {item.title}
            </span>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon button */}
      <motion.button
        onClick={() => onRestore(item.id)}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border border-white/20 shadow-lg cursor-pointer flex items-center justify-center overflow-hidden group"
        whileHover={{
          scale: 1.25,
          y: -10,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Window icon */}
        <svg
          className="w-6 h-6 text-white/80 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z"
          />
        </svg>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
      </motion.button>

      {/* Indicator dot */}
      <motion.div
        className="mt-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 + index * 0.05 }}
      />
    </motion.div>
  );
}
