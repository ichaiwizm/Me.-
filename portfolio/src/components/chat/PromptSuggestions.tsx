import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Suggestion = {
  text: string;
  category: string;
};

const SUGGESTIONS: Suggestion[] = [
  { text: "Crée une horloge animée", category: "Créatif" },
  { text: "Génère une palette de couleurs", category: "Créatif" },
  { text: "Fais un timer pomodoro", category: "Productivité" },
  { text: "Galerie d'images interactive", category: "Médias" },
  { text: "Compteur avec animations", category: "Créatif" },
  { text: "Dégradé animé en arrière-plan", category: "Créatif" },
  { text: "Jeu Pierre-Papier-Ciseaux", category: "Jeux" },
  { text: "Particules flottantes", category: "Animations" },
  { text: "Todo list élégante", category: "Productivité" },
  { text: "Calculatrice scientifique", category: "Productivité" },
  { text: "Visualiseur d'ondes sonores", category: "Créatif" },
  { text: "Diaporama avec transitions", category: "Médias" },
];

type PromptSuggestionsProps = {
  onSelectSuggestion: (text: string) => void;
  loading?: boolean;
};

export function PromptSuggestions({ onSelectSuggestion, loading }: PromptSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return null;

  return (
    <>
      {/* Bouton discret pour ouvrir */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 bottom-4 z-40 p-2 rounded-md bg-background/60 backdrop-blur-sm border border-border/40 hover:border-primary/50 hover:bg-background/80 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          aria-label="Voir les suggestions"
        >
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Panel latéral */}
      <div
        className={`fixed left-0 top-16 bottom-0 z-40 w-80 bg-background/95 backdrop-blur-sm border-r border-border/40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header du panel */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <h3 className="text-sm font-semibold text-foreground">Suggestions</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fermer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Liste des suggestions */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-1">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectSuggestion(s.text);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-md bg-transparent hover:bg-muted border border-transparent hover:border-border/40 transition-all duration-150 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-foreground/80 group-hover:text-foreground flex-1">
                      {s.text}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-0.5">
                      {s.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer optionnel */}
          <div className="px-4 py-3 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground text-center">
              Cliquez sur une suggestion pour l'essayer
            </p>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer en cliquant à côté */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-30 transition-opacity duration-300"
        />
      )}
    </>
  );
}
