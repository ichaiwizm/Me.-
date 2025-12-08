import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:from-primary/95 hover:to-primary active:shadow-md active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-white shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 focus-visible:ring-destructive/50 active:scale-[0.98]",
        outline:
          "border-2 border-foreground/20 bg-transparent shadow-sm hover:bg-foreground/5 hover:border-foreground/30 hover:shadow-md active:scale-[0.98] active:bg-foreground/10",
        secondary:
          "bg-secondary/80 text-secondary-foreground shadow-sm hover:bg-secondary hover:shadow-md active:scale-[0.98]",
        ghost:
          "hover:bg-foreground/5 hover:text-foreground active:bg-foreground/10 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-0 focus-visible:ring-offset-0",
        gradient:
          "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] text-white shadow-lg hover:shadow-xl hover:bg-right active:scale-[0.98] transition-all duration-500",
        glass:
          "bg-background/60 backdrop-blur-xl border border-foreground/10 hover:bg-background/80 hover:border-foreground/20 hover:shadow-lg active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg gap-1.5 px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Motion button component for animated interactions
const MotionButton = motion.button;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animated?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  animated = true,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }

  if (animated && variant !== "link") {
    return (
      <MotionButton
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...(props as HTMLMotionProps<"button">)}
      />
    );
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
