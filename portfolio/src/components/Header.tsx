import { ThemeSwitcher } from "@/components/theme-switcher";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onReset?: () => void;
};

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Nom */}
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              Lev
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#accueil"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Accueil
            </a>
            <a
              href="#projets"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Projets
            </a>
            <a
              href="#competences"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Compétences
            </a>
            <a
              href="#a-propos"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              À propos
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </a>
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

