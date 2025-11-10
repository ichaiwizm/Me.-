import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";

export function SkillsPage() {
  // Grouper les compétences par catégorie
  const skillsByCategory = SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof SKILLS>);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mes Compétences
          </h1>
          <p className="text-lg text-foreground/60">
            Technologies et outils que je maîtrise
          </p>
        </div>

        {/* Skills by Category */}
        <div className="space-y-10">
          {Object.entries(skillsByCategory).map(([category, skills]) => {
            const { label, gradient } = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
            const avgLevel = Math.round(
              skills.reduce((sum, s) => sum + s.level, 0) / skills.length
            );

            return (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {label}
                  </h2>
                  <span className="text-sm text-foreground/50 font-medium">
                    {avgLevel}% moyenne
                  </span>
                </div>

                {/* Skills Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          {skill.icon && <span className="text-xl">{skill.icon}</span>}
                          {skill.name}
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            background: gradient,
                            width: `${skill.level}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-center">
          <p className="text-foreground/70">
            💡 Je suis toujours en apprentissage et j'adore découvrir de nouvelles technologies !
          </p>
        </div>
      </div>
    </div>
  );
}
