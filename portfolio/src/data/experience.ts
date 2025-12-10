/**
 * Expériences professionnelles de Ichai Wizman
 */

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  type: "alternance" | "emploi" | "stage" | "benevole" | "freelance";
  description: string;
  responsibilities: string[];
  technologies?: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    id: "phonegs",
    company: "PhoneGS",
    position: "Ingénieur Logiciel Full-Stack",
    location: "Jérusalem, Israël",
    startDate: "2023-01",
    endDate: "",
    current: true,
    type: "emploi",
    description: "Développement complet d'une application de téléphonie professionnelle (VoIP), pilotée en React/Node, intégrée à Asterisk et FusionPBX. Utilisation quotidienne d'outils IA pour accélérer le développement.",
    responsibilities: [
      "Développement full-stack : UI React, API Node.js, backend PHP/Laravel",
      "Intégration avancée avec les systèmes téléphoniques : Asterisk, FusionPBX, WebRTC",
      "Utilisation d'outils IA (Claude, GPT, Cursor) pour accélérer le développement",
      "Architecture et optimisation des performances",
      "Automatisation des workflows internes",
      "Forte autonomie technique et décisions produit",
    ],
    technologies: ["React", "Node.js", "Laravel", "PHP", "Asterisk", "FusionPBX", "MySQL", "Docker", "WebRTC", "Claude Code"],
  },
  {
    id: "freelance",
    company: "Freelance",
    position: "Développeur Full-Stack & Automatisation",
    location: "France",
    startDate: "2020-01",
    endDate: "2023-01",
    current: false,
    type: "freelance",
    description: "Missions variées en développement web et automatisation pour divers clients. Spécialisation progressive dans les workflows automatisés et le scraping intelligent.",
    responsibilities: [
      "Développement de SaaS et applications web complètes",
      "Scrapers avancés et automatisations de workflows",
      "Intégration API et développement de back-offices",
      "Création de dashboards sur mesure",
      "Solutions d'automatisation pour entreprises",
    ],
    technologies: ["React", "Node.js", "PHP", "Python", "MySQL", "PostgreSQL", "Playwright", "Puppeteer"],
  },
];
