import { useTranslation } from "react-i18next";
import type { ThemeId, ThemeCategory } from "@/theme";
import { ThemeMenuItem } from "./ThemeMenuItem";

type Theme = {
  id: ThemeId;
  category: ThemeCategory;
};

type ThemeMenuProps = {
  themes: Theme[];
  activeThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
};

export function ThemeMenu({ themes, activeThemeId, onSelectTheme }: ThemeMenuProps) {
  const { t } = useTranslation("themes");

  return (
    <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
      <div className="mb-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("header")}
      </div>
      <div className="max-h-96 space-y-1 overflow-auto">
        {themes.map((theme) => (
          <ThemeMenuItem
            key={theme.id}
            id={theme.id}
            label={t(`themes.${theme.id}.label`)}
            description={t(`themes.${theme.id}.description`)}
            isActive={theme.id === activeThemeId}
            onClick={() => onSelectTheme(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}
