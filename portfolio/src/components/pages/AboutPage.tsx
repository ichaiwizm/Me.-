import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePersonalInfo, useExperiences, type LocalizedExperience } from "@/data/hooks";
import { FadeInView } from "@/components/animations";
import { EASINGS, SPRINGS } from "@/lib/constants/animation";
import {
  Briefcase,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Languages,
  Sparkles,
  Heart,
  Rocket,
  Smile,
  Zap,
} from "lucide-react";

const typeColors: Record<string, string> = {
  alternance: "from-blue-500 to-blue-600",
  emploi: "from-emerald-500 to-emerald-600",
  stage: "from-violet-500 to-violet-600",
  benevole: "from-rose-500 to-rose-600",
  freelance: "from-amber-500 to-amber-600",
};

const qualityIcons: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
};

// Experience Card Component
function ExperienceCard({
  exp,
  index,
  t,
}: {
  exp: LocalizedExperience;
  index: number;
  t: (key: string) => string;
}) {
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
      <motion.div
        className="group relative p-6 rounded-2xl glass overflow-hidden transition-all duration-300"
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", ...SPRINGS.snappy }}
      >
        {/* Type indicator bar */}
        <div
          className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${
            typeColors[exp.type]
          } rounded-l-2xl`}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <motion.div
              className="p-3 rounded-xl bg-primary/10 text-primary"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Briefcase className="w-5 h-5" />
            </motion.div>
            <div>
              <h3 className="text-body-large font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {exp.position}
              </h3>
              <div className="flex items-center gap-2 text-body text-foreground/60">
                <span className="font-medium">{exp.company}</span>
                <span className="text-foreground/30">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {exp.location}
                </span>
              </div>
            </div>
          </div>
          {exp.current && (
            <motion.span
              className="flex items-center gap-1.5 text-tiny bg-[var(--color-success-muted)] text-[var(--color-success)] px-3 py-1.5 rounded-full border border-[var(--color-success)]/20"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              {t("about.current")}
            </motion.span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-tiny text-foreground/50 mb-4 ml-16">
          <span
            className={`px-2 py-1 rounded-md bg-gradient-to-r ${
              typeColors[exp.type]
            } bg-opacity-10 text-foreground/70`}
          >
            {t(`about.experienceTypes.${exp.type}`)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {exp.startDate} — {exp.current ? t("about.present") : exp.endDate}
          </span>
        </div>

        {/* Description */}
        <p className="text-body text-foreground/70 leading-relaxed mb-4 ml-16">
          {exp.description}
        </p>

        {/* Technologies */}
        {exp.technologies && (
          <div className="flex flex-wrap gap-2 ml-16">
            {exp.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                className="text-tiny px-3 py-1.5 rounded-full glass text-foreground/70 font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function AboutPage() {
  const { t } = useTranslation("pages");
  const personalInfo = usePersonalInfo();
  const experiences = useExperiences();
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <FadeInView className="mb-16">
          <motion.div
            className="text-small-caps text-primary/70 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-8 h-px bg-primary/50" />
            {t("about.header")}
          </motion.div>
          <h1 className="text-monumental tracking-tight mb-6">
            <span className="gradient-text">{t("about.title")}</span>
          </h1>
          <p className="text-headline text-foreground/70 leading-snug max-w-2xl">
            {t("about.subtitle")}
          </p>
        </FadeInView>

        {/* Qualities Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {personalInfo.qualities.map((quality, i) => (
            <motion.div
              key={quality.trait}
              className="p-4 rounded-xl glass text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3">
                {qualityIcons[quality.icon]}
              </div>
              <div className="text-body font-semibold">{quality.trait}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Biography */}
        <div className="mb-20 grid md:grid-cols-2 gap-6">
          <motion.div
            className="p-6 rounded-2xl glass"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-small-caps text-foreground/50">{t("about.journey")}</h2>
            </div>
            <p className="text-body text-foreground/70 leading-relaxed">
              {t("about.journeyText")}
            </p>
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl glass"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-small-caps text-foreground/50">{t("about.philosophy")}</h2>
            </div>
            <p className="text-body text-foreground/70 leading-relaxed">
              {t("about.philosophyText")}
            </p>
          </motion.div>
        </div>

        {/* Experiences */}
        <div className="mb-20">
          <FadeInView>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-title font-bold">{t("about.experiences")}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-foreground/20 to-transparent" />
            </div>
          </FadeInView>

          <div className="space-y-6">
            {sortedExperiences.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} t={t} />
            ))}
          </div>
        </div>

        {/* Footer Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Languages */}
          <div className="p-6 rounded-2xl glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Languages className="w-4 h-4" />
              </div>
              <h3 className="text-small-caps text-foreground/50">{t("about.languages")}</h3>
            </div>
            <div className="space-y-4">
              {personalInfo.languages.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-body font-medium">{lang.name}</span>
                  <span className="text-tiny px-3 py-1 rounded-full bg-foreground/5 text-foreground/60">
                    {lang.level}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="p-6 rounded-2xl glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-small-caps text-foreground/50">{t("about.findMe")}</h3>
            </div>
            <div className="space-y-3">
              <motion.a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Github className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
                <span className="text-body text-foreground/70 group-hover:text-foreground transition-colors">
                  GitHub
                </span>
                <span className="ml-auto text-foreground/40 group-hover:text-primary transition-colors">
                  →
                </span>
              </motion.a>
              <motion.a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Linkedin className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
                <span className="text-body text-foreground/70 group-hover:text-foreground transition-colors">
                  LinkedIn
                </span>
                <span className="ml-auto text-foreground/40 group-hover:text-primary transition-colors">
                  →
                </span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
