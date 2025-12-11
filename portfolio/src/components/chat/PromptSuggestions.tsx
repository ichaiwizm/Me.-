import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { SUGGESTIONS, type Suggestion, type CategoryKey } from "@/lib/constants/suggestions";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

type PromptSuggestionsProps = {
  onSelectSuggestion: (text: string) => void;
  loading?: boolean;
  /** Layout variant: 'floating' (fixed position) or 'inline' (within container) */
  variant?: "floating" | "inline";
};

// Category colors mapping (using category keys)
const categoryColors: Record<CategoryKey, { bg: string; border: string; dot: string }> = {
  portfolio: { bg: "hover:bg-violet-500/10", border: "border-violet-500/20", dot: "bg-violet-500" },
  contact: { bg: "hover:bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  experience: { bg: "hover:bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
  projects: { bg: "hover:bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
  photos: { bg: "hover:bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-500" },
  demo: { bg: "hover:bg-cyan-500/10", border: "border-cyan-500/20", dot: "bg-cyan-500" },
  customization: { bg: "hover:bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-500" },
};

const defaultColors = { bg: "hover:bg-foreground/5", border: "border-foreground/10", dot: "bg-foreground/50" };

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Group suggestions by category
function groupByCategory(suggestions: Suggestion[]): Record<string, Suggestion[]> {
  return suggestions.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Suggestion[]>);
}

export function PromptSuggestions({ onSelectSuggestion, loading, variant = "floating" }: PromptSuggestionsProps) {
  const { t, i18n } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const [shuffleKey, setShuffleKey] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { trackSuggestionClick } = useAnalytics();

  // AI-generated suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const isInline = variant === "inline";

  // Fetch AI-generated suggestions from Haiku
  const fetchAISuggestions = useCallback(async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "suggestions", language: i18n.language }),
      });
      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setAiSuggestions(data.suggestions);
      }
    } catch {
      // Keep fallback suggestions on error
    } finally {
      setLoadingAI(false);
    }
  }, [i18n.language]);

  // Fetch suggestions on mount and when language changes
  useEffect(() => {
    fetchAISuggestions();
  }, [fetchAISuggestions]);

  // Get shuffled suggestions grouped by category (fallback only)
  const groupedSuggestions = useMemo(() => {
    const shuffled = shuffleArray(SUGGESTIONS);
    return groupByCategory(shuffled);
  }, [shuffleKey]);

  // Flat list for inline mode - use AI suggestions if available, otherwise fallback
  const flatSuggestions = useMemo(() => {
    if (aiSuggestions.length > 0) {
      return aiSuggestions.slice(0, 6);
    }
    return shuffleArray(SUGGESTIONS).slice(0, 6);
  }, [shuffleKey, aiSuggestions]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen && !isInline) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, isInline]);

  // Handle suggestion click
  const handleSelect = (text: string, category: string = 'unknown') => {
    trackSuggestionClick(variant, category);
    onSelectSuggestion(text);
    setIsOpen(false);
  };

  // Shuffle suggestions - fetch new AI suggestions
  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShuffleKey((k) => k + 1);
    fetchAISuggestions();
  };

  if (loading) return null;

  // Inline variant - horizontal scrollable chips inside panel
  if (isInline) {
    // Check if using AI suggestions (strings) or fallback (objects)
    const usingAI = aiSuggestions.length > 0;

    return (
      <div className="px-4 pt-3 pb-1">
        {/* Header with toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground/70 transition-colors mb-2"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{t("suggestions.header")}</span>
          {loadingAI && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Collapsible suggestions */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 pb-2">
                {loadingAI && aiSuggestions.length === 0 ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs border border-foreground/10 bg-foreground/5 animate-pulse"
                      style={{ width: 80 + Math.random() * 40 }}
                    >
                      &nbsp;
                    </div>
                  ))
                ) : usingAI ? (
                  // AI-generated suggestions (strings)
                  flatSuggestions.map((suggestion, index) => {
                    const text = typeof suggestion === "string" ? suggestion : t(`suggestions.items.${(suggestion as Suggestion).textKey}`);
                    return (
                      <motion.button
                        key={`ai-${index}`}
                        onClick={() => handleSelect(text, 'ai_generated')}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs border transition-colors",
                          "border-primary/30 hover:bg-primary/10",
                          "text-foreground/70 hover:text-foreground"
                        )}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {text.length > 35 ? text.slice(0, 35) + "..." : text}
                      </motion.button>
                    );
                  })
                ) : (
                  // Fallback suggestions (Suggestion objects)
                  flatSuggestions.map((suggestion, index) => {
                    const s = suggestion as Suggestion;
                    const colors = categoryColors[s.category] || defaultColors;
                    const text = t(`suggestions.items.${s.textKey}`);
                    return (
                      <motion.button
                        key={s.textKey}
                        onClick={() => handleSelect(text, s.category)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs border transition-colors",
                          colors.border,
                          colors.bg,
                          "text-foreground/70 hover:text-foreground"
                        )}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {text.length > 30 ? text.slice(0, 30) + "..." : text}
                      </motion.button>
                    );
                  })
                )}
                <motion.button
                  onClick={handleShuffle}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs border border-foreground/10 text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5 transition-colors",
                    loadingAI && "opacity-50 pointer-events-none"
                  )}
                  whileHover={{ rotate: loadingAI ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  disabled={loadingAI}
                >
                  {loadingAI ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Floating variant - original fixed position popup
  return (
    <div className="fixed bottom-7 left-4 z-40">
      {/* Trigger button - positioned to the left of the prompt bar */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full transition-all duration-300 ${
          isOpen
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            : "bg-background/80 backdrop-blur-sm border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/20 hover:shadow-md"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t("suggestions.header")}
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Lightbulb className="w-5 h-5" />
          )}
        </motion.div>

        {/* Pulse indicator when closed */}
        {!isOpen && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Popup menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="absolute bottom-14 left-0 w-72 max-h-[50vh] overflow-hidden rounded-2xl glass shadow-2xl"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{t("suggestions.header")}</span>
                {loadingAI && <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground/50" />}
              </div>
              <motion.button
                onClick={handleShuffle}
                className={cn(
                  "p-1.5 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-colors",
                  loadingAI && "opacity-50 pointer-events-none"
                )}
                whileHover={{ rotate: loadingAI ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                aria-label={t("suggestions.shuffle")}
                disabled={loadingAI}
              >
                {loadingAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            {/* Suggestions list */}
            <div className="overflow-y-auto max-h-[calc(50vh-80px)] p-2">
              {loadingAI && aiSuggestions.length === 0 ? (
                // Loading skeleton
                <div className="space-y-2 p-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 rounded-lg bg-foreground/5 animate-pulse"
                    />
                  ))}
                </div>
              ) : aiSuggestions.length > 0 ? (
                // AI-generated suggestions (flat list)
                <div className="space-y-0.5">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={`ai-floating-${index}`}
                      onClick={() => handleSelect(suggestion, 'ai_generated')}
                      className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-primary/10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-sm text-foreground/80">
                        {suggestion}
                      </span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                // Fallback: grouped suggestions
                Object.entries(groupedSuggestions).map(([category, suggestions], catIndex) => {
                  const colors = categoryColors[category as CategoryKey] || defaultColors;

                  return (
                    <motion.div
                      key={`${shuffleKey}-${category}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.05 }}
                      className="mb-3 last:mb-0"
                    >
                      {/* Category header */}
                      <div className="flex items-center gap-2 px-2 py-1.5">
                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-[11px] font-medium text-foreground/50 uppercase tracking-wider">
                          {t(`suggestions.categories.${category}`)}
                        </span>
                      </div>

                      {/* Suggestions */}
                      <div className="space-y-0.5">
                        {suggestions.map((suggestion, index) => {
                          const text = t(`suggestions.items.${suggestion.textKey}`);
                          return (
                            <motion.button
                              key={suggestion.textKey}
                              onClick={() => handleSelect(text, suggestion.category)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${colors.bg}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: catIndex * 0.05 + index * 0.02 }}
                              whileHover={{ x: 4 }}
                            >
                              <span className="text-sm text-foreground/80">
                                {text}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-foreground/10 bg-foreground/[0.02]">
              <p className="text-[10px] text-foreground/40 text-center">
                {t("suggestions.clickToSend")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
