import { motion } from "framer-motion";
import type { VisualModeId } from "@/visual-mode";

type VisualModeMenuItemProps = {
  id: VisualModeId;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};

/**
 * Visual preview components for each mode - shows actual style characteristics
 */
function ModePreview({ modeId }: { modeId: VisualModeId }) {
  switch (modeId) {
    case "neo-brutalism":
      // Brutalist style: thick black border, hard offset shadow
      return (
        <div className="w-7 h-7 bg-white border-[2.5px] border-black shadow-[3px_3px_0_0_black] flex items-center justify-center">
          <div className="w-2 h-2 bg-[#00d4ff]" />
        </div>
      );
    case "retro-pixel":
      // Pixel grid with NES-style colors
      return (
        <div className="w-7 h-7 bg-[#0f0f23] grid grid-cols-3 gap-[2px] p-[3px] rounded-none">
          <div className="bg-[#00e436]" />
          <div className="bg-[#ff004d]" />
          <div className="bg-[#29adff]" />
          <div className="bg-[#ffec27]" />
          <div className="bg-[#ff004d]" />
          <div className="bg-[#00e436]" />
          <div className="bg-[#29adff]" />
          <div className="bg-[#ffec27]" />
          <div className="bg-[#ff004d]" />
        </div>
      );
    case "newspaper":
      // Editorial style: cream paper with text lines
      return (
        <div className="w-7 h-7 bg-[#f5f0e8] border border-[#1a1a1a] flex flex-col justify-center px-1 gap-[2px]">
          <div className="h-[3px] bg-[#1a1a1a] w-full" />
          <div className="h-[1.5px] bg-[#1a1a1a]/40 w-4/5" />
          <div className="h-[1.5px] bg-[#1a1a1a]/40 w-3/5" />
        </div>
      );
    default:
      return null;
  }
}

export function VisualModeMenuItem({
  id,
  label,
  description,
  isActive,
  onClick,
}: VisualModeMenuItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent/60 hover:text-accent-foreground"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <ModePreview modeId={id} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs opacity-70 truncate">{description}</div>
        </div>
      </div>
    </motion.button>
  );
}
