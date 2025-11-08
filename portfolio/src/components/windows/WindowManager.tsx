import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import FloatingWindow from "@/components/windows/FloatingWindow";
import { WindowDock } from "@/components/windows/WindowDock";

export type WindowSpec = { title: string; contentHtml: string; width?: number; height?: number; key?: string };
export type WindowManagerHandle = {
  createWindow: (spec: WindowSpec) => void;
  closeWindow: (key: string) => void;
  modifyWindow: (key: string, contentHtml: string) => void;
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
    setItems((ws) => {
      const z = nextZ + 1; setNextZ(z);
      return ws.map(w => w.id === id ? { ...w, z } : w);
    });
  }, [nextZ]);

  const createWindow = useCallback((spec: WindowSpec) => {
    // If a key is provided and an item exists with that key, restore/focus it instead of creating a new one
    if (spec.key) {
      const existing = items.find(i => i.key === spec.key);
      if (existing) {
        setItems(ws => ws.map(i => i.id === existing.id ? { ...i, minimized: false } : i));
        const z = nextZ + 1; setNextZ(z);
        setItems(ws => ws.map(i => i.id === existing.id ? { ...i, z } : i));
        return;
      }
    }
    const id = makeId(); const width = spec.width ?? 480; const height = spec.height ?? 320;
    const offset = items.filter(i=>!i.minimized).length * 20;
    const x = 80 + (offset % 200); const y = 80 + (offset % 160);
    const z = nextZ + 1; setNextZ(z);
    setItems(ws => [...ws, { id, key: spec.key, title: spec.title, contentHtml: spec.contentHtml, width, height, x, y, z, minimized: false }]);
  }, [items, nextZ]);

  const closeWindow = useCallback((key: string) => {
    setItems(ws => ws.filter(i => i.key !== key));
  }, []);

  const modifyWindow = useCallback((key: string, contentHtml: string) => {
    setItems(ws => ws.map(i => i.key === key ? { ...i, contentHtml } : i));
  }, []);

  useImperativeHandle(ref, () => ({ createWindow, closeWindow, modifyWindow }), [createWindow, closeWindow, modifyWindow]);

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

