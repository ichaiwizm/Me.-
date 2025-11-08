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
    }
  }, [bgStyle]);

  async function handleSubmit(message: string) {
    try {
      setLoading(true);
      const next: ChatMessage[] = [...messages, { role: "user", content: message }];
      setMessages(next);
      const content = await sendChat(next);

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
        changeTheme: (theme) => setThemeId(theme as any),
        setBackground: (style) => setBgStyle(style),
        setChatExpanded: (exp) => setExpanded(exp),
      };

      // Execute all commands
      commands.forEach(cmd => executeCommand(cmd, ctx));

      // Log errors for debugging
      if (errors.length > 0) {
        console.warn("Command execution errors:", errors);
      }

      // Store ORIGINAL content in history (for LLM context)
      setMessages((prev) => [...prev, { role: "assistant", content: originalContent }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "(Erreur lors de la requête)" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <TestButtons wmRef={wmRef} />
      <ChatPreview messages={messages} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
      <WindowManager ref={wmRef} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
