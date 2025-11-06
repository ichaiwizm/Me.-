import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

type ChatPreviewProps = {
  text: string
  expanded: boolean
  onToggle: () => void
}

export function ChatPreview({ text, expanded, onToggle }: ChatPreviewProps) {
  return (
    <div className="mx-auto mb-2 w-full max-w-2xl px-4">
      <div className="relative rounded-md border bg-background/80 p-3 text-sm shadow-sm backdrop-blur">
        <div
          className={
            expanded ? "max-h-36 overflow-y-auto pr-2" : "max-h-16 overflow-y-auto pr-2"
          }
          aria-live="polite"
        >
          <p className="whitespace-pre-wrap text-muted-foreground">{text || "Salut, comment puis-je vous aider ?"}</p>
        </div>
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" aria-label={expanded ? "Réduire" : "Déplier"} onClick={onToggle}>
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}


