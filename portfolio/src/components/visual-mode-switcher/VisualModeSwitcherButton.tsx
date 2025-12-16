import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

type VisualModeSwitcherButtonProps = {
  onClick: () => void;
  isOpen: boolean;
};

const GLOW_INTERVAL_MS = 45000; // 45 seconds
const PROXIMITY_THRESHOLD = 80; // pixels

export function VisualModeSwitcherButton({ onClick, isOpen }: VisualModeSwitcherButtonProps) {
  const { t } = useTranslation("common");
  const [isGlowing, setIsGlowing] = useState(false);
  const [isNearCursor, setIsNearCursor] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Periodic glow effect (Feature 3a)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(true);
      // Remove glow class after animation completes
      setTimeout(() => setIsGlowing(false), 1500);
    }, GLOW_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Cursor proximity detection (Feature 3d)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
      Math.pow(e.clientX - buttonCenterX, 2) +
      Math.pow(e.clientY - buttonCenterY, 2)
    );

    setIsNearCursor(distance < PROXIMITY_THRESHOLD);
  }, []);

  useEffect(() => {
    // Only add listener on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Determine which glow class to apply (periodic takes precedence)
  const glowClass = isGlowing
    ? "animate-sparkles-glow"
    : isNearCursor && !isOpen
      ? "sparkles-proximity-glow"
      : "";

  return (
    <div ref={containerRef} className="inline-block">
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        aria-label={t("aria.visualModeSwitcher")}
        aria-expanded={isOpen}
        className={`transition-transform hover:scale-105 ${glowClass}`}
      >
        <Sparkles
          className={`h-4 w-4 ${isOpen ? "rotate-12 scale-110 transition-transform" : "transition-transform"}`}
        />
      </Button>
    </div>
  );
}
