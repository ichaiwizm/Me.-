import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSkills, useSkillCategories } from "@/data/hooks";
import { useState, useRef } from "react";
import type { Skill } from "@/data/skills";
import { FadeInView } from "@/components/animations";
import { EASINGS, SPRINGS } from "@/lib/constants/animation";
import {
  Code2,
  Database,
  Globe,
  Palette,
  Server,
  Wrench,
  Zap,
  Layers,
  Bot,
} from "lucide-react";

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  frontend: <Globe className="w-5 h-5" />,
  backend: <Server className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  devops: <Layers className="w-5 h-5" />,
  tools: <Wrench className="w-5 h-5" />,
  design: <Palette className="w-5 h-5" />,
  languages: <Code2 className="w-5 h-5" />,
  ai: <Bot className="w-5 h-5" />,
  other: <Zap className="w-5 h-5" />,
};

// Get color based on skill level - using CSS variables for theme consistency
function getLevelColor(level: number): {
  bg: string;
  fill: string;
  text: string;
  glow: string;
  cssVar: string;
} {
  if (level >= 90) {
    return {
      bg: "bg-[var(--color-level-expert)]/10",
      fill: "bg-[var(--color-level-expert)]",
      text: "text-[var(--color-level-expert)]",
      glow: "shadow-[var(--color-level-expert)]/20",
      cssVar: "var(--color-level-expert)",
    };
  }
  if (level >= 75) {
    return {
      bg: "bg-[var(--color-level-advanced)]/10",
      fill: "bg-[var(--color-level-advanced)]",
      text: "text-[var(--color-level-advanced)]",
      glow: "shadow-[var(--color-level-advanced)]/20",
      cssVar: "var(--color-level-advanced)",
    };
  }
  if (level >= 60) {
    return {
      bg: "bg-[var(--color-level-intermediate)]/10",
      fill: "bg-[var(--color-level-intermediate)]",
      text: "text-[var(--color-level-intermediate)]",
      glow: "shadow-[var(--color-level-intermediate)]/20",
      cssVar: "var(--color-level-intermediate)",
    };
  }
  if (level >= 40) {
    return {
      bg: "bg-[var(--color-level-fundamental)]/10",
      fill: "bg-[var(--color-level-fundamental)]",
      text: "text-[var(--color-level-fundamental)]",
      glow: "shadow-[var(--color-level-fundamental)]/20",
      cssVar: "var(--color-level-fundamental)",
    };
  }
  return {
    bg: "bg-[var(--color-level-beginner)]/10",
    fill: "bg-[var(--color-level-beginner)]",
    text: "text-[var(--color-level-beginner)]",
    glow: "shadow-[var(--color-level-beginner)]/20",
    cssVar: "var(--color-level-beginner)",
  };
}

function getLevelLabelKey(level: number): string {
  if (level >= 90) return "expert";
  if (level >= 75) return "advanced";
  if (level >= 60) return "intermediate";
  if (level >= 40) return "fundamental";
  return "beginner";
}

