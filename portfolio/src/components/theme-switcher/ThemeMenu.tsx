import type { ThemeId } from "@/theme";
import { ThemeMenuItem } from "./ThemeMenuItem";

type Theme = {
  id: ThemeId;
  label: string;
  description: string;
  category: "apaisant" | "energique" | "sophistique";
};

type ThemeMenuProps = {
  themes: Theme[];
  activeThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
};

export function ThemeMenu({ themes, activeThemeId, onSelectTheme }: ThemeMenuProps) {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
      <div className="mb-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Thèmes
      </div>
      <div className="max-h-96 space-y-1 overflow-auto">
        {themes.map((theme) => (
          <ThemeMenuItem
            key={theme.id}
            id={theme.id}
            label={theme.label}
            description={theme.description}
            isActive={theme.id === activeThemeId}
            onClick={() => onSelectTheme(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}

