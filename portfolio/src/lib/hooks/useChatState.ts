import { useState, useRef, useCallback } from "react";
import {
  sendChat,
  ChatError,
  getChatErrorMessage,
  type ChatMessage,
} from "@/lib/api";
import { parseWindowCommands } from "@/lib/commands/parser";
import { executeCommand } from "@/lib/commands/executor";
import type { ExecutorContext } from "@/lib/commands/types";

/**
 * Chat state hook with improved error handling and cancellation
 *
 * Features:
 * - Request cancellation via cancel()
 * - Retry functionality
 * - Typed error state
 * - Better loading states
 */

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: ChatError | null;
  errorMessage: string | null;
  handleSubmit: (message: string) => Promise<void>;
  clearMessages: () => void;
  cancel: () => void;
  retry: () => Promise<void>;
}

export function useChatState(
  windowCount: number,
  ctx: ExecutorContext
): ChatState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);

  // AbortController for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Store last user message for retry
  const lastUserMessageRef = useRef<string | null>(null);

  /**
   * Cancel the current request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  /**
   * Submit a message to the chat
   */
  const handleSubmit = useCallback(
    async (message: string) => {
      // Cancel any pending request
      cancel();

      // Clear previous error
      setError(null);

      // Store for retry
      lastUserMessageRef.current = message;

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);

        // Add user message immediately
        setMessages((prev) => [
          ...prev,
          { role: "user" as const, content: message },
        ]);

        // Build full message history
        const messagesWithUser: ChatMessage[] = [
          ...messages,
          { role: "user" as const, content: message },
        ];

        // Send to API with abort signal
        const content = await sendChat(messagesWithUser, {
          signal: abortControllerRef.current.signal,
        });

        // Process commands in response
        try {
          const { originalContent, commands, errors } = parseWindowCommands(
            content || "",
            windowCount
          );

          // Execute each command
          commands.forEach((cmd) => executeCommand(cmd, ctx));

          // Log parsing errors (non-blocking)
          if (errors.length > 0) {
            console.warn("Command parsing errors:", errors);
          }

          // Add assistant response
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: originalContent },
          ]);
        } catch (commandError) {
          console.error("Error parsing/executing commands:", commandError);
          // Fall back to raw content
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: content || "" },
          ]);
        }
      } catch (e) {
        console.error("Error in handleSubmit:", e);

        // Handle ChatError
        if (e instanceof ChatError) {
          setError(e);

          // Only add error message if not aborted by user
          if (e.code !== "ABORTED") {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: getChatErrorMessage(e) },
            ]);
          } else {
            // Remove the user message we just added since request was cancelled
            setMessages((prev) => prev.slice(0, -1));
          }
        } else {
          // Unknown error
          const chatError = new ChatError("Erreur inconnue", "UNKNOWN", false);
          setError(chatError);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: getChatErrorMessage(chatError) },
          ]);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, windowCount, ctx, cancel]
  );

  /**
   * Retry the last failed request
   */
  const retry = useCallback(async () => {
    if (lastUserMessageRef.current && error?.retryable) {
      // Remove the last assistant error message
      setMessages((prev) => {
        const newMessages = [...prev];
        // Remove last assistant message (the error)
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
          newMessages.pop();
        }
        // Remove the user message that caused the error
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "user") {
          newMessages.pop();
        }
        return newMessages;
      });

      // Clear error and retry
      setError(null);
      await handleSubmit(lastUserMessageRef.current);
    }
  }, [error, handleSubmit]);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    cancel();
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = null;
  }, [cancel]);

  return {
    messages,
    loading,
    error,
    errorMessage: error ? getChatErrorMessage(error) : null,
    handleSubmit,
    clearMessages,
    cancel,
    retry,
  };
}
