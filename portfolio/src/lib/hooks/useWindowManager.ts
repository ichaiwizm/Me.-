import { useRef, useState } from "react";
import type { WindowManagerHandle, WindowSpec } from "@/components/windows/WindowManager";

export function useWindowManager() {
  const wmRef = useRef<WindowManagerHandle>(null);
  const [windowCount, setWindowCount] = useState(0);

  function createWindow(spec: WindowSpec) {
    wmRef.current?.createWindow(spec);
    setWindowCount(c => c + 1);
  }

  function closeWindow(key: string) {
    wmRef.current?.closeWindow(key);
  }

  function minimizeWindow(key: string) {
    wmRef.current?.minimizeWindow(key);
  }

  function modifyWindow(key: string, html: string) {
    wmRef.current?.modifyWindow(key, html);
  }

  function resizeWindow(key: string, width?: number, height?: number) {
    wmRef.current?.resizeWindow(key, width, height);
  }

  function resetAll() {
    wmRef.current?.resetAll();
    setWindowCount(0);
  }

  return {
    wmRef,
    windowCount,
    createWindow,
    closeWindow,
    minimizeWindow,
    modifyWindow,
    resizeWindow,
    resetAll
  };
}
