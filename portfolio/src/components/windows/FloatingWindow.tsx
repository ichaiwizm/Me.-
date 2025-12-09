import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SandboxedContent from "@/components/windows/SandboxedContent";

/**
 * FloatingWindow - Draggable window component
 *
 * Improvements:
 * - Touch targets of 44px (Apple guidelines)
 * - Viewport constraints to prevent off-screen positioning
 * - Better mobile support
 */

// macOS-style window buttons (tighter spacing)
const TOUCH_TARGET_SIZE = 28;
const BUTTON_VISUAL_SIZE = 12;
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
  isMaximized?: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
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
  isMaximized = false,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
}: Props) {
  const { t } = useTranslation("common");
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
      style={{
        position: "fixed",
        ...(isMaximized
          ? { inset: 20, width: "auto", height: "auto" }
          : { left: pos.x, top: pos.y, width, height }),
        zIndex,
        transition: isMaximized ? "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : undefined,
      }}
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
            className="flex items-center gap-1 group/buttons"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              aria-label={t("aria.closeWindow")}
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
              title={t("buttons.close")}
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
              aria-label={t("aria.minimizeWindow")}
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
              title={t("buttons.minimize")}
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

            {/* Maximize button */}
            <button
              aria-label={t("aria.expandWindow")}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMaximize(id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: TOUCH_TARGET_SIZE,
                height: TOUCH_TARGET_SIZE,
                padding: BUTTON_PADDING,
              }}
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer touch-manipulation"
              title={t("aria.expandWindow")}
            >
              <span
                className="rounded-full bg-green-500/80 hover:bg-green-500 transition-colors shadow-sm flex items-center justify-center relative"
                style={{ width: BUTTON_VISUAL_SIZE, height: BUTTON_VISUAL_SIZE }}
              >
                <svg
                  style={{ width: 7, height: 7 }}
                  className="text-green-900/80 opacity-0 group-hover/buttons:opacity-100 transition-opacity absolute"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  {isMaximized ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  )}
                </svg>
              </span>
            </button>
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
