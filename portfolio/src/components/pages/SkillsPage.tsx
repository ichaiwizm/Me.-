import { motion, useInView } from "framer-motion";
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";
import { useState, useRef } from "react";
import { FadeInView } from "@/components/animations";
import {
  Code2,
  Database,
  Globe,
  Palette,
  Server,
  Wrench,
  Zap,
  Layers,
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
  other: <Zap className="w-5 h-5" />,
};

// Get color based on skill level
function getLevelColor(level: number): {
  bg: string;
  fill: string;
  text: string;
  glow: string;
} {
  if (level >= 90) {
    return {
      bg: "bg-emerald-500/10",
      fill: "from-emerald-500 to-emerald-400",
      text: "text-emerald-500",
      glow: "shadow-emerald-500/20",
    };
  }
  if (level >= 75) {
    return {
      bg: "bg-blue-500/10",
      fill: "from-blue-500 to-blue-400",
      text: "text-blue-500",
      glow: "shadow-blue-500/20",
    };
  }
  if (level >= 60) {
    return {
      bg: "bg-violet-500/10",
      fill: "from-violet-500 to-violet-400",
      text: "text-violet-500",
      glow: "shadow-violet-500/20",
    };
  }
  if (level >= 40) {
    return {
      bg: "bg-amber-500/10",
      fill: "from-amber-500 to-amber-400",
      text: "text-amber-500",
      glow: "shadow-amber-500/20",
    };
  }
  return {
    bg: "bg-rose-500/10",
    fill: "from-rose-500 to-rose-400",
    text: "text-rose-500",
    glow: "shadow-rose-500/20",
  };
}

function getLevelLabel(level: number): string {
  if (level >= 90) return "Expert";
  if (level >= 75) return "Avancé";
  if (level >= 60) return "Intermédiaire";
  if (level >= 40) return "Fondamental";
  return "Débutant";
}

// Animated Progress Bar Component
function SkillBar({
  skill,
  index,
}: {
  skill: (typeof SKILLS)[0];
  index: number;
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
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative p-5 rounded-xl border border-foreground/10 bg-card/30 backdrop-blur-sm transition-all duration-300 ${
          isHovered ? `shadow-lg ${colors.glow}` : ""
        }`}
        whileHover={{ scale: 1.02, borderColor: "rgba(var(--primary), 0.2)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
              {getLevelLabel(skill.level)}
            </span>
            <motion.span
              className={`text-tiny font-bold ${colors.text}`}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${colors.fill}`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{
              duration: 1,
              delay: index * 0.05 + 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
                  ? `bg-gradient-to-r ${colors.fill}`
                  : "bg-foreground/10"
              }`}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05 + 0.5 + i * 0.1,
                type: "spring",
                stiffness: 400,
                damping: 17,
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
}: {
  category: string;
  skills: typeof SKILLS;
  index: number;
}) {
  const categoryInfo = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
  const icon = categoryIcons[category] || categoryIcons.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
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
          <h2 className="text-title font-bold">{categoryInfo.label}</h2>
          <p className="text-tiny text-foreground/50 mt-1">
            {skills.length} compétence{skills.length > 1 ? "s" : ""}
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
          />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsPage() {
  // Group by category
  const byCategory = SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof SKILLS>);

  // Calculate stats
  const totalSkills = SKILLS.length;
  const avgLevel = Math.round(
    SKILLS.reduce((sum, s) => sum + s.level, 0) / totalSkills
  );
  const expertSkills = SKILLS.filter((s) => s.level >= 90).length;

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
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
                Expertise
              </motion.div>
              <h1 className="text-monumental tracking-tight">
                <span className="gradient-text">Compétences</span>
              </h1>
            </div>

            {/* Stats cards */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="px-4 py-3 rounded-xl glass text-center">
                <div className="text-title font-bold text-primary">
                  {totalSkills}
                </div>
                <div className="text-tiny text-foreground/50">Technologies</div>
              </div>
              <div className="px-4 py-3 rounded-xl glass text-center">
                <div className="text-title font-bold text-emerald-500">
                  {expertSkills}
                </div>
                <div className="text-tiny text-foreground/50">Expert</div>
              </div>
              <div className="px-4 py-3 rounded-xl glass text-center">
                <div className="text-title font-bold text-blue-500">
                  {avgLevel}%
                </div>
                <div className="text-tiny text-foreground/50">Moyenne</div>
              </div>
            </motion.div>
          </div>
          <p className="text-body-large text-foreground/60 max-w-2xl">
            Technologies et outils que je maîtrise dans le développement web
            full-stack, de la conception à la mise en production.
          </p>
        </FadeInView>

        {/* Legend */}
        <motion.div
          className="mb-12 flex flex-wrap items-center gap-4 p-4 rounded-xl glass"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-tiny text-foreground/50 font-medium">
            Niveaux :
          </span>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Expert", level: 90, color: "bg-emerald-500" },
              { label: "Avancé", level: 75, color: "bg-blue-500" },
              { label: "Intermédiaire", level: 60, color: "bg-violet-500" },
              { label: "Fondamental", level: 40, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-tiny text-foreground/70">
                  {item.label} ({item.level}%+)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills by Category */}
        <div className="space-y-16">
          {Object.entries(byCategory).map(([category, skills], index) => (
            <CategorySection
              key={category}
              category={category}
              skills={skills}
              index={index}
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
            Toujours en apprentissage, toujours curieux de nouvelles technologies
          </p>
        </motion.div>
      </div>
    </div>
  );
}
