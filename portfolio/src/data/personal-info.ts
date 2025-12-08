/**
 * Informations personnelles de Ichai Wizman
 */

export const PERSONAL_INFO = {
  fullName: "Ichai Wizman",
  title: "Ingénieur Logiciel Full-Stack",
  subtitle: "Développeur chez PhoneGS",

  contact: {
    email: "ichaiwizm@gmail.com",
    phone: "+33 7 66 00 28 89",
    location: "Jérusalem, Israël",
  },

  bio: {
    short: "Ingénieur Full-Stack passionné, obsédé par la création de produits puissants. Entre deux lignes de code, je profite de la famille et des bonnes pizzas sur les toits de Jérusalem.",

    long: `Je suis un ingénieur logiciel full-stack qui vit pour construire. Depuis plusieurs années,
    je conçois, développe et scale des applications complètes — du front au backend en passant par l'infra.
    Passionné par l'IA et l'automatisation, j'intègre ces technologies dans chacun de mes projets pour
    aller plus vite, viser plus haut et livrer mieux.

    Mais la vie c'est pas que du code : j'accorde une place importante à la famille, aux voyages
    (entre Paris et Jérusalem), et aux moments simples — une pizza sur le toit avec vue sur la ville,
    une balade au parc, ou une photo fun à l'aquarium. C'est cet équilibre qui me garde motivé et créatif.

    Quand je code pas, je code quand même — c'est simple : je suis lancé et je m'arrête pas.`,
  },

  qualities: [
    { trait: "Builder", icon: "Zap" },
    { trait: "Famille first", icon: "Heart" },
    { trait: "Autonome", icon: "Rocket" },
    { trait: "Fun", icon: "Smile" },
  ],

  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" },
    { name: "Hébreu", level: "Débutant" },
  ],

  social: {
    github: "https://github.com/ichaiwizm",
    linkedin: "https://www.linkedin.com/in/icha%C3%AF-wizman-892478323/",
  },
} as const;