// Animated Progress Bar Component
function SkillBar({
  skill,
  index,
  t,
}: {
  skill: Skill;
  index: number;
  t: (key: string) => string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const colors = getLevelColor(skill.level);

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: EASINGS.standard,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative p-5 rounded-xl border border-foreground/10 bg-card/30 backdrop-blur-sm transition-all duration-300 ${
          isHovered ? `shadow-lg ${colors.glow}` : ""
        }`}
        whileHover={{ scale: 1.02, borderColor: "rgba(var(--primary), 0.2)" }}
        transition={{ type: "spring", ...SPRINGS.snappy }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-body font-semibold text-foreground/90">
            {skill.name}
          </span>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <span className={`text-tiny font-medium ${colors.text}`}>
              {t(`skills.levelLabels.${getLevelLabelKey(skill.level)}`)}
            </span>
            <motion.span
              className={`text-tiny font-bold ${colors.text}`}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ type: "spring", ...SPRINGS.bouncy }}
            >
              {skill.level}%
            </motion.span>
          </motion.div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative h-2 rounded-full bg-foreground/10 overflow-hidden">
          {/* Background glow */}
          <motion.div
            className={`absolute inset-0 rounded-full ${colors.bg}`}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Progress Fill */}
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${colors.fill}`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{
              duration: 1,
              delay: index * 0.05 + 0.3,
              ease: EASINGS.standard,
            }}
          />

          {/* Shimmer effect on hover - theme aware */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--shimmer-color)] to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Experience dots */}
        <div className="flex gap-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i < Math.ceil(skill.level / 20)
                  ? colors.fill
                  : "bg-foreground/10"
              }`}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05 + 0.5 + i * 0.1,
                type: "spring",
                ...SPRINGS.bouncy,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Category Section Component
function CategorySection({
  category,
  skills,
  index,
  categoryLabel,
  t,
}: {
  category: string;
  skills: Skill[];
  index: number;
  categoryLabel: string;
  t: (key: string) => string;
}) {
  const icon = categoryIcons[category] || categoryIcons.other;
  const isFirst = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isFirst ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: isFirst ? 0.2 : index * 0.1,
        ease: EASINGS.standard,
      }}
    >
      {/* Category Header */}
      <div className="mb-8 pb-4 border-b border-foreground/10 flex items-center gap-4">
        <motion.div
          className="p-3 rounded-xl bg-primary/10 text-primary"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {icon}
        </motion.div>
        <div>
          <h2 className="text-title font-bold">{categoryLabel}</h2>
          <p className="text-tiny text-foreground/50 mt-1">
            {skills.length} {skills.length > 1 ? t("skills.skills") : t("skills.skill")}
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, skillIndex) => (
          <SkillBar
            key={skill.name}
            skill={skill}
            index={skillIndex + index * 10}
            t={t}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsPage() {
  const { t } = useTranslation("pages");
  const skills = useSkills();
  const skillCategories = useSkillCategories();
  // Note: Mobile responsive grid (1 col) is already set in CategorySection

  // Group by category
  const byCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Calculate stats
  const totalSkills = skills.length;
  const avgLevel = Math.round(
    skills.reduce((sum, s) => sum + s.level, 0) / totalSkills
  );
  const expertSkills = skills.filter((s) => s.level >= 90).length;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeInView className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-6">
            <div>
              <motion.div
                className="text-small-caps text-primary/70 mb-4 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-8 h-px bg-primary/50" />
                {t("skills.header")}
              </motion.div>
              <h1 className="text-monumental tracking-tight">
                <span className="gradient-text">{t("skills.title")}</span>
              </h1>
            </div>

            {/* Stats cards - wrap on mobile */}
            <motion.div
              className="flex flex-wrap gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex-1 min-w-[80px] px-3 py-2 md:px-4 md:py-3 rounded-xl glass text-center">
                <div className="text-lg md:text-title font-bold text-primary">
                  {totalSkills}
                </div>
                <div className="text-[10px] md:text-tiny text-foreground/50">{t("skills.technologies")}</div>
              </div>
              <div className="flex-1 min-w-[80px] px-3 py-2 md:px-4 md:py-3 rounded-xl glass text-center">
                <div className="text-lg md:text-title font-bold text-[var(--color-success)]">
                  {expertSkills}
                </div>
                <div className="text-[10px] md:text-tiny text-foreground/50">{t("skills.expert")}</div>
              </div>
              <div className="flex-1 min-w-[80px] px-3 py-2 md:px-4 md:py-3 rounded-xl glass text-center">
                <div className="text-lg md:text-title font-bold text-[var(--color-info)]">
                  {avgLevel}%
                </div>
                <div className="text-[10px] md:text-tiny text-foreground/50">{t("skills.average")}</div>
              </div>
            </motion.div>
          </div>
          <p className="text-body-large text-foreground/60 max-w-2xl">
            {t("skills.subtitle")}
          </p>
        </FadeInView>

        {/* Skills by Category */}
        <div className="space-y-16">
          {Object.entries(byCategory).map(([category, categorySkills], index) => (
            <CategorySection
              key={category}
              category={category}
              skills={categorySkills}
              index={index}
              categoryLabel={skillCategories[category]?.label || category}
              t={t}
            />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-foreground/20" />
            <motion.div
              className="w-2 h-2 rounded-full bg-primary/50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-foreground/20" />
          </div>
          <p className="text-body text-foreground/50">
            {t("skills.alwaysLearning")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
