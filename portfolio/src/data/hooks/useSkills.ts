import { useTranslation } from "react-i18next";
import { SKILLS, SKILL_CATEGORIES, type Skill } from "../skills";

export type LocalizedSkillCategory = {
  label: string;
  color: string;
  gradient: string;
};

export function useSkills(): Skill[] {
  // Skills names (React, Node.js, etc.) don't need translation
  return SKILLS;
}

export function useSkillCategories(): Record<string, LocalizedSkillCategory> {
  const { t } = useTranslation("data");

  return Object.entries(SKILL_CATEGORIES).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        ...value,
        label: t(`skillCategories.${key}`),
      },
    }),
    {} as Record<string, LocalizedSkillCategory>
  );
}
