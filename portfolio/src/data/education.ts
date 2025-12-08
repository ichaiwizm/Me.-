/**
 * Parcours éducatif de Ichai Wizman
 */

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string[];
};

export const EDUCATION: Education[] = [
  {
    id: "webschool",
    institution: "WebSchool",
    degree: "Formation Développement Web",
    field: "Full-Stack",
    location: "France",
    startDate: "2019-01",
    endDate: "2019-12",
    current: false,
    description: "Formation intensive en développement web couvrant le frontend et le backend.",
    achievements: [
      "Bases solides en développement front et back",
      "Premières applications complètes",
      "Premières missions freelance",
    ],
  },
];

export const CERTIFICATIONS: {
  id: string;
  name: string;
  organization: string;
  date: string;
  description: string;
}[] = [];
