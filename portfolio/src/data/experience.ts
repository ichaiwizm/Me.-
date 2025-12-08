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
    description: "Développement complet d'une application de téléphonie professionnelle (VoIP), pilotée en React/Node, intégrée à Asterisk et FusionPBX.",
    responsibilities: [
      "Développement full-stack de l'application interne : UI React, API Node.js, backend PHP/Laravel",
      "Intégration avancée avec les systèmes téléphoniques : Asterisk, FusionPBX, WebRTC",
      "Architecture et optimisation des performances",
      "Automatisation des workflows",
      "Mise en place de dashboards et interfaces d'administration",
      "Participation aux décisions produit avec forte autonomie technique",
    ],
    technologies: ["React", "Node.js", "Laravel", "PHP", "Asterisk", "FusionPBX", "MySQL", "Docker", "WebRTC"],
  },
  {
    id: "freelance",
    company: "Freelance",
    position: "Développeur Full-Stack",
    location: "France",
    startDate: "2020-01",
    endDate: "2023-01",
    current: false,
    type: "freelance",
    description: "Missions variées en développement web et automatisation pour divers clients.",
    responsibilities: [
      "Création de sites vitrines professionnels",
      "Développement de SaaS",
      "Scrapers et automatisations avancées",
      "Intégration API et développement de back-offices",
      "Création de dashboards sur mesure",
    ],
    technologies: ["React", "Node.js", "PHP", "Python", "MySQL", "PostgreSQL"],
  },
];
