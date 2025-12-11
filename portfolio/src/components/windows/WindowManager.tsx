import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import FloatingWindow from "@/components/windows/FloatingWindow";
import { WindowDock } from "@/components/windows/WindowDock";
import { BottomSheet } from "@/components/mobile/BottomSheet";
import SandboxedContent from "@/components/windows/SandboxedContent";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

export type WindowSpec = { title: string; contentHtml: string; width?: number; height?: number; key?: string };
export type WindowManagerHandle = {
  createWindow: (spec: WindowSpec) => void;
  closeWindow: (key: string) => void;
  minimizeWindow: (key: string) => void;
  modifyWindow: (key: string, contentHtml: string) => void;
  resizeWindow: (key: string, width?: number, height?: number) => void;
  resetAll: () => void;
};

type Item = {
  id: string; title: string; contentHtml: string; width: number; height: number; key?: string;
  x: number; y: number; z: number; minimized: boolean; maximized: boolean;
};

const makeId = () => `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;

type WindowManagerProps = {
  showDock?: boolean;
  mobileMode?: boolean;
  onMinimizedCountChange?: (count: number) => void;
};

export const WindowManager = forwardRef<WindowManagerHandle, WindowManagerProps>(({ showDock = true, mobileMode = false, onMinimizedCountChange }, ref) => {
  const [items, setItems] = useState<Item[]>([]);
  const [, setNextZ] = useState(1000);
  const { trackWindow } = useAnalytics();

  const bringFront = useCallback((id: string) => {
    // Use functional updates to avoid stale closure issues
    setNextZ(z => {
      const newZ = z + 1;
      setItems((ws) => ws.map(w => w.id === id ? { ...w, z: newZ } : w));
      return newZ;
    });
  }, []);

  const createWindow = useCallback((spec: WindowSpec) => {
    // Use functional updates to avoid race conditions
    setItems(ws => {
      // Check if a window with this key already exists
      if (spec.key) {
        const existing = ws.find(i => i.key === spec.key);
        if (existing) {
          // Restore and bring to front
          setNextZ(z => {
            const newZ = z + 1;
            setItems(items => items.map(i =>
              i.id === existing.id
                ? { ...i, minimized: false, z: newZ }
                : i
            ));
            return newZ;
          });
          // Track window restore
          trackWindow('create', { windowKey: spec.key, windowTitle: spec.title });
          // Return current state unchanged (will be updated by setNextZ callback)
          return ws;
        }
      }

      // Create new window
      const id = makeId();
      const width = spec.width ?? 480;
      const height = spec.height ?? 320;
      const offset = ws.filter(i => !i.minimized).length * 20;
      const x = 80 + (offset % 200);
      const y = 80 + (offset % 160);

      // Update z-index and add window
      setNextZ(z => z + 1);
      const newZ = Date.now(); // Use timestamp as temporary z-index

      // Track window creation
      trackWindow('create', { windowKey: spec.key || id, windowTitle: spec.title });

      return [...ws, {
        id,
        key: spec.key,
        title: spec.title,
        contentHtml: spec.contentHtml,
        width,
        height,
        x,
        y,
        z: newZ,
        minimized: false,
        maximized: false
      }];
    });
  }, [trackWindow]);

  const closeWindow = useCallback((key: string) => {
    setItems(ws => {
      const window = ws.find(i => i.key === key);
      if (window) {
        trackWindow('close', { windowKey: key, windowTitle: window.title });
      }
      return ws.filter(i => i.key !== key);
    });
  }, [trackWindow]);

  const minimizeWindow = useCallback((key: string) => {
    setItems(ws => {
      const window = ws.find(i => i.key === key);
      if (window) {
        trackWindow('minimize', { windowKey: key, windowTitle: window.title });
      }
      return ws.map(i => i.key === key ? { ...i, minimized: true } : i);
    });
  }, [trackWindow]);

  const modifyWindow = useCallback((key: string, contentHtml: string) => {
    setItems(ws => ws.map(i => i.key === key ? { ...i, contentHtml } : i));
  }, []);

  const resetAll = useCallback(() => {
    setItems([]);
    setNextZ(1000);
  }, []);

  const resizeWindow = useCallback((key: string, width?: number, height?: number) => {
    setItems(ws => ws.map(i => {
      if (i.key !== key) return i;
      const nextWidth = width !== undefined ? Math.max(100, Math.min(2000, width)) : i.width;
      const nextHeight = height !== undefined ? Math.max(100, Math.min(1500, height)) : i.height;
      return { ...i, width: nextWidth, height: nextHeight };
    }));
  }, []);

  useImperativeHandle(ref, () => ({ createWindow, closeWindow, minimizeWindow, modifyWindow, resizeWindow, resetAll }), [createWindow, closeWindow, minimizeWindow, modifyWindow, resizeWindow, resetAll]);

  const docked = useMemo(() => items.filter(w=>w.minimized), [items]);

  // Notify parent of minimized count changes
  useEffect(() => {
    onMinimizedCountChange?.(docked.length);
  }, [docked.length, onMinimizedCountChange]);

  const handleRestore = useCallback((id: string) => {
    setItems(ws => {
      const window = ws.find(i => i.id === id);
      if (window) {
        trackWindow('create', { windowKey: window.key || id, windowTitle: window.title });
      }
      return ws.map(i => i.id === id ? { ...i, minimized: false } : i);
    });
    bringFront(id);
  }, [bringFront, trackWindow]);

  const toggleMaximize = useCallback((id: string) => {
    setItems(ws => {
      const window = ws.find(i => i.id === id);
      if (window) {
        trackWindow('maximize', {
          windowKey: window.key || id,
          windowTitle: window.title,
          maximizeAction: window.maximized ? 'restore' : 'maximize'
        });
      }
      return ws.map(i => i.id === id ? { ...i, maximized: !i.maximized } : i);
    });
    bringFront(id);
  }, [bringFront, trackWindow]);

  return (
    <>
      {/* Desktop: WindowDock and FloatingWindows */}
      {!mobileMode && (
        <>
          {showDock && <WindowDock items={docked} onRestore={handleRestore} />}
          {items.filter(w=>!w.minimized).map(w => (
            <FloatingWindow key={w.id} id={w.id} title={w.title} zIndex={w.z}
              initialPos={{ x: w.x, y: w.y }} width={w.width} height={w.height} contentHtml={w.contentHtml}
              isMaximized={w.maximized}
              onClose={(id)=>{
                trackWindow('close', { windowKey: w.key || id, windowTitle: w.title });
                setItems(ws=>ws.filter(i=>i.id!==id));
              }}
              onMinimize={(id)=>{
                trackWindow('minimize', { windowKey: w.key || id, windowTitle: w.title });
                setItems(ws=>ws.map(i=>i.id===id?{...i,minimized:true}:i));
              }}
              onMaximize={toggleMaximize}
              onFocus={bringFront}
              onMove={(id,pos)=>setItems(ws=>ws.map(i=>i.id===id?{...i,x:pos.x,y:pos.y}:i))}
            />
          ))}
        </>
      )}

      {/* Mobile: BottomSheets instead of FloatingWindows */}
      {mobileMode && items.filter(w=>!w.minimized).map(w => (
        <BottomSheet
          key={w.id}
          isOpen={true}
          onClose={() => {
            trackWindow('close', { windowKey: w.key || w.id, windowTitle: w.title });
            setItems(ws => ws.filter(i => i.id !== w.id));
          }}
          title={w.title}
          snapPoints={["half", "full"]}
          initialSnap="half"
        >
          <SandboxedContent html={w.contentHtml} className="w-full h-full" />
        </BottomSheet>
      ))}
    </>
  );
});

export default WindowManager;

