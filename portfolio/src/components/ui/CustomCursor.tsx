import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor - Optimized custom cursor component
 *
 * Improvements:
 * - Disabled on touch devices
 * - Respects prefers-reduced-motion
 * - Uses direct DOM manipulation (no React re-renders)
 * - Uses theme color via CSS variable
 * - Passive event listeners for performance
 */

export function CustomCursor() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for touch device - disable custom cursor
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    if (isTouchDevice) {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer" ||
        target.classList.contains("cursor-pointer");

      isHoveringRef.current = !!isInteractive;

      // Update element immediately for hover state
      if (elementRef.current) {
        const size = isHoveringRef.current ? 48 : 32;
        elementRef.current.style.width = `${size}px`;
        elementRef.current.style.height = `${size}px`;
      }
    };

    const animate = () => {
      if (!elementRef.current) {
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const { x: targetX, y: targetY } = targetRef.current;
      const { x: currentX, y: currentY } = positionRef.current;

      // Smooth interpolation (or instant if reduced motion)
      const factor = prefersReducedMotion ? 1 : 0.15;
      positionRef.current = {
        x: currentX + (targetX - currentX) * factor,
        y: currentY + (targetY - currentY) * factor,
      };

      // Direct DOM manipulation - no React re-render
      elementRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`;

      rafIdRef.current = requestAnimationFrame(animate);
    };

    // Add event listeners with passive option for performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Start animation loop
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isVisible]);

  // Don't render on touch devices (SSR-safe check)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    );
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={elementRef}
      className="custom-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        border: "2px solid var(--foreground)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: isVisible ? 0.5 : 0,
        transition: "opacity 0.3s ease, width 0.2s ease, height 0.2s ease",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}

export default CustomCursor;
