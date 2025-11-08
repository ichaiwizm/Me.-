import { useState } from "react";
import { sendChat, type ChatMessage } from "@/lib/api";
import { parseWindowCommands } from "@/lib/windowParser";
import { executeCommand } from "@/lib/commands/executor";
import type { ExecutorContext } from "@/lib/commands/types";

export function useChatState(windowCount: number, ctx: ExecutorContext) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(message: string) {
    try {
      setLoading(true);
      setMessages(prev => [...prev, { role: "user" as const, content: message }]);

      const messagesWithUser: ChatMessage[] = [...messages, { role: "user" as const, content: message }];
      const content = await sendChat(messagesWithUser);

      try {
        const { originalContent, commands, errors } = parseWindowCommands(
          content || "",
          windowCount
        );

        commands.forEach(cmd => executeCommand(cmd, ctx));

        if (errors.length > 0) {
          console.warn("Command parsing errors:", errors);
        }

        setMessages((prev) => [...prev, { role: "assistant", content: originalContent }]);
      } catch (commandError) {
        console.error("Error parsing/executing commands:", commandError);
        setMessages((prev) => [...prev, { role: "assistant", content: content || "" }]);
      }
    } catch (e) {
      console.error("Error in handleSubmit:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "(Erreur lors de la requête)" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearMessages() {
    setMessages([]);
  }

  return { messages, loading, handleSubmit, clearMessages };
}
