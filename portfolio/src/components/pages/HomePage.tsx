import { PERSONAL_INFO } from "@/data/personal-info";

export function HomePage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-8 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-monumental tracking-tight">
          {PERSONAL_INFO.fullName}
        </h1>
        <p className="text-title text-foreground/70">
          {PERSONAL_INFO.title}
        </p>
        <p className="text-body text-foreground/50">
          {PERSONAL_INFO.subtitle}
        </p>
      </div>
    </div>
  );
}
