import { useTranslation } from "react-i18next";
import { EXPERIENCES, type Experience } from "../experience";

export type LocalizedExperience = Omit<
  Experience,
  "position" | "location" | "description" | "responsibilities"
> & {
  position: string;
  location: string;
  description: string;
  responsibilities: string[];
};

export function useExperiences(): LocalizedExperience[] {
  const { t } = useTranslation("data");

  return EXPERIENCES.map((exp) => ({
    ...exp,
    position: t(`experiences.${exp.id}.position`),
    location: t(`experiences.${exp.id}.location`),
    description: t(`experiences.${exp.id}.description`),
    responsibilities: t(`experiences.${exp.id}.responsibilities`, {
      returnObjects: true,
    }) as string[],
  }));
}

export function useExperience(id: string): LocalizedExperience | undefined {
  const experiences = useExperiences();
  return experiences.find((e) => e.id === id);
}
