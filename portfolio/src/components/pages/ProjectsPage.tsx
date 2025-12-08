import { PROJECTS } from "@/data/projects";
import { useState } from "react";

const categoryLabels: Record<string, string> = {
  formation: "Formation",
  personnel: "Personnel",
  alternance: "Alternance",
  academique: "Académique",
  professionnel: "Professionnel",
};

export function ProjectsPage() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Sort projects by date (newest first)
  const sortedProjects = [...PROJECTS].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-monumental tracking-tight">Projets</h1>
          <p className="text-body-large text-foreground/60 mt-6 max-w-2xl">
            Une sélection de mes réalisations en développement web
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {sortedProjects.map((project) => {
            const isHovered = hoveredProject === project.id;

            return (
              <div
                key={project.id}
                className="group border border-foreground/10 rounded-xl p-8 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg cursor-pointer"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-title font-bold leading-tight">
                      {project.title}
                    </h2>
                    {project.featured && (
                      <span className="text-tiny text-foreground/40 shrink-0">★</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-tiny text-foreground/50">
                    <span>{categoryLabels[project.category]}</span>
                    <span>•</span>
                    <span>{project.date}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-body text-foreground/70 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-tiny px-3 py-1 border border-foreground/20 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Highlights - Show on hover */}
                {project.highlights && (
                  <div
                    className={`border-t border-foreground/10 pt-4 transition-all duration-300 ${
                      isHovered
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="text-small-caps text-foreground/50 mb-3">
                      Points clés
                    </div>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="text-body text-foreground/60 flex items-start gap-2"
                        >
                          <span className="text-foreground/30">→</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-body text-foreground/50">
            Survole un projet pour voir les points clés
          </p>
        </div>
      </div>
    </div>
  );
}
