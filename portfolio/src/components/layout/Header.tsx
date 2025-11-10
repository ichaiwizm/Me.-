import { ThemeSwitcher } from "@/components/theme-switcher";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageId } from "@/lib/commands/types";

type HeaderProps = {
  onReset?: () => void;
  currentPage?: PageId;
  onNavigate?: (page: PageId) => void;
};

export function Header({ onReset, currentPage = "accueil", onNavigate }: HeaderProps) {
  const handleNavClick = (e: React.MouseEvent, page: PageId) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  const navItems: { id: PageId; label: string }[] = [
    { id: "accueil", label: "Accueil" },
    { id: "projets", label: "Projets" },
    { id: "competences", label: "Compétences" },
    { id: "a-propos", label: "À propos" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Nom */}
          <div className="flex flex-col">
            <button
              onClick={(e) => handleNavClick(e, "accueil")}
              className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity text-left cursor-pointer"
            >
              Levana Wizman
            </button>
            <span className="text-xs text-foreground/60 tracking-wide">
              Développeuse Full-Stack
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? "text-foreground font-semibold border-b-2 border-foreground pb-1"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center gap-4">
            {onReset && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onReset}
                aria-label="Tout réinitialiser"
                title="Tout réinitialiser"
                className="text-foreground/60 hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
