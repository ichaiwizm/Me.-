import { motion } from "framer-motion";
import { PERSONAL_INFO } from "@/data/personal-info";
import { EXPERIENCES } from "@/data/experience";
import { FadeInView } from "@/components/animations";
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

const typeLabels: Record<string, string> = {
  alternance: "Alternance",
  emploi: "Emploi",
  stage: "Stage",
  benevole: "Bénévolat",
  freelance: "Freelance",
};

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
}: {
  exp: (typeof EXPERIENCES)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.div
        className="group relative p-6 rounded-2xl glass overflow-hidden transition-all duration-300"
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
              className="flex items-center gap-1.5 text-tiny bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              En cours
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
            {typeLabels[exp.type]}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {exp.startDate} — {exp.current ? "Présent" : exp.endDate}
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
  const sortedExperiences = [...EXPERIENCES].sort((a, b) => {
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
            À propos
          </motion.div>
          <h1 className="text-monumental tracking-tight mb-6">
            <span className="gradient-text">Mon parcours</span>
          </h1>
          <p className="text-headline text-foreground/70 leading-snug max-w-2xl">
            Builder obsessionnel le jour, bon vivant la nuit
          </p>
        </FadeInView>

        {/* Qualities Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {PERSONAL_INFO.qualities.map((quality, i) => (
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
              <h2 className="text-small-caps text-foreground/50">Mon parcours</h2>
            </div>
            <p className="text-body text-foreground/70 leading-relaxed">
              Ingénieur logiciel full-stack chez <strong className="text-foreground">PhoneGS</strong> à Jérusalem, je conçois
              et développe des applications complètes — du front au backend en passant par l'infra.
              Après plusieurs années en freelance entre Paris et Israël, j'ai acquis une vision 360°
              du développement produit et une capacité à livrer vite et bien.
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
              <h2 className="text-small-caps text-foreground/50">Ma philosophie</h2>
            </div>
            <p className="text-body text-foreground/70 leading-relaxed">
              Je suis passionné par l'IA et l'automatisation — je les intègre dans chaque projet
              pour aller plus vite et livrer mieux. Mais la vie c'est pas que du code : famille,
              voyages, pizza sur les toits avec vue sur la ville. C'est cet équilibre qui me garde
              créatif.
            </p>
          </motion.div>
        </div>

        {/* Experiences */}
        <div className="mb-20">
          <FadeInView>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-title font-bold">Expériences professionnelles</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-foreground/20 to-transparent" />
            </div>
          </FadeInView>

          <div className="space-y-6">
            {sortedExperiences.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} />
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
              <h3 className="text-small-caps text-foreground/50">Langues</h3>
            </div>
            <div className="space-y-4">
              {PERSONAL_INFO.languages.map((lang, i) => (
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
              <h3 className="text-small-caps text-foreground/50">Retrouvez-moi</h3>
            </div>
            <div className="space-y-3">
              <motion.a
                href={PERSONAL_INFO.social.github}
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
                href={PERSONAL_INFO.social.linkedin}
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
