import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type PromptBarProps = {
  onSubmit: (message: string) => Promise<void> | void
  loading?: boolean
}

export function PromptBar({ onSubmit, loading }: PromptBarProps) {
  const [value, setValue] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return

    try {
      await onSubmit(trimmed)
    } finally {
      // Always clear the input, even if onSubmit throws
      setValue("")
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full border bg-background/80 px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Écrivez votre demande..."
          aria-label="Prompt"
          className="flex-1 bg-transparent border-0 focus-visible:ring-0"
        />
        <Button type="submit" size="icon" aria-label="Envoyer" disabled={loading} className="rounded-full">
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  )
}


