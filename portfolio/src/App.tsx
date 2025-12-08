import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import { PromptSuggestions } from "@/components/chat/PromptSuggestions";
import WindowManager from "@/components/windows/WindowManager";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useTheme } from "@/theme/provider/ThemeContext";
import { useWindowManager } from "@/lib/hooks/useWindowManager";
import { useAppBackground } from "@/lib/hooks/useAppBackground";
import { useChatState } from "@/lib/hooks/useChatState";
import { isValidThemeId } from "@/theme/config/theme-registry";
import type { ExecutorContext, PageId } from "@/lib/commands/types";
import { HomePage, ProjectsPage, SkillsPage, AboutPage, ContactPage } from "@/components/pages";

// Page transition variants
const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

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

  // Listen to navigation events emitted by ChatPreview's link buttons
  useEffect(() => {
    const handler = (e: any) => {
      const page = e?.detail?.page as PageId | undefined;
      if (!page) return;
      ctx.navigateToPage(page);
    };
    window.addEventListener("app:navigate", handler as any);
    return () => window.removeEventListener("app:navigate", handler as any);
  }, [ctx]);

  // Render la page actuelle with animation wrapper
  const renderPage = () => {
    const pages: Record<PageId, React.ReactNode> = {
      accueil: <HomePage />,
      projets: <ProjectsPage />,
      competences: <SkillsPage />,
      "a-propos": <AboutPage />,
      contact: <ContactPage />,
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {pages[currentPage] || <HomePage />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <CustomCursor />
      <Header
        onReset={resetToDefault}
        currentPage={currentPage}
        onNavigate={(page) => ctx.navigateToPage(page)}
      />

      {/* Page principale */}
      <main className="relative">
        {renderPage()}
      </main>

      {/* Tout le système de chat n'apparaît que sur la page d'accueil */}
      {currentPage === "accueil" && (
        <>
          <ChatPreview
            messages={messages}
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            loading={loading}
          />
          <PromptBar onSubmit={handleSubmit} loading={loading} />
          <PromptSuggestions onSelectSuggestion={handleSubmit} loading={loading} />
        </>
      )}

      <WindowManager ref={wmRef} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
