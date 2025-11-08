import { useEffect, useRef } from "react"
import { replaceWindowCommandsInText } from "@/lib/windowParser"

type ChatMessage = { role: "user" | "assistant"; content: string }

type ChatPreviewProps = {
  messages: ChatMessage[]
  expanded: boolean
  onToggle: () => void
}

function formatContent(input: string): string {
  try {
    // Validate input
    if (!input || typeof input !== "string") {
      return "";
    }

    // First, replace window commands with titles/errors
    let content = replaceWindowCommandsInText(input);

    // Then soften markdown: remove headers, bold, inline code, heavy lists
    return content
      .replace(/^#+\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch (error) {
    console.error("Error formatting content:", error);
    // Return original input as fallback
    return input || "";
  }
}

export function ChatPreview({ messages, expanded, onToggle }: ChatPreviewProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [messages.length, expanded])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4">
      <div className="relative rounded-xl border bg-background/40 p-2 shadow-none backdrop-blur-sm text-xs text-foreground/70">
        <div className={expanded ? "max-h-36 overflow-y-auto pr-2" : "max-h-16 overflow-y-auto pr-2"} aria-live="polite">
          <div className="flex flex-col gap-1.5 leading-snug">
            {messages.length === 0 && (
              <p className="italic text-foreground/60">Salut, comment puis-je vous aider ?</p>
            )}
            {messages.map((m, i) => {
              const isUser = m.role === "user"
              return (
                <div key={i} className={isUser ? "flex justify-end" : "flex justify-start"}>
                  <p
                    className={
                      (isUser
                        ? "italic font-light text-foreground/60"
                        : "not-italic font-serif text-foreground/70") +
                      " max-w-[80%] whitespace-pre-wrap"
                    }
                  >
                    {formatContent(m.content)}
                  </p>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>
        </div>
      </div>
      <div className="mt-1 flex justify-end px-1">
        <button
          type="button"
          onClick={onToggle}
          className="text-[11px] text-foreground/50 hover:text-foreground/70 underline-offset-2 hover:underline cursor-pointer"
          aria-label={expanded ? "Réduire" : "Afficher plus"}
        >
          {expanded ? "Réduire" : "Afficher plus"}
        </button>
      </div>
    </div>
  )
}


