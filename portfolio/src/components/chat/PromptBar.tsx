import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type PromptBarProps = {
  onSubmit: (message: string) => Promise<void> | void
  loading?: boolean
  /** Layout variant: 'standalone' (fixed bottom) or 'panel' (inline within container) */
  variant?: "standalone" | "panel"
}

export function PromptBar({ onSubmit, loading, variant = "standalone" }: PromptBarProps) {
  const { t } = useTranslation("common")
  const [value, setValue] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return

    // Clear field immediately after submit
    setValue("")
    await onSubmit(trimmed)
  }

  const isPanel = variant === "panel"

  return (
    <div className={cn(
      isPanel
        ? "w-full"
        : "fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
    )}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-2 border bg-background/80 shadow-sm focus-within:ring-2 focus-within:ring-ring/40",
          isPanel
            ? "rounded-xl px-3 py-1.5"
            : "rounded-full px-2 py-1"
        )}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("placeholders.chatInput")}
          aria-label="Prompt"
          className="flex-1 bg-transparent border-0 focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="icon"
          aria-label={t("aria.sendMessage")}
          disabled={loading}
          className={cn(isPanel ? "rounded-lg" : "rounded-full")}
        >
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  )
}


