import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw, X } from "lucide-react";
import { SUGGESTIONS, type Suggestion } from "@/lib/constants/suggestions";

type PromptSuggestionsProps = {
  onSelectSuggestion: (text: string) => void;
  loading?: boolean;
};

// Category colors mapping
const categoryColors: Record<string, { bg: string; border: string; dot: string }> = {
  Portfolio: { bg: "hover:bg-violet-500/10", border: "border-violet-500/20", dot: "bg-violet-500" },
  Contact: { bg: "hover:bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  Expérience: { bg: "hover:bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
  Projets: { bg: "hover:bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
  Photos: { bg: "hover:bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-500" },
  Démo: { bg: "hover:bg-cyan-500/10", border: "border-cyan-500/20", dot: "bg-cyan-500" },
  Personnalisation: { bg: "hover:bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-500" },
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

export function PromptSuggestions({ onSelectSuggestion, loading }: PromptSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get shuffled suggestions grouped by category
  const groupedSuggestions = useMemo(() => {
    const shuffled = shuffleArray(SUGGESTIONS);
    return groupByCategory(shuffled);
  }, [shuffleKey]);

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

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle suggestion click
  const handleSelect = (text: string) => {
    onSelectSuggestion(text);
    setIsOpen(false);
  };

  // Shuffle suggestions
  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShuffleKey((k) => k + 1);
  };

  if (loading) return null;

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
        aria-label="Suggestions"
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
                <span className="text-sm font-semibold">Suggestions</span>
              </div>
              <motion.button
                onClick={handleShuffle}
                className="p-1.5 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-colors"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                aria-label="Mélanger les suggestions"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Suggestions list */}
            <div className="overflow-y-auto max-h-[calc(50vh-80px)] p-2">
              {Object.entries(groupedSuggestions).map(([category, suggestions], catIndex) => {
                const colors = categoryColors[category] || defaultColors;

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
                        {category}
                      </span>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-0.5">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion.text}
                          onClick={() => handleSelect(suggestion.text)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${colors.bg}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: catIndex * 0.05 + index * 0.02 }}
                          whileHover={{ x: 4 }}
                        >
                          <span className="text-sm text-foreground/80">
                            {suggestion.text}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-foreground/10 bg-foreground/[0.02]">
              <p className="text-[10px] text-foreground/40 text-center">
                Cliquez pour envoyer la suggestion
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
