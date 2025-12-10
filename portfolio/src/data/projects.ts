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
  isCurrent?: boolean;
};

export const PROJECTS: Project[] = [
  // 1. AI Blog (haut gauche)
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
  // 2. AssurLead (haut droite)
  {
    id: "assurlead",
    title: "AssurLead - Automatisation Assurance",
    description: "Application desktop puissante développée en partenariat avec France Épargne (france-epargne.fr). Automatise les plateformes d'assurance pour nos clients communs. Orchestration Playwright, gestion intelligente des dossiers, workflows automatisés.",
    technologies: ["Electron", "React", "Vite", "Playwright", "SQLite", "Node.js", "Claude Code"],
    category: "professionnel",
    date: "2024",
    featured: true,
    highlights: [
      "Partenariat avec France Épargne",
      "Automatisation avancée via Playwright",
      "Interface desktop robuste avec Electron",
      "Gestion intelligente des dossiers et workflows",
    ],
  },
  // 3. Shoot (bas gauche)
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
  // 4. Portfolio (bas droite) - Projet actuel
  {
    id: "portfolio-interactif",
    title: "Portfolio Interactif avec IA",
    description: "Portfolio personnel démontrant l'intégration avancée de l'IA. Interface conversationnelle alimentée par Claude API, navigation intuitive via commandes naturelles, génération dynamique de contenu et modes visuels personnalisés.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Claude API", "Vercel AI SDK"],
    category: "personnel",
    date: "2025",
    featured: true,
    isCurrent: true,
    highlights: [
      "Intégration Claude API en production",
      "Interface conversationnelle naturelle",
      "Génération dynamique de contenu via IA",
      "Développement complet assisté par Claude Code",
    ],
  },
];
