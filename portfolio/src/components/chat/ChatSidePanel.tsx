import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ChatMessages } from "./ChatMessages";
import { ChatPanelHeader } from "./ChatPanelHeader";
import { ChatToggleButton } from "./ChatToggleButton";
import { PromptBar } from "./PromptBar";
import { PromptSuggestions } from "./PromptSuggestions";
import { useChatPanel } from "@/lib/hooks/useChatPanel";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatSidePanelProps = {
  messages: ChatMessage[];
  loading?: boolean;
  onSubmit: (message: string) => Promise<void> | void;
};

// Animation variants
const panelVariants = {
  closed: {
    x: "100%",
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const mobileVariants = {
  closed: {
    opacity: 0,
    scale: 0.98,
    y: "2%",
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: "2%",
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function ChatSidePanel({ messages, loading, onSubmit }: ChatSidePanelProps) {
  const { isOpen, toggle, close } = useChatPanel();
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll on mobile when panel is open
  useEffect(() => {
    if (isMobile && isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobile, isOpen]);

  // Keyboard shortcut: Cmd/Ctrl + K to toggle
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        close();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, close, isOpen]);

  // Focus management: focus panel when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusable = panelRef.current.querySelector<HTMLElement>("button, input");
      focusable?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle button - visible when panel is closed */}
      <AnimatePresence>
        {!isOpen && <ChatToggleButton onClick={toggle} hasUnread={messages.length === 0} />}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-44"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            className={cn(
              "fixed z-45 flex flex-col",
              isMobile
                ? "inset-0 pb-[calc(64px+env(safe-area-inset-bottom,0px))] bg-background/95 backdrop-blur-2xl"
                : "right-0 top-16 bottom-0 w-[400px] border-l border-foreground/10 bg-background/80 backdrop-blur-xl shadow-[-10px_0_40px_-15px_rgba(0,0,0,0.15)]"
            )}
            variants={isMobile ? mobileVariants : panelVariants}
            initial="closed"
            animate="open"
            exit="exit"
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
              if (info.offset.y > 100) {
                close();
              }
            }}
          >
            {/* Header */}
            <ChatPanelHeader onClose={close} isMobile={isMobile} />

            {/* Messages area - scrollable */}
            <ChatMessages
              messages={messages}
              loading={loading}
              className="flex-1 min-h-0"
            />

            {/* Bottom section: Suggestions + Input */}
            <div className="border-t border-foreground/10 bg-background/50">
              {/* Suggestions */}
              <PromptSuggestions
                onSelectSuggestion={onSubmit}
                loading={loading}
                variant="inline"
              />

              {/* Prompt bar */}
              <div className="px-4 pb-4 pt-2">
                <PromptBar
                  onSubmit={onSubmit}
                  loading={loading}
                  variant="panel"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
