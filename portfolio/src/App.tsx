import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChatSidePanel } from "@/components/chat/ChatSidePanel";
import WindowManager from "@/components/windows/WindowManager";
import { Lightbox } from "@/components/media/Lightbox";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { VisualModeExitButton } from "@/components/visual-mode-exit";
import { useTheme } from "@/theme/provider/ThemeContext";
import { useVisualMode } from "@/visual-mode";
import { useI18n } from "@/i18n";
import { applyDynamicVisualMode, clearDynamicVisualMode } from "@/visual-mode/utils/apply-dynamic-visual-mode";
import { useWindowManager } from "@/lib/hooks/useWindowManager";
import { useAppBackground } from "@/lib/hooks/useAppBackground";
import { useChatState } from "@/lib/hooks/useChatState";
import { useChatPanel } from "@/lib/hooks/useChatPanel";
import { useIsMobile, useChatPanelWidth } from "@/lib/hooks/useMediaQuery";
import { useScrollTracking } from "@/lib/hooks/useScrollTracking";
import { usePerformanceTracking } from "@/lib/hooks/usePerformanceTracking";
import { useErrorTracking } from "@/lib/hooks/useErrorTracking";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { isValidThemeId } from "@/theme/config/theme-registry";
import { IMAGE_REGISTRY, type ImageMeta } from "@/lib/constants/images";
import type { ExecutorContext, PageId, DynamicStyleOptions } from "@/lib/commands/types";
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
  const { themeId, setThemeId } = useTheme();
  const { isVisualModeActive, visualModeId, exitVisualMode } = useVisualMode();
  const { languageId } = useI18n();
  const isMobile = useIsMobile();
  const { isOpen: isChatOpen, toggle: toggleChat, close: closeChat } = useChatPanel();
  const chatPanelWidth = useChatPanelWidth();

  // GA4 Analytics tracking hooks
  const { trackPage, trackReset, trackLightbox, setCurrentPage: setAnalyticsPage } = useAnalytics();
  useScrollTracking({ pageId: currentPage });
  usePerformanceTracking();
  useErrorTracking({ componentName: 'App' });

  // Track page views when page changes
  useEffect(() => {
    trackPage(currentPage, languageId, themeId);
    setAnalyticsPage(currentPage);
  }, [currentPage, languageId, themeId, trackPage, setAnalyticsPage]);

  // Global lightbox state for gallery images
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    images: ImageMeta[];
    index: number;
  }>({ isOpen: false, images: [], index: 0 });

  const closeLightbox = useCallback((method: 'button' | 'backdrop' | 'escape' | 'swipe' = 'button') => {
    trackLightbox('close', { closeMethod: method });
    setLightboxState(s => ({ ...s, isOpen: false }));
  }, [trackLightbox]);

  const { wmRef, windowCount, minimizedCount, setMinimizedCount, createWindow, closeWindow, minimizeWindow, modifyWindow, resizeWindow, resetAll } =
    useWindowManager();

  // Listen for postMessage from gallery iframes
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'lightbox' && Array.isArray(e.data.images)) {
        const images = e.data.images
          .map((id: string) => IMAGE_REGISTRY.find(img => img.id === id))
          .filter((img: ImageMeta | undefined): img is ImageMeta => img !== undefined);
        if (images.length > 0) {
          const initialIndex = typeof e.data.index === 'number' ? e.data.index : 0;
          setLightboxState({
            isOpen: true,
            images,
            index: initialIndex
          });
          // Track lightbox open
          trackLightbox('open', {
            imageId: images[initialIndex]?.id,
            imageIndex: initialIndex,
            totalImages: images.length,
            sourceGallery: 'gallery'
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
  }, [isMobile, minimizeWindow, closeWindow, trackLightbox]);
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
    applyDynamicVisualMode: (name: string, cssVariables: Record<string, string>, styles?: DynamicStyleOptions, customCSS?: string) => {
      applyDynamicVisualMode(name, cssVariables, styles, customCSS);
    },
  };

  const { messages, loading, handleSubmit, clearMessages } =
    useChatState(windowCount, ctx);

  function resetToDefault() {
    // Track reset before clearing state
    trackReset(themeId, languageId, visualModeId || null, windowCount);

    resetAll();
    setThemeId("crepuscule-dore");
    clearBackground();
    clearMessages();
    setCurrentPage("accueil");
    // Clear visual modes (both predefined and dynamic)
    exitVisualMode();
    clearDynamicVisualMode();
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

  // Listen for AI visual mode generation requests
  useEffect(() => {
    const handler = (e: any) => {
      const prompt = e?.detail?.prompt as string | undefined;
      if (!prompt) return;
      // Send the AI-generated visual mode request to chat
      handleSubmit(prompt);
    };
    window.addEventListener("app:ai-visual-mode", handler as any);
    return () => window.removeEventListener("app:ai-visual-mode", handler as any);
  }, [handleSubmit]);

  // Listen for inline suggestion clicks from HomePage
  useEffect(() => {
    const handler = (e: any) => {
      const prompt = e?.detail?.prompt as string | undefined;
      if (!prompt) return;
      // Send the inline suggestion to chat
      handleSubmit(prompt);
    };
    window.addEventListener("app:inline-suggestion", handler as any);
    return () => window.removeEventListener("app:inline-suggestion", handler as any);
  }, [handleSubmit]);

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
      {/* Custom cursor - desktop only, hidden when visual mode is active */}
      {!isMobile && !isVisualModeActive && <CustomCursor />}

      {/* Desktop layout */}
      {!isMobile && (
        <>
          <Header
            onReset={resetToDefault}
            currentPage={currentPage}
            onNavigate={(page) => ctx.navigateToPage(page)}
            isChatOpen={currentPage === "accueil" && isChatOpen}
          />

          {/* Page principale - adjust for chat panel */}
          <main
            className="relative transition-all duration-300"
            style={{
              // Shift content left when chat is open to center it in remaining space
              marginRight: currentPage === "accueil" && isChatOpen ? `${chatPanelWidth}px` : 0,
            }}
          >
            {renderPage()}
          </main>

          {/* Chat side panel - only on home page */}
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
        onMinimizedCountChange={setMinimizedCount}
      />

      <Toaster position={isMobile ? "top-center" : "top-right"} richColors />

      {/* Global lightbox for gallery images */}
      <Lightbox
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        initialIndex={lightboxState.index}
        onClose={closeLightbox}
      />

      {/* Visual mode exit button - floating, always visible when mode is active */}
      <VisualModeExitButton isDockVisible={!isMobile && currentPage === "accueil" && minimizedCount > 0} />
    </>
  );
}

export default App;
