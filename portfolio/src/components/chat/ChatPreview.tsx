import { useEffect, useRef } from "react"
import { replaceWindowCommandsInText } from "@/lib/commands/parser"
import type { PageId } from "@/lib/commands/types"
import type { ReactNode } from "react"

type ChatMessage = { role: "user" | "assistant"; content: string }

type ChatPreviewProps = {
  messages: ChatMessage[]
  expanded: boolean
  onToggle: () => void
  loading?: boolean
}

function formatContentToNodes(input: string): ReactNode[] {
  try {
    // Validate input
    if (!input || typeof input !== "string") {
      return [];
    }

    // First, replace window commands with titles/errors
    let content = replaceWindowCommandsInText(input);

    // Then soften markdown: remove headers, bold, inline code, heavy lists
    content = content
      .replace(/^#+\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Convert markdown links [label](projets) to clickable buttons that navigate
    const parts: ReactNode[] = [];
    const linkRe = /\[([^\]]+)\]\((accueil|projets|competences|a-propos|contact)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = linkRe.exec(content))) {
      const [full, label, page] = match;
      if (match.index > lastIndex) parts.push(content.slice(lastIndex, match.index));
      const pageId = page as PageId;
      parts.push(
        <button
          key={`${page}-${match.index}`}
          className="underline underline-offset-2 text-primary hover:opacity-80 cursor-pointer"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("app:navigate", { detail: { page: pageId } }));
          }}
        >
          {label}
        </button>
      );
      lastIndex = match.index + full.length;
    }
    if (lastIndex < content.length) parts.push(content.slice(lastIndex));
    return parts.length ? parts : [content];
  } catch (error) {
    console.error("Error formatting content:", error);
    // Return original input as fallback
    return [input || ""];
  }
}

export function ChatPreview({ messages, expanded, onToggle, loading }: ChatPreviewProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [messages.length, expanded])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4">
      <div className="relative rounded-xl border bg-background/50 p-2 shadow-sm backdrop-blur-sm text-sm text-foreground/80">
        <div className={expanded ? "max-h-48 overflow-y-auto pr-2" : "max-h-20 overflow-y-auto pr-2"} aria-live="polite">
          <div className="flex flex-col gap-1.5 leading-snug">
            {messages.length === 0 && (
              <p className="italic text-foreground/60">
                Bonjour ! Je suis Ichai, ingénieur full-stack.
                Posez-moi des questions sur mes projets, compétences ou expérience !
              </p>
            )}
            {messages.map((m, i) => {
              const isUser = m.role === "user"
              return (
                <div key={i} className={isUser ? "flex justify-end" : "flex justify-start"}>
                  <p
                    className={
                      (isUser
                        ? "border-l-2 border-primary/60 text-foreground"
                        : "border-l-2 border-foreground/20 text-foreground/80") +
                      " max-w-[85%] whitespace-pre-wrap pl-3"
                    }
                  >
                    {formatContentToNodes(m.content).map((node, idx) => (
                      typeof node === "string" ? <span key={idx}>{node}</span> : node
                    ))}
                  </p>
                </div>
              )
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="border-l-2 border-foreground/20 pl-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background/70 via-background/30 to-transparent" />
      </div>
      <div className="mt-1 flex justify-end px-1">
        <button
          type="button"
          onClick={onToggle}
          className="text-[11px] text-foreground/60 hover:text-foreground/80 underline-offset-2 hover:underline cursor-pointer"
          aria-label={expanded ? "Réduire" : "Afficher plus"}
        >
          {expanded ? "Réduire" : "Afficher plus"}
        </button>
      </div>
    </div>
  )
}


