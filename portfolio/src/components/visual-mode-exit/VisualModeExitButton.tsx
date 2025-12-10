import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useVisualMode, getVisualModeById } from "@/visual-mode";
import {
  getActiveDynamicVisualModeName,
  clearDynamicVisualMode,
} from "@/visual-mode/utils/apply-dynamic-visual-mode";

/**
 * Floating exit button that appears when a visual mode is active.
 * Supports both predefined visual modes and dynamic AI-generated modes.
 * Positioned in the bottom-left corner to avoid conflicts with other UI.
 */
export function VisualModeExitButton() {
  const { isVisualModeActive, exitVisualMode, visualModeId } = useVisualMode();
  const { t } = useTranslation("common");

  // Track dynamic visual mode state
  const [dynamicModeName, setDynamicModeName] = useState<string | null>(null);

  // Check for dynamic mode on mount and when DOM changes
  useEffect(() => {
    const checkDynamicMode = () => {
      const name = getActiveDynamicVisualModeName();
      setDynamicModeName(name);
    };

    // Initial check
    checkDynamicMode();

    // Observe changes to the html element
    const observer = new MutationObserver(checkDynamicMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-dynamic-visual-mode"],
    });

    return () => observer.disconnect();
  }, []);

  // Get the mode definition for proper label translation
  const mode = visualModeId ? getVisualModeById(visualModeId) : null;

  // Determine if any mode is active
  const isAnyModeActive = isVisualModeActive || !!dynamicModeName;

  // Handle exit - clear both types of modes
  const handleExit = useCallback(() => {
    if (isVisualModeActive) {
      exitVisualMode();
    }
    if (dynamicModeName) {
      clearDynamicVisualMode();
      setDynamicModeName(null);
    }
  }, [isVisualModeActive, exitVisualMode, dynamicModeName]);

  // Determine the label to display
  const getModeLabel = () => {
    if (mode) {
      return t(mode.labelKey);
    }
    if (dynamicModeName) {
      return dynamicModeName;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isAnyModeActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="visual-mode-exit-button fixed bottom-6 left-6 z-[100000]"
        >
          <Button
            onClick={handleExit}
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
              {getModeLabel()}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
