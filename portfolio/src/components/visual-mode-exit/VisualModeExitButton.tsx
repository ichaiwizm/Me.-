import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useVisualMode, getVisualModeById } from "@/visual-mode";

/**
 * Floating exit button that appears when a visual mode is active.
 * Positioned in the bottom-left corner to avoid conflicts with other UI.
 */
export function VisualModeExitButton() {
  const { isVisualModeActive, exitVisualMode, visualModeId } = useVisualMode();
  const { t } = useTranslation("common");

  // Get the mode definition for proper label translation
  const mode = visualModeId ? getVisualModeById(visualModeId) : null;

  return (
    <AnimatePresence>
      {isVisualModeActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="visual-mode-exit-button fixed bottom-6 left-6 z-[100000]"
        >
          <Button
            onClick={exitVisualMode}
            variant="destructive"
            size="lg"
            className="rounded-full shadow-2xl gap-2 pr-5"
            aria-label={t("aria.exitVisualMode")}
          >
            <X className="h-5 w-5" />
            <span className="font-medium">{t("visualModes.exit")}</span>
          </Button>

          {/* Mode indicator badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-[10px] px-2 py-1 rounded-full bg-foreground/10 text-foreground/60 font-medium">
              {mode && t(mode.labelKey)}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
