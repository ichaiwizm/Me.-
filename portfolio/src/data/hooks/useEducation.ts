import { useTranslation } from "react-i18next";
import { EDUCATION, type Education } from "../education";

export type LocalizedEducation = Omit<
  Education,
  "degree" | "field" | "description" | "achievements"
> & {
  degree: string;
  field?: string;
  description: string;
  achievements?: string[];
};

export function useEducation(): LocalizedEducation[] {
  const { t } = useTranslation("data");

  return EDUCATION.map((edu) => ({
    ...edu,
    degree: t(`education.${edu.id}.degree`),
    field: edu.field ? t(`education.${edu.id}.field`) : undefined,
    description: t(`education.${edu.id}.description`),
    achievements: edu.achievements
      ? (t(`education.${edu.id}.achievements`, { returnObjects: true }) as string[])
      : undefined,
  }));
}
