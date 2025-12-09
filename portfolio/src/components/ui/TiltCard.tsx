import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { SPRINGS, MOBILE_SPRINGS } from "@/lib/constants/animation";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";

/**
 * TiltCard - A 3D tilt effect card component
 *
 * Creates an interactive card that tilts based on mouse position,
 * giving a perspective 3D effect. On mobile, falls back to tap feedback.
 */

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees (default: 8) */
  tiltAmount?: number;
  /** Perspective distance in pixels (default: 1000) */
  perspective?: number;
  /** Whether to disable the tilt effect */
  disabled?: boolean;
  /** Callback when card is tapped on mobile */
  onTap?: () => void;
}

export function TiltCard({
  children,
  className,
  tiltAmount = 8,
  perspective = 1000,
  disabled = false,
  onTap,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isPressed, setIsPressed] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = SPRINGS.gentle;

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]),
    springConfig
  );

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || isMobile || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Mobile: Use tap feedback instead of tilt
  if (isMobile || disabled) {
    return (
      <motion.div
        className={className}
        animate={{ scale: isPressed ? 0.98 : 1 }}
        transition={{ type: "spring", ...MOBILE_SPRINGS.press }}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => {
          setIsPressed(false);
          onTap?.();
        }}
        onTouchCancel={() => setIsPressed(false)}
        onClick={() => onTap?.()}
      >
        {children}
      </motion.div>
    );
  }

  // Desktop: 3D tilt effect
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;
