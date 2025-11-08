import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import WindowManager from "@/components/windows/WindowManager";
import { Toaster } from "sonner";
import { useTheme } from "@/theme/provider/ThemeContext";
import { useWindowManager } from "@/lib/hooks/useWindowManager";
import { useAppBackground } from "@/lib/hooks/useAppBackground";
import { useChatState } from "@/lib/hooks/useChatState";
import { VALID_THEME_IDS } from "@/lib/commands/types";
import type { ExecutorContext } from "@/lib/commands/types";

function App() {
  const [expanded, setExpanded] = useState(false);
  const { setThemeId } = useTheme();

  const { wmRef, windowCount, createWindow, closeWindow, modifyWindow, resetAll } =
    useWindowManager();
  const { setBackground, clearBackground } = useAppBackground();

  const ctx: ExecutorContext = {
    createWindow,
    closeWindow,
    modifyWindow,
    changeTheme: (theme: string) => {
      if (VALID_THEME_IDS.includes(theme as any)) {
        setThemeId(theme as any);
      } else {
        console.error(`Invalid theme ID: ${theme}`);
      }
    },
    setBackground,
    setChatExpanded: setExpanded,
  };

  const { messages, loading, handleSubmit, clearMessages } =
    useChatState(windowCount, ctx);

  function resetToDefault() {
    resetAll();
    setThemeId("crepuscule-dore");
    clearBackground();
    clearMessages();
    setExpanded(false);
  }

  return (
    <>
      <Header onReset={resetToDefault} />
      <ChatPreview
        messages={messages}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
      <WindowManager ref={wmRef} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
