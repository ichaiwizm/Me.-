import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import { PromptSuggestions } from "@/components/chat/PromptSuggestions";
import WindowManager from "@/components/windows/WindowManager";
import { Toaster } from "sonner";
import { useTheme } from "@/theme/provider/ThemeContext";
import { useWindowManager } from "@/lib/hooks/useWindowManager";
import { useAppBackground } from "@/lib/hooks/useAppBackground";
import { useChatState } from "@/lib/hooks/useChatState";
import { isValidThemeId } from "@/theme/config/theme-registry";
import type { ExecutorContext, PageId } from "@/lib/commands/types";
import { HomePage, ProjectsPage, SkillsPage, AboutPage, ContactPage } from "@/components/pages";

function App() {
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>("accueil");
  const { setThemeId } = useTheme();

  const { wmRef, windowCount, createWindow, closeWindow, modifyWindow, resizeWindow, resetAll } =
    useWindowManager();
  const { setBackground, clearBackground } = useAppBackground();

  const ctx: ExecutorContext = {
    createWindow,
    closeWindow,
    modifyWindow,
    resizeWindow,
    changeTheme: (theme: string) => {
      if (isValidThemeId(theme)) {
        setThemeId(theme);
      } else {
        console.error(`Invalid theme ID: ${theme}`);
      }
    },
    setBackground,
    setChatExpanded: setExpanded,
    navigateToPage: (page: PageId) => {
      setCurrentPage(page);
      // Scroll to top when navigating
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  };

  const { messages, loading, handleSubmit, clearMessages } =
    useChatState(windowCount, ctx);

  function resetToDefault() {
    resetAll();
    setThemeId("crepuscule-dore");
    clearBackground();
    clearMessages();
    setExpanded(false);
    setCurrentPage("accueil");
  }

  // Render la page actuelle
  const renderPage = () => {
    switch (currentPage) {
      case "accueil":
        return <HomePage />;
      case "projets":
        return <ProjectsPage />;
      case "competences":
        return <SkillsPage />;
      case "a-propos":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Header
        onReset={resetToDefault}
        currentPage={currentPage}
        onNavigate={(page) => ctx.navigateToPage(page)}
      />

      {/* Page principale */}
      <main className="relative">
        {renderPage()}
      </main>

      <ChatPreview
        messages={messages}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        loading={loading}
      />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
      <PromptSuggestions onSelectSuggestion={handleSubmit} loading={loading} />
      <WindowManager ref={wmRef} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
