import { useRef, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import { sendChat } from "@/lib/api";
import type { ChatMessage } from "@/lib/api";
import WindowManager, { type WindowManagerHandle } from "@/components/windows/WindowManager";
import { parseWindowCommands } from "@/lib/windowParser";
import { executeCommand, type ExecutorContext } from "@/lib/commandExecutor";
import { Toaster } from "sonner";
import { useTheme } from "@/theme/provider/ThemeContext";
import { TestButtons } from "@/components/TestButtons";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowCount, setWindowCount] = useState(0);
  const [bgStyle, setBgStyle] = useState<string>("");
  const wmRef = useRef<WindowManagerHandle>(null);
  const { setThemeId } = useTheme();

  // Apply background style
  useEffect(() => {
    if (bgStyle) {
      document.body.style.background = bgStyle;
    } else {
      document.body.style.background = "";
    }
  }, [bgStyle]);

  // Reset to default state
  function resetToDefault() {
    // Close all windows
    wmRef.current?.resetAll();

    // Reset theme to default
    setThemeId("crepuscule-dore");

    // Clear background
    setBgStyle("");

    // Clear chat messages
    setMessages([]);

    // Reset UI state
    setExpanded(false);
    setWindowCount(0);
  }

  async function handleSubmit(message: string) {
    try {
      setLoading(true);

      // Use functional form for state updates to avoid race conditions
      setMessages(prev => [...prev, { role: "user", content: message }]);

      // Get updated messages for API call
      const messagesWithUser = [...messages, { role: "user", content: message }];
      const content = await sendChat(messagesWithUser);

      // Wrap command parsing and execution in try-catch to prevent crashes
      try {
        // Parse all commands from LLM response
        const { originalContent, commands, errors } = parseWindowCommands(content || "", windowCount);

        // Create executor context
        const ctx: ExecutorContext = {
          createWindow: (spec) => {
            wmRef.current?.createWindow(spec);
            setWindowCount(c => c + 1);
          },
          closeWindow: (key) => wmRef.current?.closeWindow(key),
          modifyWindow: (key, html) => wmRef.current?.modifyWindow(key, html),
          changeTheme: (theme) => {
            // Validate theme ID before applying
            const validThemes = ["lumiere", "nuit", "foret-emeraude", "ocean-profond", "crepuscule-dore", "lavande-zen", "feu-dragon"];
            if (validThemes.includes(theme)) {
              setThemeId(theme as any);
            } else {
              console.error(`Invalid theme ID: ${theme}`);
            }
          },
          setBackground: (style) => setBgStyle(style),
          setChatExpanded: (exp) => setExpanded(exp),
        };

        // Execute all commands
        commands.forEach(cmd => executeCommand(cmd, ctx));

        // Log errors for debugging
        if (errors.length > 0) {
          console.warn("Command parsing errors:", errors);
        }

        // Store ORIGINAL content in history (for LLM context)
        setMessages((prev) => [...prev, { role: "assistant", content: originalContent }]);
      } catch (commandError) {
        console.error("Error parsing/executing commands:", commandError);
        // Still add the raw content to chat even if command execution fails
        setMessages((prev) => [...prev, { role: "assistant", content: content || "" }]);
      }
    } catch (e) {
      console.error("Error in handleSubmit:", e);
      setMessages((prev) => [...prev, { role: "assistant", content: "(Erreur lors de la requête)" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header onReset={resetToDefault} />
      <TestButtons wmRef={wmRef} />
      <ChatPreview messages={messages} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
      <WindowManager ref={wmRef} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
