/**
 * Projets de Ichai Wizman
 */

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: "formation" | "personnel" | "alternance" | "academique" | "professionnel";
  date: string;
  imageId?: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  highlights?: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "shoot",
    title: "Shoot - Plateforme pour Photographes",
    description: "Écosystème complet pour photographes professionnels : back-office admin puissant, dashboard client full-features, site vitrine personnalisable. Développement assisté par IA avec workflows automatisés.",
    technologies: ["React", "Node.js", "Cloudflare Workers", "Neon DB", "Claude Code"],
    category: "personnel",
    date: "2024",
    featured: true,
    liveUrl: "https://shoot.ichaiwizlol.workers.dev/",
    highlights: [
      "Architecture full-stack moderne",
      "Workflows automatisés pour la gestion client",
      "Développement accéléré avec outils IA",
      "Performances optimisées sur Cloudflare Edge",
    ],
  },
  {
    id: "mutuelles-v4",
    title: "Mutuelles_v4 - Application Desktop d'Automatisation",
    description: "Application desktop complète automatisant les plateformes d'assurance (mutuelles). Développement assisté par IA (Claude Code). Inclut workflows automatisés, gestion des dossiers, scraping intelligent et orchestration Playwright.",
    technologies: ["Electron", "React", "Vite", "Playwright", "SQLite", "Node.js", "Claude Code"],
    category: "personnel",
    date: "2024",
    featured: true,
    highlights: [
      "Développement accéléré avec Claude Code",
      "Automatisation avancée via Playwright",
      "Interface desktop robuste avec Electron",
      "Gestion intelligente des dossiers et workflows",
    ],
  },
  {
    id: "ai-blog",
    title: "AI Blog - Plateforme d'Apprentissage IA",
    description: "Blog technique actif destiné aux développeurs souhaitant maîtriser l'IA. Contenu pédagogique sur les outils IA (Claude, GPT, Cursor), les bonnes pratiques et l'intégration dans les workflows de développement.",
    technologies: ["Next.js", "Vercel", "React", "TypeScript", "MDX"],
    category: "personnel",
    date: "2024",
    featured: true,
    liveUrl: "https://ai-blog-six-ashy.vercel.app/",
    highlights: [
      "Audience active de développeurs",
      "Contenu expert sur Claude, GPT, Cursor",
      "Tutoriels pratiques et cas d'usage",
      "Veille constante sur les dernières avancées IA",
    ],
  },
  {
    id: "portfolio-interactif",
    title: "Portfolio Interactif avec IA",
    description: "Portfolio personnel démontrant l'intégration avancée de l'IA. Interface conversationnelle alimentée par Claude API, navigation intuitive via commandes naturelles, génération dynamique de contenu et modes visuels personnalisés.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Claude API", "Vercel AI SDK"],
    category: "personnel",
    date: "2025",
    featured: true,
    highlights: [
      "Intégration Claude API en production",
      "Interface conversationnelle naturelle",
      "Génération dynamique de contenu via IA",
      "Développement complet assisté par Claude Code",
    ],
  },
];
