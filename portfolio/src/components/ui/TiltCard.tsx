import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { SPRINGS } from "@/lib/constants/animation";

/**
 * TiltCard - A 3D tilt effect card component
 *
 * Creates an interactive card that tilts based on mouse position,
 * giving a perspective 3D effect.
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
}

export function TiltCard({
  children,
  className,
  tiltAmount = 8,
  perspective = 1000,
  disabled = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
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
    if (disabled || !ref.current) return;

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

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

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
