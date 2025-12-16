import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Loader2, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/lib/hooks/useAnalytics"

type PromptBarProps = {
  onSubmit: (message: string) => Promise<void> | void
  loading?: boolean
  /** Layout variant: 'standalone' (fixed bottom) or 'panel' (inline within container) */
  variant?: "standalone" | "panel"
}

// Get base URL for API calls
function getBaseUrl(): string {
  const env = import.meta as any
  return (
    env.env?.VITE_SERVER_URL ||
    (env.env?.DEV ? "http://localhost:3001" : "")
  )
}

export function PromptBar({ onSubmit, loading, variant = "standalone" }: PromptBarProps) {
  const { t, i18n } = useTranslation("common")
  const [value, setValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { trackChatMessage, trackPromptGeneration } = useAnalytics()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading || isGenerating) return

    // Track message before submission
    trackChatMessage(trimmed.length, variant)

    // Clear field immediately after submit
    setValue("")
    await onSubmit(trimmed)
  }

  // Generate a prompt using AI
  const handleGeneratePrompt = useCallback(async () => {
    if (loading || isGenerating) return

    setIsGenerating(true)
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt",
          language: i18n.language || "fr"
        }),
      })

      // Track prompt generation
      trackPromptGeneration('prompt_bar', response.ok)

      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          setValue(data.content)
        }
      }
    } catch (error) {
      console.error("Failed to generate prompt:", error)
      trackPromptGeneration('prompt_bar', false)
    } finally {
      setIsGenerating(false)
    }
  }, [loading, isGenerating, i18n.language, trackPromptGeneration])

  // Generate a creative visual mode prompt via AI, then send it
  const handleVisualModePrompt = useCallback(async () => {
    if (loading || isGenerating) return

    setIsGenerating(true)
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visualMode",
          language: i18n.language || "fr"
        }),
      })

      trackPromptGeneration('visual_mode_button', response.ok)

      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          // Send the AI-generated creative prompt
          trackChatMessage(data.content.length, variant)
          await onSubmit(data.content)
        }
      }
    } catch (error) {
      console.error("Failed to generate visual mode prompt:", error)
      trackPromptGeneration('visual_mode_button', false)
    } finally {
      setIsGenerating(false)
    }
  }, [loading, isGenerating, i18n.language, onSubmit, trackChatMessage, trackPromptGeneration, variant])

  const isPanel = variant === "panel"
  const isEmpty = !value.trim()
  const isDisabled = loading || isGenerating

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
        {/* Visual mode button - always visible */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleVisualModePrompt}
          disabled={isDisabled}
          className={cn(
            "shrink-0 text-primary hover:text-primary hover:bg-primary/10",
            isPanel ? "rounded-lg" : "rounded-full"
          )}
          title={t("aria.visualModePrompt", "Mode visuel personnalisé")}
        >
          <Palette className="size-4" />
        </Button>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("placeholders.chatInput")}
          aria-label={t("aria.promptInput")}
          className="flex-1 bg-transparent border-0 focus-visible:ring-0"
          disabled={isGenerating}
        />

        <AnimatePresence mode="wait">
          {isEmpty ? (
            // AI Generate button when empty
            <motion.div
              key="ai-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                type="button"
                size="icon"
                variant="default"
                onClick={handleGeneratePrompt}
                disabled={isDisabled}
                className={cn(
                  isPanel ? "rounded-lg" : "rounded-full"
                )}
                title={t("aria.generatePrompt", "Générer un prompt IA")}
              >
                {isGenerating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
              </Button>
            </motion.div>
          ) : (
            // Send button when has content
            <motion.div
              key="send-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                type="submit"
                size="icon"
                aria-label={t("aria.sendMessage")}
                disabled={isDisabled}
                className={cn(isPanel ? "rounded-lg" : "rounded-full")}
              >
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}


