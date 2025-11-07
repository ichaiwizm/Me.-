import React, { useEffect, useRef, useState } from "react";
import SandboxedContent from "@/components/windows/SandboxedContent";

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

export function FloatingWindow({ id, title, zIndex, initialPos, width = 480, height = 320, contentHtml, onClose, onMinimize, onFocus, onMove }: Props) {
  const [pos, setPos] = useState<Pos>(initialPos);
  const [dragOffset, setDragOffset] = useState<Pos | null>(null);
  const posRef = useRef<Pos>(pos);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { posRef.current = pos; }, [pos]);

  useEffect(() => {
    if (!dragOffset) return;
    const onMoveDoc = (e: PointerEvent) => setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    const onUp = () => { setDragOffset(null); onMove?.(id, posRef.current); };
    window.addEventListener("pointermove", onMoveDoc);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => { window.removeEventListener("pointermove", onMoveDoc); };
  }, [dragOffset, id, onMove]);


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
      <div
        className={`flex items-center justify-between bg-gradient-to-r from-primary/15 via-primary/10 to-transparent px-5 py-3 select-none border-b border-primary/20 backdrop-blur-sm ${dragOffset ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={startDrag}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex gap-2 group/buttons" onPointerDown={(e) => e.stopPropagation()}>
            <button
              aria-label="Close"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(id); }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ width: '12px', height: '12px', minWidth: '12px', minHeight: '12px' }}
              className="p-0 border-0 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors shadow-sm cursor-pointer relative"
              title="Fermer"
            >
              <svg style={{ width: '7px', height: '7px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className="text-red-900/80 opacity-0 group-hover/buttons:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              aria-label="Minimize"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMinimize(id); }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ width: '12px', height: '12px', minWidth: '12px', minHeight: '12px' }}
              className="p-0 border-0 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors shadow-sm cursor-pointer relative"
              title="Réduire"
            >
              <svg style={{ width: '7px', height: '7px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className="text-yellow-900/80 opacity-0 group-hover/buttons:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <div style={{ width: '12px', height: '12px', minWidth: '12px', minHeight: '12px' }} className="rounded-full bg-green-500/80 hover:bg-green-500 transition-colors shadow-sm flex-shrink-0" title="Agrandir (décoratif)" />
          </div>
          <span className="text-sm font-semibold truncate text-foreground/90 tracking-tight">{title}</span>
        </div>
      </div>
      <div style={{ height: "calc(100% - 56px)" }} className="bg-gradient-to-br from-background/30 to-background/10">
        <SandboxedContent html={contentHtml} className="w-full h-full" />
      </div>
    </div>
  );
}

export default FloatingWindow;

