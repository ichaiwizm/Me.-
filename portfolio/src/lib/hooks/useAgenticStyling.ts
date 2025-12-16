/**
 * useAgenticStyling Hook
 * Manages the agentic styling loop for AI-driven visual customization
 */

import { useState, useCallback, useRef } from "react";
import { sendAgenticChat } from "../api";
import type {
  AgentLoopState,
  AgentMessage,
  AppliedStyle,
  AgenticStylingConfig,
} from "../agentic-styling/types";
import { parseAgenticCommands } from "../agentic-styling/parser";
import {
  executeAgenticCommands,
  formatResultsForAI,
  isFinished,
  getFinishedModeName,
} from "../agentic-styling/executor";
import {
  clearAgenticStyles,
  clearAllAnimations,
  getTotalCSSSize,
} from "../agentic-styling";

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

export type AgenticStylingHook = {
  state: AgentLoopState;
  startSession: (userPrompt: string, systemPrompt: string) => Promise<void>;
  cancelSession: () => void;
  resetSession: () => void;
  isRunning: boolean;
  progress: number; // 0-100
};

export function useAgenticStyling(
  config: Partial<AgenticStylingConfig> = {}
): AgenticStylingHook {
  const mergedConfig: AgenticStylingConfig = {
    maxIterations: config.maxIterations ?? 10,
    iterationTimeout: config.iterationTimeout ?? 30000,
    maxCSSSize: config.maxCSSSize ?? 50000,
    maxJSSize: config.maxJSSize ?? 5000,
    enableAnimations: config.enableAnimations ?? true,
    debugMode: config.debugMode ?? false,
  };

  const [state, setState] = useState<AgentLoopState>(DEFAULT_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const isRunningRef = useRef(false);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<AgentLoopState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Log debug info
   */
  const debug = useCallback(
    (...args: unknown[]) => {
      if (mergedConfig.debugMode) {
        console.log("[AgenticStyling]", ...args);
      }
    },
    [mergedConfig.debugMode]
  );

  /**
   * Start a new styling session
   */
  const startSession = useCallback(
    async (userPrompt: string, systemPrompt: string) => {
      // Cancel any existing session
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();
      isRunningRef.current = true;

      // Clear previous styles
      clearAgenticStyles();
      clearAllAnimations();

      // Initialize state
      const initialHistory: AgentMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      setState({
        status: "running",
        iteration: 0,
        maxIterations: mergedConfig.maxIterations,
        conversationHistory: initialHistory,
        appliedStyles: [],
        appliedAnimations: [],
        cssVariables: {},
        lastCommandResults: [],
      });

      debug("Starting session with prompt:", userPrompt);

      // Run the agent loop
      await runAgentLoop(initialHistory, abortRef.current.signal);
    },
    [mergedConfig.maxIterations, debug]
  );

  /**
   * Run the agentic loop
   */
  const runAgentLoop = async (
    initialHistory: AgentMessage[],
    signal: AbortSignal
  ) => {
    let history = [...initialHistory];
    let iteration = 0;
    let continueLoop = true;

    while (continueLoop && iteration < mergedConfig.maxIterations) {
      if (signal.aborted) {
        debug("Session aborted");
        updateState({ status: "cancelled" });
        return;
      }

      iteration++;
      debug(`Iteration ${iteration}/${mergedConfig.maxIterations}`);
      updateState({
        iteration,
        status: "waiting_for_ai",
      });

      try {
        // Call AI
        const aiResponse = await sendAgenticChat(history, {
          signal,
          timeout: mergedConfig.iterationTimeout,
        });

        debug("AI response:", aiResponse.substring(0, 200) + "...");

        // Add AI response to history
        history = [
          ...history,
          { role: "assistant", content: aiResponse },
        ];

        // Parse commands
        const parseResult = parseAgenticCommands(aiResponse);
        debug("Parsed commands:", parseResult.commands.length);

        if (parseResult.errors.length > 0) {
          debug("Parse errors:", parseResult.errors);
        }

        updateState({
          status: "processing_commands",
          conversationHistory: history,
        });

        // Execute commands
        const results = executeAgenticCommands(parseResult.commands);
        debug("Execution results:", results);

        // Track applied styles
        const newStyles: AppliedStyle[] = [];
        const newAnimations: string[] = [];

        for (let i = 0; i < parseResult.commands.length; i++) {
          const cmd = parseResult.commands[i];
          const result = results[i];

          if (
            cmd.type === "apply_element_style" ||
            cmd.type === "apply_element_state_style"
          ) {
            if (result.type === "style_applied" && result.success) {
              newStyles.push({
                selector: cmd.selector,
                css: "css" in cmd ? cmd.css : JSON.stringify(cmd.states),
                timestamp: Date.now(),
              });
            }
          }

          if (cmd.type === "apply_element_animation") {
            if (result.type === "animation_applied" && result.success) {
              newAnimations.push(cmd.selector);
            }
          }
        }

        setState((prev) => ({
          ...prev,
          appliedStyles: [...prev.appliedStyles, ...newStyles],
          appliedAnimations: [...prev.appliedAnimations, ...newAnimations],
          lastCommandResults: results,
        }));

        // Check if finished
        if (isFinished(results)) {
          const modeName = getFinishedModeName(results);
          debug("Session finished:", modeName);
          updateState({
            status: "completed",
            visualModeName: modeName || undefined,
          });
          continueLoop = false;
          break;
        }

        // Check CSS size limit
        if (getTotalCSSSize() > mergedConfig.maxCSSSize) {
          debug("CSS size limit reached");
          updateState({
            status: "error",
            error: "CSS size limit exceeded",
          });
          continueLoop = false;
          break;
        }

        // Determine if we should continue
        const hasInspection = parseResult.hasInspectionCommands;
        const wantsContinue = parseResult.wantsToContinue;
        const hasStyles = parseResult.hasStylingCommands;

        // Continue if:
        // 1. AI explicitly wants to continue
        // 2. There were inspection commands (AI needs to see results)
        // 3. There were styling commands but no finish (implicit continue)
        continueLoop = wantsContinue || hasInspection || (hasStyles && !parseResult.isFinished);

        if (continueLoop) {
          // Format results for AI
          const resultsMessage = formatResultsForAI(results);
          history = [
            ...history,
            { role: "tool_result", content: resultsMessage },
          ];

          updateState({ conversationHistory: history });
          debug("Continuing to next iteration");
        } else if (!parseResult.isFinished) {
          // No explicit finish but nothing more to do
          debug("Implicit completion (no more commands)");
          updateState({
            status: "completed",
            visualModeName: "Custom Style",
          });
        }
      } catch (error) {
        debug("Error in iteration:", error);
        updateState({
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        continueLoop = false;
      }
    }

    // Check if we hit max iterations
    if (iteration >= mergedConfig.maxIterations && continueLoop) {
      debug("Max iterations reached");
      updateState({
        status: "error",
        error: "Maximum iterations reached",
      });
    }

    isRunningRef.current = false;
  };

  /**
   * Cancel the current session
   */
  const cancelSession = useCallback(() => {
    debug("Cancelling session");
    abortRef.current?.abort();
    isRunningRef.current = false;
    updateState({ status: "cancelled" });
  }, [debug, updateState]);

  /**
   * Reset the session and clear all styles
   */
  const resetSession = useCallback(() => {
    debug("Resetting session");
    abortRef.current?.abort();
    isRunningRef.current = false;
    clearAgenticStyles();
    clearAllAnimations();
    setState(DEFAULT_STATE);
  }, [debug]);

  /**
   * Calculate progress percentage
   */
  const progress =
    state.maxIterations > 0
      ? Math.round((state.iteration / state.maxIterations) * 100)
      : 0;

  return {
    state,
    startSession,
    cancelSession,
    resetSession,
    isRunning: state.status === "running" || state.status === "waiting_for_ai" || state.status === "processing_commands",
    progress,
  };
}
