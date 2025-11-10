/**
 * Compétences techniques de Levana Wizman
 */

import type { LucideIcon } from "lucide-react";
import { Circle, Square, Diamond, Palette, Wind, Hexagon, Code, Code2, Coffee, Database, BarChart3, GitBranch, Github, Laptop, Terminal } from "lucide-react";

export type Skill = {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "database" | "tools" | "other";
  icon?: LucideIcon;
};

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React", level: 85, category: "frontend", icon: Circle },
  { name: "JavaScript", level: 85, category: "frontend", icon: Square },
  { name: "TypeScript", level: 75, category: "frontend", icon: Diamond },
  { name: "HTML/CSS", level: 90, category: "frontend", icon: Palette },
  { name: "Tailwind CSS", level: 80, category: "frontend", icon: Wind },

  // Backend
  { name: "Node.js", level: 75, category: "backend", icon: Hexagon },
  { name: "PHP", level: 70, category: "backend", icon: Code },
  { name: "Python", level: 75, category: "backend", icon: Code2 },
  { name: "Java", level: 65, category: "backend", icon: Coffee },

  // Database
  { name: "MySQL", level: 75, category: "database", icon: Database },
  { name: "SQL", level: 80, category: "database", icon: BarChart3 },

  // Tools
  { name: "Git", level: 85, category: "tools", icon: GitBranch },
  { name: "GitHub", level: 85, category: "tools", icon: Github },
  { name: "VS Code", level: 90, category: "tools", icon: Laptop },
  { name: "Linux/SSH", level: 70, category: "tools", icon: Terminal },
];

export const SKILL_CATEGORIES = {
  frontend: {
    label: "Frontend",
    color: "#8b5cf6",
    gradient: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
  },
  backend: {
    label: "Backend",
    color: "#6366f1",
    gradient: "linear-gradient(90deg, #6366f1, #818cf8)",
  },
  database: {
    label: "Bases de données",
    color: "#ec4899",
    gradient: "linear-gradient(90deg, #ec4899, #f472b6)",
  },
  tools: {
    label: "Outils & DevOps",
    color: "#10b981",
    gradient: "linear-gradient(90deg, #10b981, #34d399)",
  },
  other: {
    label: "Autres",
    color: "#f59e0b",
    gradient: "linear-gradient(90deg, #f59e0b, #fbbf24)",
  },
} as const;
