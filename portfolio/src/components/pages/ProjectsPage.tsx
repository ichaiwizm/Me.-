import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useProjects, type LocalizedProject } from "@/data/hooks";
import { useState } from "react";
import { FadeInView } from "@/components/animations";
import { TiltCard } from "@/components/ui/TiltCard";
import { EASINGS, SPRINGS } from "@/lib/constants/animation";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { ExternalLink, Github, Star, Calendar, Folder } from "lucide-react";

const categoryColors: Record<string, string> = {
  formation: "from-blue-500/20 to-blue-600/20",
  personnel: "from-purple-500/20 to-purple-600/20",
  alternance: "from-green-500/20 to-green-600/20",
  academique: "from-amber-500/20 to-amber-600/20",
  professionnel: "from-rose-500/20 to-rose-600/20",
};

// Project Card Component
function ProjectCard({
  project,
  index,
  t,
  isExpanded,
  onToggle,
  isMobile,
}: {
  project: LocalizedProject;
  index: number;
  t: (key: string) => string;
  isExpanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // On mobile, use expanded state from parent; on desktop, use hover state
  const showDetails = isMobile ? isExpanded : isHovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: EASINGS.standard,
      }}
    >
      <TiltCard onTap={isMobile ? onToggle : undefined}>
        <motion.div
          className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card/50 backdrop-blur-sm transition-all duration-500"
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          whileHover={!isMobile ? {
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            borderColor: "rgba(var(--primary), 0.3)",
          } : undefined}
          animate={isMobile && showDetails ? {
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            borderColor: "rgba(var(--primary), 0.3)",
          } : undefined}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Category gradient accent */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              categoryColors[project.category]
            } transition-opacity duration-500 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Content */}
          <div
            className="relative p-8"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 rounded-xl bg-primary/10 text-primary"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", ...SPRINGS.bouncy }}
                  >
                    <Folder className="w-5 h-5" />
                  </motion.div>
                  <h2 className="text-title font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h2>
                </div>
                {project.isCurrent ? (
                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30"
                    animate={{
                      boxShadow: showDetails
                        ? "0 0 20px rgba(var(--primary), 0.2)"
                        : "0 0 0px transparent",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-tiny text-primary font-medium">
                      {t("projects.currentProject")}
                    </span>
                  </motion.div>
                ) : project.featured && (
                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-warning-muted)] border border-[var(--color-warning)]/30"
                    animate={{
                      boxShadow: showDetails
                        ? "0 0 20px var(--color-warning-muted)"
                        : "0 0 0px transparent",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Star className="w-3 h-3 text-[var(--color-warning)] fill-[var(--color-warning)]" />
                    <span className="text-tiny text-[var(--color-warning)] font-medium">
                      {t("projects.featured")}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-3 text-tiny text-foreground/50">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-foreground/5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${categoryColors[
                      project.category
                    ].replace("/20", "/60")}`}
                  />
                  {t(`projects.categories.${project.category}`)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {project.date}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-body text-foreground/70 leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Action links - Always visible, prominent */}
            {(project.githubUrl || project.liveUrl) && (
              <div className="flex items-center gap-3 mb-6">
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-small text-primary font-medium hover:bg-primary/20 hover:border-primary/50 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("projects.viewProject")}
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-small text-foreground/70 font-medium hover:text-foreground hover:bg-foreground/10 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-4 h-4" />
                    {t("projects.code")}
                  </motion.a>
                )}
              </div>
            )}

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="text-tiny px-3 py-1.5 rounded-full glass text-foreground/70 font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(var(--primary), 0.1)",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Highlights - Animated reveal */}
            <motion.div
              className="border-t border-foreground/10 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: showDetails ? "auto" : 0,
                opacity: showDetails ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {project.highlights && (
                <div className="pt-4">
                  <div className="text-small-caps text-foreground/40 mb-3 flex items-center gap-2">
                    <div className="w-8 h-px bg-foreground/20" />
                    {t("projects.highlights")}
                  </div>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, i) => (
                      <motion.li
                        key={i}
                        className="text-body text-foreground/60 flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: showDetails ? 1 : 0,
                          x: showDetails ? 0 : -10,
                        }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="text-primary mt-1">→</span>
                        <span>{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: showDetails
                ? "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--primary), 0.06), transparent 40%)"
                : "transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </TiltCard>
    </motion.div>
  );
}

export function ProjectsPage() {
  const { t } = useTranslation("pages");
  const projects = useProjects();
  const isMobile = useIsMobile();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Use projects in their defined order (no sorting)
  const sortedProjects = projects;

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeInView className="mb-20">
          <div className="flex items-end justify-between gap-8 mb-6">
            <div>
              <motion.div
                className="text-small-caps text-primary/70 mb-4 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-8 h-px bg-primary/50" />
                {t("projects.header")}
              </motion.div>
              <h1 className="text-monumental tracking-tight">
                <span className="gradient-text">{t("projects.title")}</span>
              </h1>
            </div>
            <motion.div
              className="hidden md:block text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-body text-foreground/50">
                {sortedProjects.length} {t("projects.projectCount")}
              </p>
            </motion.div>
          </div>
          <p className="text-body-large text-foreground/60 max-w-2xl">
            {t("projects.subtitle")}
          </p>
        </FadeInView>

        {/* Projects Grid */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {sortedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              t={t}
              isExpanded={expandedId === project.id}
              onToggle={() => toggleExpanded(project.id)}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-20 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-foreground/20" />
          <p className="text-tiny text-foreground/40 uppercase tracking-widest">
            {isMobile ? t("projects.tapToExplore") : t("projects.hoverToExplore")}
          </p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-foreground/20" />
        </motion.div>
      </div>
    </div>
  );
}
