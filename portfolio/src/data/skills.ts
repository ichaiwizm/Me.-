/**
 * Compétences techniques de Ichai Wizman
 */

import type { LucideIcon } from "lucide-react";
import { Circle, Square, Diamond, Palette, Wind, Hexagon, Code, Code2, Database, BarChart3, GitBranch, Github, Laptop, Terminal, Box, Play, Phone, Server } from "lucide-react";

export type Skill = {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "database" | "tools" | "other";
  icon?: LucideIcon;
};

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React", level: 90, category: "frontend", icon: Circle },
  { name: "JavaScript", level: 90, category: "frontend", icon: Square },
  { name: "TypeScript", level: 80, category: "frontend", icon: Diamond },
  { name: "HTML/CSS", level: 90, category: "frontend", icon: Palette },
  { name: "Tailwind CSS", level: 85, category: "frontend", icon: Wind },
  { name: "Next.js", level: 80, category: "frontend", icon: Circle },

  // Backend
  { name: "Node.js", level: 90, category: "backend", icon: Hexagon },
  { name: "PHP/Laravel", level: 80, category: "backend", icon: Code },
  { name: "Python", level: 70, category: "backend", icon: Code2 },

  // Database
  { name: "MySQL", level: 85, category: "database", icon: Database },
  { name: "SQLite", level: 80, category: "database", icon: Database },
  { name: "PostgreSQL", level: 75, category: "database", icon: BarChart3 },

  // Tools
  { name: "Git", level: 90, category: "tools", icon: GitBranch },
  { name: "GitHub", level: 90, category: "tools", icon: Github },
  { name: "Docker", level: 80, category: "tools", icon: Box },
  { name: "VS Code", level: 95, category: "tools", icon: Laptop },
  { name: "Linux", level: 85, category: "tools", icon: Terminal },

  // Other
  { name: "Electron", level: 85, category: "other", icon: Laptop },
  { name: "Playwright", level: 85, category: "other", icon: Play },
  { name: "WebRTC", level: 70, category: "other", icon: Phone },
  { name: "Asterisk/VoIP", level: 75, category: "other", icon: Server },
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
