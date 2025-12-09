import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { VisualModeId, VisualModeDef } from "@/visual-mode";
import { VisualModeMenuItem } from "./VisualModeMenuItem";

type VisualModeMenuProps = {
  modes: VisualModeDef[];
  activeModeId: VisualModeId | null;
  onSelectMode: (id: VisualModeId) => void;
};

export function VisualModeMenu({ modes, activeModeId, onSelectMode }: VisualModeMenuProps) {
  const { t } = useTranslation("common");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-foreground/10 bg-popover p-2 text-popover-foreground shadow-xl glass"
      >
        {/* Header */}
        <div className="mb-2 px-2 py-1 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("visualModes.header")}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
            {t("visualModes.experimental")}
          </span>
        </div>

        {/* Mode list */}
        <div className="space-y-1">
          {modes.map((mode) => (
            <VisualModeMenuItem
              key={mode.id}
              id={mode.id}
              label={t(mode.labelKey)}
              description={t(mode.descriptionKey)}
              isActive={mode.id === activeModeId}
              onClick={() => onSelectMode(mode.id)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div className="mt-2 pt-2 border-t border-foreground/5 px-2">
          <p className="text-[10px] text-muted-foreground/70 text-center">
            {t("visualModes.hint")}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
