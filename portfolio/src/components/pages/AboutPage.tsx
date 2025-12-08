import { PERSONAL_INFO } from "@/data/personal-info";
import { EXPERIENCES } from "@/data/experience";

const typeLabels: Record<string, string> = {
  alternance: "Alternance",
  emploi: "Emploi",
  stage: "Stage",
  benevole: "Bénévolat",
  freelance: "Freelance",
};

export function AboutPage() {
  const sortedExperiences = [...EXPERIENCES].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-monumental tracking-tight mb-8">À propos</h1>
          <p className="text-headline text-foreground/70 leading-snug max-w-2xl">
            Builder obsessionnel le jour, bon vivant la nuit
          </p>
        </div>

        {/* Biography */}
        <div className="mb-20 space-y-8">
          <div className="border-l-2 border-foreground/20 pl-6">
            <h2 className="text-small-caps text-foreground/50 mb-3">Mon parcours</h2>
            <p className="text-body-large text-foreground/70 leading-relaxed">
              Ingénieur logiciel full-stack chez <strong>PhoneGS</strong> à Jérusalem, je conçois
              et développe des applications complètes — du front au backend en passant par l'infra.
              Après plusieurs années en freelance entre Paris et Israël, j'ai acquis une vision 360°
              du développement produit et une capacité à livrer vite et bien.
            </p>
          </div>

          <div className="border-l-2 border-foreground/20 pl-6">
            <h2 className="text-small-caps text-foreground/50 mb-3">Ma philosophie</h2>
            <p className="text-body-large text-foreground/70 leading-relaxed">
              Je suis passionné par l'IA et l'automatisation — je les intègre dans chaque projet
              pour aller plus vite et livrer mieux. Mais la vie c'est pas que du code : famille,
              voyages, pizza sur les toits avec vue sur la ville. C'est cet équilibre qui me garde
              créatif. Quand je code pas, je code quand même — je suis lancé et je m'arrête pas.
            </p>
          </div>
        </div>

        {/* Experiences */}
        <div className="mb-20">
          <h2 className="text-title font-bold mb-8 pb-3 border-b border-foreground/10">
            Expériences professionnelles
          </h2>
          <div className="space-y-8">
            {sortedExperiences.map((exp) => (
              <div
                key={exp.id}
                className="border border-foreground/10 rounded-lg p-6 hover:border-foreground/20 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-body-large font-bold text-foreground mb-1">
                      {exp.position}
                    </h3>
                    <div className="text-body text-foreground/60">
                      {exp.company} • {exp.location}
                    </div>
                  </div>
                  {exp.current && (
                    <span className="text-tiny bg-foreground/5 px-3 py-1 rounded-full shrink-0">
                      En cours
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-tiny text-foreground/50 mb-3">
                  <span>{typeLabels[exp.type]}</span>
                  <span>•</span>
                  <span>
                    {exp.startDate} — {exp.current ? "Présent" : exp.endDate}
                  </span>
                </div>

                {/* Description */}
                <p className="text-body text-foreground/70 leading-relaxed mb-4">
                  {exp.description}
                </p>

                {/* Technologies */}
                {exp.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-tiny border border-foreground/20 px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid md:grid-cols-2 gap-12 border-t border-foreground/10 pt-12">
          {/* Languages */}
          <div>
            <h3 className="text-small-caps text-foreground/50 mb-4">Langues</h3>
            <div className="space-y-2">
              {PERSONAL_INFO.languages.map((lang) => (
                <div key={lang.name} className="text-body text-foreground/70">
                  <strong>{lang.name}</strong> • {lang.level}
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-small-caps text-foreground/50 mb-4">Retrouvez-moi</h3>
            <div className="space-y-2">
              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-body text-foreground/70 hover:text-foreground transition-colors"
              >
                GitHub →
              </a>
              <a
                href={PERSONAL_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-body text-foreground/70 hover:text-foreground transition-colors"
              >
                LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
