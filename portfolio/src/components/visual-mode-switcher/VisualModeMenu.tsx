import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, Loader2 } from "lucide-react";
import type { VisualModeId, VisualModeDef } from "@/visual-mode";
import { VisualModeMenuItem } from "./VisualModeMenuItem";

type VisualModeMenuProps = {
  modes: VisualModeDef[];
  activeModeId: VisualModeId | null;
  onSelectMode: (id: VisualModeId) => void;
  onClose?: () => void;
};

// Get base URL for API calls
function getBaseUrl(): string {
  const env = import.meta as any;
  return (
    env.env?.VITE_SERVER_URL ||
    (env.env?.DEV ? "http://localhost:3001" : "")
  );
}

export function VisualModeMenu({ modes, activeModeId, onSelectMode, onClose }: VisualModeMenuProps) {
  const { t, i18n } = useTranslation("common");
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate and send an AI visual mode request
  const handleAIMode = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visualMode",
          language: i18n.language || "fr"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          // Dispatch event to send message to chat
          window.dispatchEvent(new CustomEvent("app:ai-visual-mode", {
            detail: { prompt: data.content }
          }));
          onClose?.();
        }
      }
    } catch (error) {
      console.error("Failed to generate visual mode:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, i18n.language, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-foreground/10 bg-popover p-2 text-popover-foreground shadow-xl glass"
      >
        {/* Header */}
        <div className="mb-2 px-2 py-1 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("visualModes.header")}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
            {t("visualModes.experimental")}
          </span>
        </div>

        {/* Mode list */}
        <div className="space-y-1">
          {modes.map((mode) => (
            <VisualModeMenuItem
              key={mode.id}
              id={mode.id}
              label={t(mode.labelKey)}
              description={t(mode.descriptionKey)}
              isActive={mode.id === activeModeId}
              onClick={() => onSelectMode(mode.id)}
            />
          ))}

          {/* AI Mode - Special item */}
          <motion.button
            onClick={handleAIMode}
            disabled={isGenerating}
            className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-fuchsia-500/10 border border-transparent hover:border-violet-500/20"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {/* AI Mode preview - gradient sparkle box */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm flex items-center gap-1.5">
                  {t("visualModes.aiMode.label", "Mode IA")}
                  <span className="text-[9px] px-1 py-0.5 rounded bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-400 font-bold">
                    AI
                  </span>
                </div>
                <div className="text-xs opacity-70 truncate">
                  {t("visualModes.aiMode.description", "Surprise ! Laisse l'IA choisir")}
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer hint */}
        <div className="mt-2 pt-2 border-t border-foreground/5 px-2">
          <p className="text-[10px] text-muted-foreground/70 text-center">
            {t("visualModes.hint")}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
