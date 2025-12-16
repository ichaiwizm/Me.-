/**
 * Chat API module with robust error handling
 *
 * Features:
 * - Request timeout (default: 30s)
 * - Automatic retry with exponential backoff
 * - AbortController support for cancellation
 * - Typed error classes
 */

// ============================================================================
// TYPES
// ============================================================================

export type ChatMessage = { role: "user" | "assistant" | "system" | "tool_result"; content: string };

export interface SendChatOptions {
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Maximum retry attempts (default: 2) */
  maxRetries?: number;
}

export type ChatErrorCode = "TIMEOUT" | "NETWORK" | "SERVER" | "ABORTED" | "UNKNOWN";

// ============================================================================
// ERROR CLASS
// ============================================================================

export class ChatError extends Error {
  code: ChatErrorCode;
  retryable: boolean;
  statusCode?: number;

  constructor(
    message: string,
    code: ChatErrorCode,
    retryable: boolean,
    statusCode?: number
  ) {
    super(message);
    this.name = "ChatError";
    this.code = code;
    this.retryable = retryable;
    this.statusCode = statusCode;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Creates a timeout promise that rejects after specified ms
 */
function createTimeoutPromise(ms: number, controller: AbortController): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new ChatError("Délai d'attente dépassé", "TIMEOUT", true));
    }, ms);
  });
}

/**
 * Sleep for exponential backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get base URL for API calls
 * In dev mode, Vite proxy handles /api routes
 */
function getBaseUrl(): string {
  const env = import.meta as any;
  // If VITE_SERVER_URL is set, use it
  // Otherwise, use empty string (Vite proxy will forward /api calls)
  return env.env?.VITE_SERVER_URL || "";
}

// ============================================================================
// MAIN API FUNCTION
// ============================================================================

/**
 * Send a chat message to the API
 *
 * @param messages - Array of chat messages
 * @param options - Request options (timeout, retries, abort signal)
 * @returns The assistant's response content
 * @throws ChatError on failure
 */
export async function sendChat(
  messages: ChatMessage[],
  options: SendChatOptions = {}
): Promise<string> {
  const { signal, timeout = 30000, maxRetries = 2 } = options;

  const baseUrl = getBaseUrl();
  let lastError: ChatError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Create timeout controller
    const timeoutController = new AbortController();

    // If external signal is provided, listen for abort
    if (signal) {
      signal.addEventListener("abort", () => timeoutController.abort());
    }

    // Check if already aborted
    if (signal?.aborted) {
      throw new ChatError("Requête annulée", "ABORTED", false);
    }

    try {
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
          signal: timeoutController.signal,
        }),
        createTimeoutPromise(timeout, timeoutController),
      ]);

      // Handle HTTP errors
      if (!response.ok) {
        const isServerError = response.status >= 500;
        throw new ChatError(
          `Erreur serveur (${response.status})`,
          "SERVER",
          isServerError,
          response.status
        );
      }

      // Parse response
      const data = await response.json();
      return data?.content ?? "";

    } catch (error) {
      // Handle abort
      if (error instanceof Error && error.name === "AbortError") {
        if (signal?.aborted) {
          throw new ChatError("Requête annulée", "ABORTED", false);
        }
        // Timeout abort is handled by createTimeoutPromise
      }

      // Already a ChatError
      if (error instanceof ChatError) {
        lastError = error;

        // Don't retry non-retryable errors
        if (!error.retryable) {
          throw error;
        }
      } else {
        // Network or unknown error
        lastError = new ChatError(
          "Erreur de connexion",
          "NETWORK",
          true
        );
      }

      // Retry with exponential backoff (if not last attempt)
      if (attempt < maxRetries) {
        const backoffMs = 1000 * Math.pow(2, attempt);
        await sleep(backoffMs);
      }
    }
  }

  // All retries exhausted
  throw lastError || new ChatError("Erreur inconnue", "UNKNOWN", false);
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Send a message to the agentic styling API
 * Uses a dedicated endpoint that supports the tool_result role
 *
 * @param messages - Array of chat messages (including system and tool_result)
 * @param options - Request options
 * @returns The assistant's response content
 */
export async function sendAgenticChat(
  messages: ChatMessage[],
  options: SendChatOptions = {}
): Promise<string> {
  const { signal, timeout = 30000, maxRetries = 2 } = options;

  const baseUrl = getBaseUrl();
  let lastError: ChatError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const timeoutController = new AbortController();

    if (signal) {
      signal.addEventListener("abort", () => timeoutController.abort());
    }

    if (signal?.aborted) {
      throw new ChatError("Requête annulée", "ABORTED", false);
    }

    try {
      const response = await Promise.race([
        fetch(`${baseUrl}/api/agentic-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
          signal: timeoutController.signal,
        }),
        createTimeoutPromise(timeout, timeoutController),
      ]);

      if (!response.ok) {
        const isServerError = response.status >= 500;
        throw new ChatError(
          `Erreur serveur (${response.status})`,
          "SERVER",
          isServerError,
          response.status
        );
      }

      const data = await response.json();
      return data?.content ?? "";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        if (signal?.aborted) {
          throw new ChatError("Requête annulée", "ABORTED", false);
        }
      }

      if (error instanceof ChatError) {
        lastError = error;
        if (!error.retryable) {
          throw error;
        }
      } else {
        lastError = new ChatError("Erreur de connexion", "NETWORK", true);
      }

      if (attempt < maxRetries) {
        const backoffMs = 1000 * Math.pow(2, attempt);
        await sleep(backoffMs);
      }
    }
  }

  throw lastError || new ChatError("Erreur inconnue", "UNKNOWN", false);
}

/**
 * Get a user-friendly error message
 */
export function getChatErrorMessage(error: unknown): string {
  if (error instanceof ChatError) {
    switch (error.code) {
      case "TIMEOUT":
        return "La requête a pris trop de temps. Réessayez.";
      case "NETWORK":
        return "Erreur de connexion. Vérifiez votre connexion internet.";
      case "SERVER":
        return "Le serveur a rencontré une erreur. Réessayez dans quelques instants.";
      case "ABORTED":
        return "Requête annulée.";
      default:
        return "Une erreur est survenue. Réessayez.";
    }
  }
  return "Une erreur inattendue est survenue.";
}
