import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChatSidePanel } from "@/components/chat/ChatSidePanel";
import WindowManager from "@/components/windows/WindowManager";
import { Lightbox } from "@/components/media/Lightbox";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useTheme } from "@/theme/provider/ThemeContext";
import { useWindowManager } from "@/lib/hooks/useWindowManager";
import { useAppBackground } from "@/lib/hooks/useAppBackground";
import { useChatState } from "@/lib/hooks/useChatState";
import { useChatPanel } from "@/lib/hooks/useChatPanel";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { isValidThemeId } from "@/theme/config/theme-registry";
import { IMAGE_REGISTRY, type ImageMeta } from "@/lib/constants/images";
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
  const [currentPage, setCurrentPage] = useState<PageId>("accueil");
  const { setThemeId } = useTheme();
  const isMobile = useIsMobile();
  const { isOpen: isChatOpen, toggle: toggleChat, close: closeChat } = useChatPanel();

  // Global lightbox state for gallery images
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    images: ImageMeta[];
    index: number;
  }>({ isOpen: false, images: [], index: 0 });

  const closeLightbox = useCallback(() => {
    setLightboxState(s => ({ ...s, isOpen: false }));
  }, []);

  const { wmRef, windowCount, createWindow, closeWindow, minimizeWindow, modifyWindow, resizeWindow, resetAll } =
    useWindowManager();

  // Listen for postMessage from gallery iframes
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'lightbox' && Array.isArray(e.data.images)) {
        const images = e.data.images
          .map((id: string) => IMAGE_REGISTRY.find(img => img.id === id))
          .filter((img: ImageMeta | undefined): img is ImageMeta => img !== undefined);
        if (images.length > 0) {
          setLightboxState({
            isOpen: true,
            images,
            index: typeof e.data.index === 'number' ? e.data.index : 0
          });
          // Minimize the gallery window when lightbox opens
          if (isMobile) {
            closeWindow("gallery");
          } else {
            minimizeWindow("gallery");
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isMobile, minimizeWindow, closeWindow]);
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
    setChatExpanded: () => {}, // No longer used, kept for compatibility
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
      {/* Custom cursor - desktop only */}
      {!isMobile && <CustomCursor />}

      {/* Desktop layout */}
      {!isMobile && (
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

          {/* Chat side panel - only on home page */}
          {currentPage === "accueil" && (
            <ChatSidePanel
              messages={messages}
              loading={loading}
              onSubmit={handleSubmit}
            />
          )}
        </>
      )}

      {/* Mobile layout */}
      {isMobile && (
        <MobileLayout
          currentPage={currentPage}
          onNavigate={(page) => ctx.navigateToPage(page)}
          showFab={currentPage === "accueil"}
          isChatOpen={isChatOpen}
          onFabClick={toggleChat}
        >
          {renderPage()}

          {/* Chat side panel - only on home page for mobile */}
          {currentPage === "accueil" && (
            <ChatSidePanel
              messages={messages}
              loading={loading}
              onSubmit={handleSubmit}
              isOpenOverride={isChatOpen}
              onCloseOverride={closeChat}
              onToggleOverride={toggleChat}
            />
          )}
        </MobileLayout>
      )}

      {/* Window Manager - passes mobile mode */}
      <WindowManager
        ref={wmRef}
        showDock={!isMobile && currentPage === "accueil"}
        mobileMode={isMobile}
      />

      <Toaster position={isMobile ? "top-center" : "top-right"} richColors />

      {/* Global lightbox for gallery images */}
      <Lightbox
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        initialIndex={lightboxState.index}
        onClose={closeLightbox}
      />
    </>
  );
}

export default App;
