/**
 * AgenticProgress Component
 * Shows progress and status of agentic styling sessions
 */

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAgenticStyling } from "@/lib/agentic-styling";
import { Loader2, X, Sparkles, Check, AlertCircle } from "lucide-react";

export function AgenticProgress() {
  const { t } = useTranslation("common");
  const { state, isRunning, progress, cancelStyling } = useAgenticStyling();

  // Don't show if idle
  if (state.status === "idle") {
    return null;
  }

  const getStatusMessage = () => {
    switch (state.status) {
      case "running":
        return t("agentic.starting", "Starting styling session...");
      case "waiting_for_ai":
        return t("agentic.thinking", "AI is thinking...");
      case "processing_commands":
        return t("agentic.applying", "Applying styles...");
      case "completed":
        return t("agentic.completed", "Styling complete!");
      case "cancelled":
        return t("agentic.cancelled", "Cancelled");
      case "error":
        return state.error || t("agentic.error", "An error occurred");
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (state.status) {
      case "running":
      case "waiting_for_ai":
      case "processing_commands":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <X className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl
                   bg-card/80 backdrop-blur-sm border border-border/50
                   shadow-lg"
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {getStatusMessage()}
            </span>
            {isRunning && (
              <span className="text-xs text-muted-foreground">
                {state.iteration}/{state.maxIterations}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {isRunning && (
            <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Applied styles count */}
          {state.appliedStyles.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t("agentic.stylesApplied", "{{count}} styles applied", {
                count: state.appliedStyles.length,
              })}
            </p>
          )}

          {/* Mode name when completed */}
          {state.status === "completed" && state.visualModeName && (
            <p className="mt-1 text-xs text-primary font-medium">
              {state.visualModeName}
            </p>
          )}
        </div>

        {/* Cancel button */}
        {isRunning && (
          <button
            onClick={cancelStyling}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted/50
                       transition-colors text-muted-foreground hover:text-foreground"
            aria-label={t("agentic.cancel", "Cancel")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
