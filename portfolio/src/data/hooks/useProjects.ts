import { useTranslation } from "react-i18next";
import { PROJECTS, type Project } from "../projects";

export type LocalizedProject = Omit<Project, "title" | "description" | "highlights"> & {
  title: string;
  description: string;
  highlights: string[];
};

export function useProjects(): LocalizedProject[] {
  const { t } = useTranslation("data");

  return PROJECTS.map((project) => ({
    ...project,
    title: t(`projects.${project.id}.title`),
    description: t(`projects.${project.id}.description`),
    highlights: t(`projects.${project.id}.highlights`, { returnObjects: true }) as string[],
  }));
}

export function useProject(id: string): LocalizedProject | undefined {
  const projects = useProjects();
  return projects.find((p) => p.id === id);
}
