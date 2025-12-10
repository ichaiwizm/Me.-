/**
 * Informations personnelles de Ichai Wizman
 */

export const PERSONAL_INFO = {
  fullName: "Ichai Wizman",
  title: "Full-Stack Engineer | IA & Automatisation",
  subtitle: "Ingénieur Logiciel chez PhoneGS",

  contact: {
    email: "ichaiwizm@gmail.com",
    phone: "+33 7 66 00 28 89",
    location: "Jérusalem, Israël",
  },

  bio: {
    short: "Ingénieur Full-Stack spécialisé en IA et automatisation. Père de deux enfants, je construis des solutions qui ont un impact concret. Toujours à la pointe des dernières technologies IA que j'intègre dans chacun de mes projets.",

    long: `Ingénieur Full-Stack avec plusieurs années d'expérience dans la conception, le développement et le déploiement d'applications complètes. Ma spécialité : l'intégration de l'IA et l'automatisation des workflows pour maximiser l'efficacité et la valeur livrée.

    J'utilise quotidiennement les outils IA les plus avancés — Claude, GPT, Cursor, Gemini — et je partage mes connaissances via un blog technique actif destiné aux développeurs. Cette veille constante me permet d'être toujours à jour sur les meilleures pratiques.

    Père de deux enfants, j'accorde une importance particulière à l'équilibre entre vie professionnelle et personnelle. Cette stabilité nourrit ma créativité et ma capacité à rester concentré sur les résultats.

    Mes forces : autonomie complète sur les projets, résolution de problèmes complexes, apprentissage rapide et vision produit. Je suis pragmatique, orienté résultats, et passionné par ce que je fais.`,
  },

  qualities: [
    { trait: "Expert IA", icon: "Zap" },
    { trait: "Père de famille", icon: "Heart" },
    { trait: "Autonome", icon: "Rocket" },
    { trait: "Pragmatique", icon: "Target" },
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
