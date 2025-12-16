import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChatSidePanel } from "@/components/chat/ChatSidePanel";
import WindowManager from "@/components/windows/WindowManager";
import { Lightbox } from "@/components/media/Lightbox";
import { Toaster, toast } from "sonner";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { VisualModeExitButton } from "@/components/visual-mode-exit";
import { useTheme } from "@/theme/provider/ThemeContext";
import { useVisualMode } from "@/visual-mode";
import { useI18n } from "@/i18n";
import { applyDynamicVisualMode, clearDynamicVisualMode } from "@/visual-mode/utils/apply-dynamic-visual-mode";
import { AgenticStylingProvider, useAgenticStyling } from "@/lib/agentic-styling";
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

function AppContent() {
  const { startStyling, state: agenticState, resetStyling } = useAgenticStyling();
  const [currentPage, setCurrentPage] = useState<PageId>("accueil");
  const { themeId, setThemeId } = useTheme();
  const { isVisualModeActive, visualModeId, exitVisualMode } = useVisualMode();
  const { languageId } = useI18n();
  const isMobile = useIsMobile();
  const { isOpen: isChatOpen, toggle: toggleChat, close: closeChat, open: openChat } = useChatPanel();
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

  const { messages, loading, handleSubmit: originalHandleSubmit, clearMessages } =
    useChatState(windowCount, ctx);

  /**
   * Detect visual mode requests in user messages
   * Keywords that trigger agentic styling instead of normal chat
   */
  const isVisualModeRequest = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    // French keywords
    const frenchKeywords = [
      "mode visuel",
      "style visuel",
      "ambiance",
      "thème",
      "theme",
      "apparence",
      "look",
      "design",
      "stylise",
      "personnalise",
      "customise",
      "transforme l'interface",
      "change l'apparence",
      "effet visuel",
    ];
    // English keywords
    const englishKeywords = [
      "visual mode",
      "visual style",
      "style the",
      "customize",
      "design",
      "theme",
      "appearance",
      "look and feel",
      "make it look",
      "transform the ui",
      "change the style",
      "visual effect",
    ];
    // Style names (common visual themes)
    const styleNames = [
      "cyberpunk",
      "matrix",
      "retro",
      "neon",
      "pixel",
      "synthwave",
      "vaporwave",
      "brutalist",
      "minimalist",
      "futuristic",
      "glitch",
      "dark mode",
      "light mode",
      "newspaper",
      "terminal",
      "hacker",
      "space",
      "ocean",
      "forest",
      "sunset",
      "fire",
      "ice",
      "gold",
      "chrome",
      "steampunk",
      "art deco",
      "bauhaus",
      "japanese",
      "anime",
      "manga",
    ];
    // Check for keywords
    const hasKeyword = [...frenchKeywords, ...englishKeywords].some(
      (keyword) => lowerMessage.includes(keyword)
    );
    // Check for style names that suggest a visual customization
    const hasStyleName = styleNames.some(
      (style) => lowerMessage.includes(style)
    );
    // If message contains a style name along with style-related verbs
    const styleVerbs = ["crée", "fais", "donne", "applique", "mets", "make", "create", "give", "apply", "set"];
    const hasStyleVerb = styleVerbs.some((verb) => lowerMessage.includes(verb));
    return hasKeyword || (hasStyleName && hasStyleVerb);
  }, []);

  /**
   * Smart submit handler that routes visual mode requests to agentic styling
   */
  const handleSubmit = useCallback(async (message: string) => {
    if (isVisualModeRequest(message)) {
      console.log("[App] Visual mode request detected, using agentic styling");
      toast.info("Starting visual styling...");
      startStyling(message);
    } else {
      await originalHandleSubmit(message);
    }
  }, [isVisualModeRequest, startStyling, originalHandleSubmit]);

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
    // Clear agentic styles
    resetStyling();
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

  // Listen for AI visual mode generation requests - use agentic styling
  useEffect(() => {
    const handler = (e: any) => {
      const prompt = e?.detail?.prompt as string | undefined;
      if (!prompt) return;
      // Start agentic styling session
      toast.info("Starting visual styling...");
      startStyling(prompt);
    };
    window.addEventListener("app:ai-visual-mode", handler as any);
    return () => window.removeEventListener("app:ai-visual-mode", handler as any);
  }, [startStyling]);

  // Show toast when agentic styling completes
  useEffect(() => {
    if (agenticState.status === "completed" && agenticState.visualModeName) {
      toast.success(`Style "${agenticState.visualModeName}" applied!`);
    } else if (agenticState.status === "error") {
      toast.error(agenticState.error || "Styling failed");
    }
  }, [agenticState.status, agenticState.visualModeName, agenticState.error]);

  // Listen for inline suggestion clicks from HomePage
  useEffect(() => {
    const handler = (e: any) => {
      const prompt = e?.detail?.prompt as string | undefined;
      if (!prompt) return;
      // Open chat panel first, then send the inline suggestion
      openChat();
      handleSubmit(prompt);
    };
    window.addEventListener("app:inline-suggestion", handler as any);
    return () => window.removeEventListener("app:inline-suggestion", handler as any);
  }, [handleSubmit, openChat]);

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

function App() {
  return (
    <AgenticStylingProvider>
      <AppContent />
    </AgenticStylingProvider>
  );
}

export default App;
