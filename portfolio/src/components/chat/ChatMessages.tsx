import { useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { replaceWindowCommandsInText } from "@/lib/commands/parser";
import { CommandChip, NavigationCard } from "./ChatElements";
import type { PageId } from "@/lib/commands/types";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatMessagesProps = {
  messages: ChatMessage[];
  loading?: boolean;
  className?: string;
};

// Parse command markers [[CMD:type:detail]] into structured data
type CommandMarker = { type: string; detail: string };

function extractCommandMarkers(content: string): { text: string; commands: CommandMarker[] } {
  const commands: CommandMarker[] = [];
  const markerRegex = /\[\[CMD:([^:]+):([^\]]*)\]\]/g;
  let text = content;
  let match;

  while ((match = markerRegex.exec(content))) {
    commands.push({ type: match[1], detail: match[2] });
  }

  // Remove markers from text
  text = text.replace(markerRegex, "").trim();

  return { text, commands };
}

// Parse navigation links [label](page) and return structured nodes
function parseContent(input: string): ReactNode[] {
  try {
    if (!input || typeof input !== "string") return [];

    // First, replace window commands with markers
    let content = replaceWindowCommandsInText(input);

    // Extract command markers
    const { text, commands } = extractCommandMarkers(content);

    // Soften markdown
    let cleanText = text
      .replace(/^#+\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Parse markdown links [label](page) into navigation cards
    const parts: ReactNode[] = [];
    const linkRe = /\[([^\]]+)\]\((accueil|projets|competences|a-propos|contact)\)/g;
    let lastIndex = 0;
    let linkMatch: RegExpExecArray | null;
    const navigationCards: { label: string; page: PageId }[] = [];

    while ((linkMatch = linkRe.exec(cleanText))) {
      const [full, label, page] = linkMatch;
      if (linkMatch.index > lastIndex) {
        parts.push(cleanText.slice(lastIndex, linkMatch.index));
      }
      // Collect navigation links to render as cards at the end
      navigationCards.push({ label, page: page as PageId });
      lastIndex = linkMatch.index + full.length;
    }

    if (lastIndex < cleanText.length) {
      parts.push(cleanText.slice(lastIndex));
    }

    // Build final output with text, then command chips, then navigation cards
    const result: ReactNode[] = [];

    // Add text content
    if (parts.length > 0) {
      result.push(
        <span key="text" className="block">
          {parts.map((p, i) => (typeof p === "string" ? <Fragment key={i}>{p}</Fragment> : p))}
        </span>
      );
    }

    // Add command chips (compact row)
    if (commands.length > 0) {
      result.push(
        <div key="commands" className="flex flex-wrap gap-1.5 mt-2">
          {commands.map((cmd, i) => (
            <CommandChip key={i} commandType={cmd.type} detail={cmd.detail || undefined} />
          ))}
        </div>
      );
    }

    // Add navigation cards
    if (navigationCards.length > 0) {
      result.push(
        <div key="nav" className="flex flex-col gap-1.5 mt-2.5">
          {navigationCards.map((nav, i) => (
            <NavigationCard key={i} page={nav.page} label={nav.label} />
          ))}
        </div>
      );
    }

    return result.length ? result : [cleanText];
  } catch (error) {
    console.error("Error parsing content:", error);
    return [input || ""];
  }
}

export function ChatMessages({ messages, loading, className }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-y-auto px-4 py-4", className)}
      aria-live="polite"
    >
      <div className="flex flex-col gap-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-foreground/60 text-sm leading-relaxed"
          >
            <p>Bonjour ! Je suis l'assistant d'Ichai, ingénieur full-stack.</p>
            <p className="mt-1 text-foreground/40">
              Pose-moi des questions sur ses projets, compétences ou parcours.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap
                    ${isUser
                      ? "bg-primary/10 text-foreground rounded-2xl rounded-br-md px-3.5 py-2"
                      : "text-foreground/85"
                    }`}
                >
                  {isUser ? (
                    m.content
                  ) : (
                    parseContent(m.content)
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1.5 px-3 py-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
              />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
              />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
              />
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
