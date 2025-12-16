/**
 * Agentic Styling Context
 * Provides agentic styling capabilities throughout the app
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { sendAgenticChat } from "../api";
import type {
  AgentLoopState,
  AgentMessage,
  AppliedStyle,
} from "./types";
import { parseAgenticCommands } from "./parser";
import {
  executeAgenticCommands,
  formatResultsForAI,
  isFinished,
  getFinishedModeName,
} from "./executor";
import {
  clearAgenticStyles,
  clearAllAnimations,
  getTotalCSSSize,
} from "./index";

// Load system prompt
const AGENTIC_SYSTEM_PROMPT = `# Agentic Visual Stylist

Tu es un styliste visuel IA pour un portfolio. Tu peux inspecter les éléments de l'interface, comprendre leur style actuel, et appliquer du CSS/JS personnalisé pour créer des modes visuels uniques.

## Comment tu fonctionnes

Tu opères en boucle agentique :
1. L'utilisateur décrit un style visuel qu'il veut
2. Tu peux inspecter les éléments pour comprendre l'UI actuelle
3. Tu appliques du CSS/JS à des éléments spécifiques
4. Tu continues jusqu'à ce que le style soit complet

## Commandes disponibles

Utilise des blocs de code JSON pour émettre des commandes. Tu peux utiliser plusieurs commandes par réponse.

### Commandes d'inspection

- request_element_info: {"type": "request_element_info", "selector": ".header-button"}
- list_elements: {"type": "list_elements"} ou {"type": "list_elements", "category": "chat"}

Catégories : layout, navigation, ui, chat, windows, typography, media, effects

### Commandes de style

- set_css_variables: {"type": "set_css_variables", "variables": {"background": "#0a0a12", "foreground": "#e0e0ff", "primary": "#ff2d95"}}
- apply_element_style: {"type": "apply_element_style", "selector": "header", "css": "border-bottom: 2px solid var(--primary);"}
- apply_element_state_style: {"type": "apply_element_state_style", "selector": "[data-slot='button']", "states": {"default": "...", "hover": "..."}}
- apply_element_animation: {"type": "apply_element_animation", "selector": "...", "js": "element.animate(...)", "trigger": "hover"}
- inject_raw_css: {"type": "inject_raw_css", "id": "my-keyframes", "css": "@keyframes glow {...}"}

### Commandes de contrôle

- continue_styling: {"type": "continue_styling", "thinking": "Je vais maintenant styliser..."}
- finish_styling: {"type": "finish_styling", "name": "Mon Style", "message": "Style appliqué !"}

## Sélecteurs clés

- header, main, .mobile-bottom-nav (layout)
- header nav a, header nav a[data-active='true'] (navigation)
- [data-slot='button'], input, textarea, .card (ui)
- .side-panel, [class*='ChatMessages'], [class*='PromptBar'] (chat)
- [class*='FloatingWindow'], [class*='WindowDock'] (windows)
- h1, h2, h3, p, a, .text-monumental (typography)

## Bonnes pratiques

1. Commence par les couleurs (set_css_variables)
2. Inspecte avant de styliser (request_element_info)
3. N'oublie pas les états hover
4. Sois créatif !

## Contraintes

- Max 10 itérations
- Max 50KB CSS
- Réponds dans la langue de l'utilisateur
`;

const DEFAULT_STATE: AgentLoopState = {
  status: "idle",
  iteration: 0,
  maxIterations: 10,
  conversationHistory: [],
  appliedStyles: [],
  appliedAnimations: [],
  cssVariables: {},
  lastCommandResults: [],
};

type AgenticStylingContextType = {
  state: AgentLoopState;
  isRunning: boolean;
  progress: number;
  startStyling: (prompt: string) => Promise<void>;
  cancelStyling: () => void;
  resetStyling: () => void;
};

const AgenticStylingContext = createContext<AgenticStylingContextType | null>(null);

// Debug logger
const debug = (...args: unknown[]) => {
  console.log("[AgenticStyling]", ...args);
};

export function AgenticStylingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AgentLoopState>(DEFAULT_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const updateState = useCallback((updates: Partial<AgentLoopState>) => {
    debug("State update:", updates);
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const startStyling = useCallback(async (prompt: string) => {
    debug("=== STARTING AGENTIC STYLING ===");
    debug("Prompt:", prompt);

    // Cancel any existing session
    if (abortRef.current) {
      debug("Aborting previous session");
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    // Clear previous styles
    debug("Clearing previous styles");
    clearAgenticStyles();
    clearAllAnimations();

    // Initialize
    const initialHistory: AgentMessage[] = [
      { role: "system", content: AGENTIC_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    debug("Initial history created, starting with system prompt and user message");

    setState({
      status: "running",
      iteration: 0,
      maxIterations: 10,
      conversationHistory: initialHistory,
      appliedStyles: [],
      appliedAnimations: [],
      cssVariables: {},
      lastCommandResults: [],
    });

    // Run the loop
    let history = [...initialHistory];
    let iteration = 0;
    let continueLoop = true;
    const signal = abortRef.current.signal;

    while (continueLoop && iteration < 10) {
      if (signal.aborted) {
        debug("Session aborted by user");
        updateState({ status: "cancelled" });
        return;
      }

      iteration++;
      debug(`\n=== ITERATION ${iteration}/10 ===`);
      updateState({ iteration, status: "waiting_for_ai" });

      try {
        debug("Sending request to API...");
        debug("History length:", history.length);

        const aiResponse = await sendAgenticChat(history, {
          signal,
          timeout: 30000,
        });

        debug("AI Response received:", aiResponse.substring(0, 500) + "...");

        history = [...history, { role: "assistant", content: aiResponse }];

        debug("Parsing commands from response...");
        const parseResult = parseAgenticCommands(aiResponse);
        debug("Parse result:", {
          commandCount: parseResult.commands.length,
          hasInspection: parseResult.hasInspectionCommands,
          hasStyling: parseResult.hasStylingCommands,
          isFinished: parseResult.isFinished,
          wantsContinue: parseResult.wantsToContinue,
          errors: parseResult.errors,
        });

        updateState({ status: "processing_commands", conversationHistory: history });

        debug("Executing commands...");
        const results = executeAgenticCommands(parseResult.commands);
        debug("Execution results:", results);

        // Track styles
        const newStyles: AppliedStyle[] = [];
        const newAnimations: string[] = [];

        for (let i = 0; i < parseResult.commands.length; i++) {
          const cmd = parseResult.commands[i];
          const result = results[i];

          if (
            (cmd.type === "apply_element_style" || cmd.type === "apply_element_state_style") &&
            result.type === "style_applied" &&
            result.success
          ) {
            newStyles.push({
              selector: cmd.selector,
              css: "css" in cmd ? cmd.css : JSON.stringify(cmd.states),
              timestamp: Date.now(),
            });
          }

          if (cmd.type === "apply_element_animation" && result.type === "animation_applied" && result.success) {
            newAnimations.push(cmd.selector);
          }
        }

        debug("New styles applied:", newStyles.length, "New animations:", newAnimations.length);

        setState((prev) => ({
          ...prev,
          appliedStyles: [...prev.appliedStyles, ...newStyles],
          appliedAnimations: [...prev.appliedAnimations, ...newAnimations],
          lastCommandResults: results,
        }));

        // Check finish
        if (isFinished(results)) {
          const modeName = getFinishedModeName(results);
          debug("=== STYLING FINISHED ===");
          debug("Mode name:", modeName);
          updateState({ status: "completed", visualModeName: modeName || "Custom Style" });
          continueLoop = false;
          break;
        }

        // Check size limit
        if (getTotalCSSSize() > 50000) {
          debug("CSS size limit exceeded!");
          updateState({ status: "error", error: "CSS size limit exceeded" });
          continueLoop = false;
          break;
        }

        // Continue if needed
        const hasInspection = parseResult.hasInspectionCommands;
        const wantsContinue = parseResult.wantsToContinue;
        const hasStyles = parseResult.hasStylingCommands;

        continueLoop = wantsContinue || hasInspection || (hasStyles && !parseResult.isFinished);
        debug("Continue decision:", { continueLoop, hasInspection, wantsContinue, hasStyles });

        if (continueLoop) {
          const resultsMessage = formatResultsForAI(results);
          debug("Formatting results for AI, length:", resultsMessage.length);
          history = [...history, { role: "tool_result", content: resultsMessage }];
          updateState({ conversationHistory: history });
        } else if (!parseResult.isFinished) {
          debug("Implicit completion (no explicit finish command)");
          updateState({ status: "completed", visualModeName: "Custom Style" });
        }
      } catch (error) {
        debug("ERROR in iteration:", error);
        updateState({
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        continueLoop = false;
      }
    }

    if (iteration >= 10 && continueLoop) {
      debug("Max iterations reached!");
      updateState({ status: "error", error: "Maximum iterations reached" });
    }

    debug("=== AGENTIC STYLING SESSION ENDED ===");
  }, [updateState]);

  const cancelStyling = useCallback(() => {
    debug("Cancel styling requested");
    abortRef.current?.abort();
    updateState({ status: "cancelled" });
  }, [updateState]);

  const resetStyling = useCallback(() => {
    debug("Reset styling requested");
    abortRef.current?.abort();
    clearAgenticStyles();
    clearAllAnimations();
    setState(DEFAULT_STATE);
  }, []);

  const isRunning = state.status === "running" || state.status === "waiting_for_ai" || state.status === "processing_commands";
  const progress = state.maxIterations > 0 ? Math.round((state.iteration / state.maxIterations) * 100) : 0;

  return (
    <AgenticStylingContext.Provider
      value={{
        state,
        isRunning,
        progress,
        startStyling,
        cancelStyling,
        resetStyling,
      }}
    >
      {children}
    </AgenticStylingContext.Provider>
  );
}

export function useAgenticStyling() {
  const context = useContext(AgenticStylingContext);
  if (!context) {
    throw new Error("useAgenticStyling must be used within AgenticStylingProvider");
  }
  return context;
}
