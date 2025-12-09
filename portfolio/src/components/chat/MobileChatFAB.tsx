import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MOBILE_VARIANTS, MOBILE_SPRINGS } from "@/lib/constants/animation";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type MobileChatFABProps = {
  onClick: () => void;
  isOpen?: boolean;
  hasUnread?: boolean;
  className?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function MobileChatFAB({
  onClick,
  isOpen = false,
  hasUnread = false,
  className,
}: MobileChatFABProps) {
  const { t } = useTranslation("common");

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={onClick}
          className={cn("mobile-fab touch-feedback", className)}
          variants={MOBILE_VARIANTS.fab}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", ...MOBILE_SPRINGS.fab }}
          aria-label={t("aria.openChat", "Open chat")}
        >
          {/* Icon */}
          <MessageSquare className="mobile-fab-icon" strokeWidth={2} />

          {/* Unread indicator */}
          <AnimatePresence>
            {hasUnread && (
              <motion.span
                className="mobile-fab-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              />
            )}
          </AnimatePresence>

          {/* Pulse ring effect */}
          <motion.span
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 oklch(from var(--primary) l c h / 0.4)",
                "0 0 0 12px oklch(from var(--primary) l c h / 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default MobileChatFAB;
