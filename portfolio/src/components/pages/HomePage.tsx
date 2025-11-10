import { PERSONAL_INFO } from "@/data/personal-info";
import { Zap, ClipboardList, Rocket, Target } from "lucide-react";

const iconMap = {
  Zap,
  ClipboardList,
  Rocket,
  Target,
};

export function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-8 mb-32">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {PERSONAL_INFO.fullName}
          </h1>
          <p className="text-2xl text-foreground/80 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {PERSONAL_INFO.title}
          </p>
          <p className="text-lg text-foreground/60" style={{ fontFamily: "'Inter', sans-serif" }}>
            {PERSONAL_INFO.subtitle}
          </p>
        </div>

        {/* Bio courte */}
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          {PERSONAL_INFO.bio.short}
        </p>

        {/* Qualités */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {PERSONAL_INFO.qualities.map((quality) => {
            const IconComponent = iconMap[quality.icon as keyof typeof iconMap];
            return (
              <div
                key={quality.trait}
                className="px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full flex items-center gap-2"
              >
                <IconComponent className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {quality.trait}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
