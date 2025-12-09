import { motion } from "framer-motion";
import type { PageId } from "@/lib/commands/types";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileChatFAB } from "@/components/chat/MobileChatFAB";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type MobileLayoutProps = {
  children: React.ReactNode;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  showFab?: boolean;
  isChatOpen?: boolean;
  onFabClick?: () => void;
  className?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function MobileLayout({
  children,
  currentPage,
  onNavigate,
  showFab = false,
  isChatOpen = false,
  onFabClick,
  className,
}: MobileLayoutProps) {
  return (
    <div className={cn("mobile-layout", className)}>
      {/* Main content area with bottom padding for nav */}
      <motion.main
        className="mobile-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Floating Action Button for Chat */}
      {showFab && onFabClick && (
        <MobileChatFAB
          onClick={onFabClick}
          isOpen={isChatOpen}
          hasUnread={false}
        />
      )}

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default MobileLayout;
