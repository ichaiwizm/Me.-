import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * TypeWriter - Animated typing effect component
 *
 * Creates a typewriter-style text animation that types out characters
 * one by one with a blinking cursor.
 */

export interface TypeWriterProps {
  /** The text to type out */
  text: string;
  /** Speed in milliseconds per character (default: 80) */
  speed?: number;
  /** Delay before starting in milliseconds (default: 500) */
  delay?: number;
  /** Callback when typing is complete */
  onComplete?: () => void;
  /** Whether to show the blinking cursor (default: true) */
  cursor?: boolean;
  /** Character to use for cursor (default: "|") */
  cursorChar?: string;
  /** Additional className for the container */
  className?: string;
  /** ClassName for the cursor */
  cursorClassName?: string;
}

/**
 * Hook for typing effect logic
 */
export function useTypeWriter(
  text: string,
  speed: number = 80,
  delay: number = 500,
  onComplete?: () => void
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const reset = useCallback(() => {
    setDisplayedText("");
    setIsComplete(false);
    setIsStarted(false);
  }, []);

  useEffect(() => {
    reset();

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
      let i = 0;

      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete, reset]);

  return { displayedText, isComplete, isStarted, reset };
}

export function TypeWriter({
  text,
  speed = 80,
  delay = 500,
  onComplete,
  cursor = true,
  cursorChar = "|",
  className,
  cursorClassName,
}: TypeWriterProps) {
  const { displayedText, isComplete, isStarted } = useTypeWriter(
    text,
    speed,
    delay,
    onComplete
  );

  return (
    <span className={className}>
      {displayedText}
      {cursor && (
        <motion.span
          className={`inline-block ml-0.5 ${cursorClassName ?? ""}`}
          animate={{
            opacity: isComplete ? 0 : [1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: isComplete ? 0 : Infinity,
            repeatType: "reverse",
          }}
          aria-hidden="true"
        >
          {isStarted && cursorChar}
        </motion.span>
      )}
    </span>
  );
}

export default TypeWriter;
