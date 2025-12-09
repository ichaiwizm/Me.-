import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_SPRINGS, GESTURE_THRESHOLDS } from "@/lib/constants/animation";

// ============================================================================
// TYPES
// ============================================================================

export type SnapPoint = "peek" | "half" | "full";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: SnapPoint[];
  initialSnap?: SnapPoint;
  showHandle?: boolean;
  showCloseButton?: boolean;
  allowDrag?: boolean;
  className?: string;
};

// ============================================================================
// CONSTANTS
// ============================================================================

/** Snap point heights in viewport height percentage */
const SNAP_HEIGHTS: Record<SnapPoint, number> = {
  peek: 30,
  half: 55,
  full: 92,
};

// ============================================================================
// COMPONENT
// ============================================================================

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = ["half", "full"],
  initialSnap = "half",
  showHandle = true,
  showCloseButton = true,
  allowDrag = true,
  className,
}: BottomSheetProps) {
  const controls = useAnimation();
  const currentSnap = useRef<SnapPoint>(initialSnap);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get height for a snap point
  const getSnapHeight = useCallback((snap: SnapPoint) => {
    return SNAP_HEIGHTS[snap] || 55;
  }, []);

  // Animate to a snap point
  const animateToSnap = useCallback(
    (snap: SnapPoint) => {
      currentSnap.current = snap;
      controls.start({
        height: `${getSnapHeight(snap)}vh`,
        transition: { type: "spring", ...MOBILE_SPRINGS.sheet },
      });
    },
    [controls, getSnapHeight]
  );

  // Handle drag end - determine snap point or dismiss
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      const { velocity, offset } = info;

      // Dismiss if dragged down fast enough or far enough
      if (
        velocity.y > GESTURE_THRESHOLDS.dismissVelocity ||
        offset.y > GESTURE_THRESHOLDS.dismissDistance
      ) {
        onClose();
        return;
      }

      // Calculate target height based on current position and velocity
      const currentHeight = getSnapHeight(currentSnap.current);
      const draggedPercent = (offset.y / window.innerHeight) * 100;
      const velocityInfluence = (velocity.y / 10);
      const targetHeight = currentHeight - draggedPercent - velocityInfluence;

      // Find the closest snap point
      const closestSnap = snapPoints.reduce((prev, curr) => {
        const prevDiff = Math.abs(getSnapHeight(prev) - targetHeight);
        const currDiff = Math.abs(getSnapHeight(curr) - targetHeight);
        return currDiff < prevDiff ? curr : prev;
      });

      animateToSnap(closestSnap);
    },
    [snapPoints, onClose, getSnapHeight, animateToSnap]
  );

  // Initialize sheet height when opened
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = "hidden";
      animateToSnap(initialSnap);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialSnap, animateToSnap]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="bottom-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={cn("bottom-sheet", className)}
            initial={{ height: 0 }}
            animate={controls}
            exit={{
              height: 0,
              transition: { type: "spring", ...MOBILE_SPRINGS.sheet },
            }}
            drag={allowDrag ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.3 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Bottom sheet"}
          >
            {/* Handle */}
            {showHandle && (
              <div
                className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
              >
                <motion.div
                  className="bottom-sheet-handle"
                  animate={{
                    width: isDragging ? 48 : 40,
                    opacity: isDragging ? 0.5 : 0.25,
                  }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="bottom-sheet-header flex items-center justify-between">
                {title && (
                  <h2 className="bottom-sheet-title">{title}</h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 -m-2 rounded-full hover:bg-foreground/5 transition-colors touch-feedback"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="bottom-sheet-content momentum-scroll hide-scrollbar px-6 pb-8">
              {children}
            </div>

            {/* Safe area spacer for home indicator */}
            <div className="mobile-safe-area-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// HOOK FOR MANAGING BOTTOM SHEET STATE
// ============================================================================

export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string | undefined>();

  const open = useCallback((node: React.ReactNode, sheetTitle?: string) => {
    setContent(node);
    setTitle(sheetTitle);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    content,
    title,
    open,
    close,
  };
}

export default BottomSheet;
