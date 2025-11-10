import { PROJECTS } from "@/data/projects";

export function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mes Projets
          </h1>
          <p className="text-lg text-foreground/60">
            Découvrez mes réalisations en développement web
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Title & Date */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                    ⭐ Phare
                  </span>
                )}
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm rounded-full">
                  {project.category === "formation" && "📚 Formation"}
                  {project.category === "personnel" && "💡 Personnel"}
                  {project.category === "alternance" && "💼 Alternance"}
                  {project.category === "academique" && "🎓 Académique"}
                </span>
              </div>

              {/* Description */}
              <p className="text-foreground/70 mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              {project.highlights && (
                <div className="mt-4 pt-4 border-t border-border">
                  <ul className="space-y-2">
                    {project.highlights.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="text-sm text-foreground/60 flex items-start">
                        <span className="text-purple-500 mr-2">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-foreground/40 mt-4 italic">{project.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
