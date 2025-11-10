import { PERSONAL_INFO } from "@/data/personal-info";
import { EXPERIENCES } from "@/data/experience";

export function AboutPage() {
  const currentExperiences = EXPERIENCES.filter((exp) => exp.current);
  const pastExperiences = EXPERIENCES.filter((exp) => !exp.current);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            À propos de moi
          </h1>
          <p className="text-lg text-foreground/60">
            Mon parcours et mes expériences
          </p>
        </div>

        {/* Bio longue */}
        <div className="mb-12 p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
          <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
            {PERSONAL_INFO.bio.long}
          </p>
        </div>

        {/* Langues */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">🌍 Langues</h2>
          <div className="flex flex-wrap gap-4">
            {PERSONAL_INFO.languages.map((lang) => (
              <div
                key={lang.name}
                className="px-6 py-3 bg-card border border-border rounded-lg"
              >
                <span className="font-semibold text-foreground">{lang.name}</span>
                <span className="text-foreground/60 ml-2">- {lang.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expériences en cours */}
        {currentExperiences.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              💼 Expériences actuelles
            </h2>
            <div className="space-y-6">
              {currentExperiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 bg-card border-l-4 border-purple-500 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {exp.position}
                      </h3>
                      <p className="text-foreground/70 font-medium">{exp.company}</p>
                      <p className="text-sm text-foreground/50">{exp.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
                      En cours
                    </span>
                  </div>
                  <p className="text-foreground/70 mb-3">{exp.description}</p>
                  {exp.responsibilities && (
                    <ul className="space-y-1">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm text-foreground/60 flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs rounded"
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
        )}

        {/* Expériences passées */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            📚 Expériences passées
          </h2>
          <div className="space-y-6">
            {pastExperiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {exp.position}
                    </h3>
                    <p className="text-foreground/70 font-medium">{exp.company}</p>
                    <p className="text-sm text-foreground/50">
                      {exp.location} • {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-muted text-foreground/60 text-xs font-medium rounded-full">
                    {exp.type}
                  </span>
                </div>
                <p className="text-foreground/70 mb-3">{exp.description}</p>
                {exp.responsibilities && (
                  <ul className="space-y-1">
                    {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                      <li key={idx} className="text-sm text-foreground/60 flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-4 text-foreground">
            🔗 Retrouvez-moi en ligne
          </h3>
          <div className="flex justify-center gap-4">
            <a
              href={PERSONAL_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
            >
              🐙 GitHub
            </a>
            <a
              href={PERSONAL_INFO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
            >
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
