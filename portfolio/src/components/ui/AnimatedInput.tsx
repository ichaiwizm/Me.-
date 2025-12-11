import { motion } from "framer-motion";
import { useState, type ChangeEvent } from "react";
import { DURATIONS, EASINGS } from "@/lib/constants/animation";

/**
 * AnimatedInput - A text input with floating label animation
 *
 * Features:
 * - Floating label that moves up when focused or has value
 * - Focus glow effect using theme colors
 * - Support for both input and textarea
 * - Theme-aware styling via CSS variables
 */

export interface AnimatedInputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** If provided, renders a textarea with this many rows */
  rows?: number;
  /** Error message to display */
  error?: string;
  className?: string;
  /** Called when input receives focus */
  onFocus?: () => void;
  /** Called when input loses focus */
  onBlur?: () => void;
}

export function AnimatedInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  disabled,
  rows,
  error,
  className,
  onFocus,
  onBlur,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;
  const InputComponent = rows ? "textarea" : "input";

  return (
    <motion.div
      className={`relative ${className ?? ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATIONS.normal, ease: EASINGS.standard }}
    >
      {/* Floating label */}
      <motion.label
        htmlFor={name}
        className={`absolute left-4 pointer-events-none transition-all duration-200 ${
          isActive
            ? "top-2 text-tiny font-medium"
            : "top-4 text-body"
        } ${
          error
            ? "text-[var(--color-error)]"
            : isActive
            ? "text-primary"
            : "text-foreground/50"
        }`}
        animate={{
          y: isActive ? 0 : 4,
        }}
      >
        {label}
        {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
      </motion.label>

      {/* Input field */}
      <InputComponent
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full bg-card/30 backdrop-blur-sm border rounded-xl px-4 text-body transition-all duration-300 resize-none
          ${isActive ? "pt-7 pb-3" : "py-4"}
          ${
            error
              ? "border-[var(--color-error)]/50 ring-2 ring-[var(--color-error)]/20"
              : isFocused
              ? "border-primary/50 ring-4 ring-primary/10 shadow-lg shadow-primary/5"
              : "border-foreground/10 hover:border-foreground/20"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          focus:outline-none
        `}
        placeholder={isFocused ? placeholder : ""}
        required={required}
        rows={rows}
      />

      {/* Focus glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isFocused
            ? "0 0 30px -10px var(--primary)"
            : "0 0 0px 0px transparent",
        }}
        transition={{ duration: DURATIONS.normal }}
      />

      {/* Error message */}
      {error && (
        <motion.p
          id={`${name}-error`}
          className="mt-2 text-tiny text-[var(--color-error)]"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.fast }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

export default AnimatedInput;
