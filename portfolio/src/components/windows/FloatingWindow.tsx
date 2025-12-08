import React, { useEffect, useRef, useState, useCallback } from "react";
import SandboxedContent from "@/components/windows/SandboxedContent";

/**
 * FloatingWindow - Draggable window component
 *
 * Improvements:
 * - Touch targets of 44px (Apple guidelines)
 * - Viewport constraints to prevent off-screen positioning
 * - Better mobile support
 */

// Minimum touch target size (Apple Human Interface Guidelines)
const TOUCH_TARGET_SIZE = 44;
const BUTTON_VISUAL_SIZE = 14;
const BUTTON_PADDING = (TOUCH_TARGET_SIZE - BUTTON_VISUAL_SIZE) / 2;

type Pos = { x: number; y: number };
type Props = {
  id: string;
  title: string;
  zIndex: number;
  initialPos: Pos;
  width?: number;
  height?: number;
  contentHtml: string;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove?: (id: string, pos: Pos) => void;
};

export function FloatingWindow({
  id,
  title,
  zIndex,
  initialPos,
  width = 480,
  height = 320,
  contentHtml,
  onClose,
  onMinimize,
  onFocus,
  onMove,
}: Props) {
  const [pos, setPos] = useState<Pos>(initialPos);
  const [dragOffset, setDragOffset] = useState<Pos | null>(null);
  const posRef = useRef<Pos>(pos);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  /**
   * Constrain position to keep window within viewport
   */
  const constrainToViewport = useCallback(
    (position: Pos): Pos => {
      const padding = 20; // Minimum visible area
      const maxX = window.innerWidth - padding;
      const maxY = window.innerHeight - padding;
      const minX = -width + padding;
      const minY = 0; // Don't allow going above viewport

      return {
        x: Math.max(minX, Math.min(position.x, maxX)),
        y: Math.max(minY, Math.min(position.y, maxY)),
      };
    },
    [width]
  );

  // Handle window resize to keep windows in viewport
  useEffect(() => {
    const handleResize = () => {
      setPos((prevPos) => constrainToViewport(prevPos));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [constrainToViewport]);

  // Drag handling
  useEffect(() => {
    if (!dragOffset) return;

    const onMoveDoc = (e: PointerEvent) => {
      const newPos = constrainToViewport({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
      setPos(newPos);
    };

    const onUp = () => {
      setDragOffset(null);
      onMove?.(id, posRef.current);
    };

    window.addEventListener("pointermove", onMoveDoc);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMoveDoc);
    };
  }, [dragOffset, id, onMove, constrainToViewport]);

  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  return (
    <div
      ref={rootRef}
      onMouseDown={() => onFocus(id)}
      style={{ position: "fixed", left: pos.x, top: pos.y, width, height, zIndex }}
      className="rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-br from-card via-card to-card/95 text-card-foreground overflow-hidden border border-primary/20 backdrop-blur-xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-300"
    >
      {/* Title bar */}
      <div
        className={`flex items-center justify-between bg-gradient-to-r from-primary/15 via-primary/10 to-transparent px-3 py-2 select-none border-b border-primary/20 backdrop-blur-sm ${
          dragOffset ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={startDrag}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {/* Window control buttons with 44px touch targets */}
          <div
            className="flex items-center gap-0 group/buttons"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              aria-label="Fermer la fenêtre"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose(id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: TOUCH_TARGET_SIZE,
                height: TOUCH_TARGET_SIZE,
                padding: BUTTON_PADDING,
              }}
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer touch-manipulation"
              title="Fermer"
            >
              <span
                className="rounded-full bg-red-500/80 hover:bg-red-500 transition-colors shadow-sm flex items-center justify-center relative"
                style={{ width: BUTTON_VISUAL_SIZE, height: BUTTON_VISUAL_SIZE }}
              >
                <svg
                  style={{ width: 8, height: 8 }}
                  className="text-red-900/80 opacity-0 group-hover/buttons:opacity-100 transition-opacity absolute"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={4}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>

            {/* Minimize button */}
            <button
              aria-label="Réduire la fenêtre"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMinimize(id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: TOUCH_TARGET_SIZE,
                height: TOUCH_TARGET_SIZE,
                padding: BUTTON_PADDING,
              }}
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer touch-manipulation"
              title="Réduire"
            >
              <span
                className="rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors shadow-sm flex items-center justify-center relative"
                style={{ width: BUTTON_VISUAL_SIZE, height: BUTTON_VISUAL_SIZE }}
              >
                <svg
                  style={{ width: 8, height: 8 }}
                  className="text-yellow-900/80 opacity-0 group-hover/buttons:opacity-100 transition-opacity absolute"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={4}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </span>
            </button>

            {/* Maximize button (decorative) */}
            <div
              style={{
                width: TOUCH_TARGET_SIZE,
                height: TOUCH_TARGET_SIZE,
                padding: BUTTON_PADDING,
              }}
              className="flex items-center justify-center"
              title="Agrandir (décoratif)"
            >
              <span
                className="rounded-full bg-green-500/80 transition-colors shadow-sm"
                style={{ width: BUTTON_VISUAL_SIZE, height: BUTTON_VISUAL_SIZE }}
              />
            </div>
          </div>

          {/* Title */}
          <span className="text-sm font-semibold truncate text-foreground/90 tracking-tight ml-1">
            {title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ height: "calc(100% - 48px)" }}
        className="bg-gradient-to-br from-background/30 to-background/10"
      >
        <SandboxedContent html={contentHtml} className="w-full h-full" />
      </div>
    </div>
  );
}

export default FloatingWindow;
