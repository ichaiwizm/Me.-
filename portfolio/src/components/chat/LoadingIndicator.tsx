import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { EASINGS } from "@/lib/constants/animation";

/**
 * LoadingIndicator - Contextual loading state for chat
 *
 * Features:
 * - Animated dots using theme colors
 * - Optional context message
 * - Cancel button
 * - Optional elapsed time display
 */

export interface LoadingIndicatorProps {
  /** Called when user cancels the request */
  onCancel?: () => void;
  /** Optional context message (e.g., "Recherche des images...") */
  context?: string;
  /** Show elapsed time (default: false) */
  showTimer?: boolean;
  className?: string;
}

export function LoadingIndicator({
  onCancel,
  context,
  showTimer = false,
  className,
}: LoadingIndicatorProps) {
  const { t } = useTranslation("common");
  const displayContext = context || t("chat.thinking");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer for elapsed time
  useEffect(() => {
    if (!showTimer) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimer]);

  // Format elapsed time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      className={`flex items-center gap-3 p-4 rounded-2xl glass ${className ?? ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: EASINGS.standard }}
    >
      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Context message */}
      <div className="flex-1 min-w-0">
        <p className="text-body text-foreground/70 truncate">
          {displayContext}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </p>
        {showTimer && elapsedSeconds > 5 && (
          <p className="text-tiny text-foreground/50 mt-0.5">
            {formatTime(elapsedSeconds)}
          </p>
        )}
      </div>

      {/* Cancel button */}
      {onCancel && (
        <motion.button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-foreground/10 transition-colors group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t("buttons.cancel")}
          title={t("buttons.cancel")}
        >
          <X className="w-4 h-4 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * Error message with retry option
 */
export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  const { t } = useTranslation("common");
  return (
    <motion.div
      className={`flex items-center gap-3 p-4 rounded-2xl bg-[var(--color-error-muted)] border border-[var(--color-error)]/20 ${className ?? ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: EASINGS.standard }}
    >
      {/* Error icon */}
      <div className="w-8 h-8 rounded-full bg-[var(--color-error)]/20 flex items-center justify-center flex-shrink-0">
        <span className="text-[var(--color-error)] text-lg">!</span>
      </div>

      {/* Message */}
      <p className="flex-1 text-body text-[var(--color-error)]">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-error)]/10 hover:bg-[var(--color-error)]/20 text-[var(--color-error)] text-tiny font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t("buttons.retry")}
        </motion.button>
      )}
    </motion.div>
  );
}

export default LoadingIndicator;
