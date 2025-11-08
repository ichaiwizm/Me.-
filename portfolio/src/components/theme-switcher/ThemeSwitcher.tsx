import React from "react";
import { useTheme } from "@/theme";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";
import { ThemeMenu } from "./ThemeMenu";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export function ThemeSwitcher() {
  const { themeId, setThemeId, themes } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelectTheme = (id: typeof themeId) => {
    setThemeId(id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <ThemeSwitcherButton onClick={() => setIsOpen((v) => !v)} isOpen={isOpen} />
      {isOpen && (
        <ThemeMenu themes={themes} activeThemeId={themeId} onSelectTheme={handleSelectTheme} />
      )}
    </div>
  );
}

