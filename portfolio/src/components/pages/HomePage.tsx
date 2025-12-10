import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePersonalInfo } from "@/data/hooks";
import { useTypeWriter } from "@/components/ui/TypeWriter";
import { EASINGS } from "@/lib/constants/animation";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { useCallback } from "react";

// Floating shape component
function FloatingShape({
  className,
  delay = 0,
  duration = 6,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Interactive suggestion link component
function InlineSuggestion({
  children,
  prompt,
}: {
  children: React.ReactNode;
  prompt: string;
}) {
  const handleClick = useCallback(() => {
    // Dispatch event to send message to chat
    window.dispatchEvent(new CustomEvent("app:inline-suggestion", {
      detail: { prompt }
    }));
  }, [prompt]);

  return (
    <motion.button
      onClick={handleClick}
      className="relative inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-lg
                 bg-gradient-to-r from-primary/10 to-accent/10
                 border border-primary/20
                 text-primary font-medium
                 cursor-pointer transition-all duration-300
                 hover:from-primary/20 hover:to-accent/20 hover:border-primary/40
                 hover:shadow-lg hover:shadow-primary/10
                 group"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {/* Subtle glow effect on hover */}
      <motion.span
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      {/* Sparkle indicator */}
      <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
        ✨
      </span>
    </motion.button>
  );
}

export function HomePage() {
  const personalInfo = usePersonalInfo();
  const isMobile = useIsMobile();
  const { t } = useTranslation("pages");
  const { displayedText, isComplete } = useTypeWriter(personalInfo.fullName, 100, 800);

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5 + i * 0.15,
        duration: 0.6,
        ease: EASINGS.standard,
      },
    }),
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] flex items-center justify-center px-4 md:px-8 overflow-hidden">
      {/* Background decorative elements - reduced on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs - show only one on mobile */}
        <FloatingShape
          className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl"
          delay={0}
          duration={8}
        />
        {!isMobile && (
          <FloatingShape
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-accent/15 to-primary/10 blur-3xl"
            delay={2}
            duration={10}
          />
        )}

        {/* Geometric shapes - hidden on mobile */}
        {!isMobile && (
          <>
            <motion.div
              className="absolute top-20 right-[15%] w-24 h-24 border border-foreground/10 rounded-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-32 left-[10%] w-16 h-16 border border-primary/20 rounded-full"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/3 right-[8%] w-3 h-3 bg-accent/40 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-[20%] w-2 h-2 bg-primary/50 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </>
        )}

        {/* Subtle grid pattern - hidden on mobile */}
        {!isMobile && (
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        )}
      </div>

      {/* Main content */}
      <motion.div className="relative max-w-4xl mx-auto text-center space-y-8">
        {/* Name with typing effect */}
        <motion.h1
          className="text-monumental tracking-tight relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="gradient-text-animated">{displayedText}</span>
          <motion.span
            className={`inline-block w-[3px] h-[0.8em] bg-primary ml-1 align-middle ${
              isComplete ? "opacity-0" : "animate-typing-cursor"
            }`}
          />
        </motion.h1>

        {/* Title */}
        <motion.p
          className="text-title text-foreground/80"
          custom={0}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {personalInfo.title}
        </motion.p>

        {/* Subtitle with glassmorphism badge */}
        <motion.div
          custom={1}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-body text-foreground/70">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {personalInfo.subtitle}
          </span>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="flex items-center justify-center gap-4"
          custom={2}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-foreground/30" />
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-foreground/30" />
        </motion.div>

        {/* Interactive site description */}
        <motion.div
          className="text-body text-foreground/60 max-w-2xl mx-auto leading-relaxed text-center"
          custom={3}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="mb-3">
            {t("home.interactiveIntro.line1")}
            <InlineSuggestion prompt={t("home.interactiveIntro.suggestion1")}>
              {t("home.interactiveIntro.suggestionText1")}
            </InlineSuggestion>
            {t("home.interactiveIntro.line2")}
          </p>
          <p className="text-sm text-foreground/40">
            {t("home.interactiveIntro.line3")}
            <InlineSuggestion prompt={t("home.interactiveIntro.suggestion2")}>
              {t("home.interactiveIntro.suggestionText2")}
            </InlineSuggestion>
            {t("home.interactiveIntro.line4")}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
