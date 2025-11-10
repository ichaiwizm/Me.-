import { PERSONAL_INFO } from "@/data/personal-info";

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {PERSONAL_INFO.fullName}
          </h1>
          <p className="text-2xl text-foreground/80 font-medium">
            {PERSONAL_INFO.title}
          </p>
          <p className="text-lg text-foreground/60">
            {PERSONAL_INFO.subtitle}
          </p>
        </div>

        {/* Bio courte */}
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          {PERSONAL_INFO.bio.short}
        </p>

        {/* Qualités */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {PERSONAL_INFO.qualities.map((quality) => (
            <div
              key={quality.trait}
              className="px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full"
            >
              <span className="text-lg">
                {quality.icon} {quality.trait}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
