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
    id: "mutuelles-v4",
    title: "Mutuelles_v4 - Application Desktop d'Automatisation",
    description: "Application desktop complète automatisant les plateformes d'assurance (mutuelles). Inclut workflows automatisés, gestion des dossiers, scraping intelligent et orchestration Playwright.",
    technologies: ["Electron", "React", "Vite", "Playwright", "SQLite", "Node.js"],
    category: "personnel",
    date: "2024",
    featured: true,
    highlights: [
      "Interface desktop solide avec Electron",
      "Automatisation avancée via Playwright",
      "Gestion intelligente des dossiers",
      "Performance et fiabilité optimisées",
    ],
  },
  {
    id: "shoot",
    title: "Shoot - Plateforme pour Photographes",
    description: "Écosystème complet pour photographes professionnels : back-office admin puissant, dashboard client full-features, site vitrine personnalisable. Architecture robuste et UX clean.",
    technologies: ["React", "Node.js", "Cloudflare Workers", "Neon DB"],
    category: "personnel",
    date: "2024",
    featured: true,
    liveUrl: "https://shoot.ichaiwizlol.workers.dev/",
    highlights: [
      "Back-office admin complet",
      "Dashboard client riche en fonctionnalités",
      "Site vitrine personnalisable",
      "Automatisations et performances optimisées",
    ],
  },
  {
    id: "ai-blog",
    title: "AI Blog - Apprentissage IA pour Développeurs",
    description: "Blog éducatif pour développeurs : apprendre à maîtriser l'IA et booster son niveau grâce aux bons outils et bonnes pratiques. Contenu pédagogique, moderne et IA-oriented.",
    technologies: ["Next.js", "Vercel", "React", "TypeScript"],
    category: "personnel",
    date: "2024",
    featured: true,
    liveUrl: "https://ai-blog-six-ashy.vercel.app/",
    highlights: [
      "Contenu pédagogique sur l'IA",
      "Interface moderne et claire",
      "Orienté développeurs",
      "Déployé sur Vercel",
    ],
  },
  {
    id: "portfolio-interactif",
    title: "Portfolio Interactif avec IA",
    description: "Portfolio personnel innovant avec interface conversationnelle alimentée par IA, permettant une navigation intuitive via commandes naturelles. Système de fenêtres flottantes interactives et thèmes dynamiques.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Claude API"],
    category: "personnel",
    date: "2025",
    featured: true,
    highlights: [
      "Interface conversationnelle avec IA",
      "Système de fenêtres interactives",
      "Thèmes personnalisables",
      "Architecture modulaire et évolutive",
    ],
  },
];
