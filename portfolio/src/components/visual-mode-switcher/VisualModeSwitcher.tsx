import React from "react";
import { useVisualMode } from "@/visual-mode";
import { VisualModeSwitcherButton } from "./VisualModeSwitcherButton";
import { VisualModeMenu } from "./VisualModeMenu";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import type { VisualModeId } from "@/visual-mode";

export function VisualModeSwitcher() {
  const { visualModeId, setVisualModeId, modes } = useVisualMode();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelectMode = (id: VisualModeId) => {
    setVisualModeId(id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <VisualModeSwitcherButton onClick={() => setIsOpen((v) => !v)} isOpen={isOpen} />
      {isOpen && (
        <VisualModeMenu
          modes={modes}
          activeModeId={visualModeId}
          onSelectMode={handleSelectMode}
        />
      )}
    </div>
  );
}
