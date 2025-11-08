import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import FloatingWindow from "@/components/windows/FloatingWindow";
import { WindowDock } from "@/components/windows/WindowDock";

export type WindowSpec = { title: string; contentHtml: string; width?: number; height?: number; key?: string };
export type WindowManagerHandle = {
  createWindow: (spec: WindowSpec) => void;
  closeWindow: (key: string) => void;
  modifyWindow: (key: string, contentHtml: string) => void;
  resetAll: () => void;
};

type Item = {
  id: string; title: string; contentHtml: string; width: number; height: number; key?: string;
  x: number; y: number; z: number; minimized: boolean;
};

const makeId = () => `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;

export const WindowManager = forwardRef<WindowManagerHandle, {}>((_props, ref) => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextZ, setNextZ] = useState(1000);

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
        minimized: false
      }];
    });
  }, []);

  const closeWindow = useCallback((key: string) => {
    setItems(ws => ws.filter(i => i.key !== key));
  }, []);

  const modifyWindow = useCallback((key: string, contentHtml: string) => {
    setItems(ws => ws.map(i => i.key === key ? { ...i, contentHtml } : i));
  }, []);

  const resetAll = useCallback(() => {
    setItems([]);
    setNextZ(1000);
  }, []);

  useImperativeHandle(ref, () => ({ createWindow, closeWindow, modifyWindow, resetAll }), [createWindow, closeWindow, modifyWindow, resetAll]);

  const docked = useMemo(() => items.filter(w=>w.minimized), [items]);

  const handleRestore = useCallback((id: string) => {
    setItems(ws=>ws.map(i=>i.id===id?{...i,minimized:false}:i));
    bringFront(id);
  }, [bringFront]);

  return (
    <>
      <WindowDock items={docked} onRestore={handleRestore} />
      {items.filter(w=>!w.minimized).map(w => (
        <FloatingWindow key={w.id} id={w.id} title={w.title} zIndex={w.z}
          initialPos={{ x: w.x, y: w.y }} width={w.width} height={w.height} contentHtml={w.contentHtml}
          onClose={(id)=>setItems(ws=>ws.filter(i=>i.id!==id))}
          onMinimize={(id)=>setItems(ws=>ws.map(i=>i.id===id?{...i,minimized:true}:i))}
          onFocus={bringFront}
          onMove={(id,pos)=>setItems(ws=>ws.map(i=>i.id===id?{...i,x:pos.x,y:pos.y}:i))}
        />
      ))}
    </>
  );
});

export default WindowManager;

