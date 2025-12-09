import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type VisualModeSwitcherButtonProps = {
  onClick: () => void;
  isOpen: boolean;
};

export function VisualModeSwitcherButton({ onClick, isOpen }: VisualModeSwitcherButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      aria-label={t("aria.visualModeSwitcher")}
      aria-expanded={isOpen}
      className="transition-transform hover:scale-105"
    >
      <Sparkles
        className={`h-4 w-4 ${isOpen ? "rotate-12 scale-110 transition-transform" : "transition-transform"}`}
      />
    </Button>
  );
}
