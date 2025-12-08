export type Suggestion = {
  text: string;
  category: string;
};

export const SUGGESTIONS: Suggestion[] = [
  // Portfolio - Section principale
  { text: "Montre-moi tes projets", category: "Portfolio" },
  { text: "Affiche ton CV", category: "Portfolio" },
  { text: "Quelles sont tes compétences ?", category: "Portfolio" },
  { text: "Parle-moi de ton parcours", category: "Portfolio" },

  // Contact
  { text: "Comment te contacter ?", category: "Contact" },
  { text: "Formulaire de contact", category: "Contact" },

  // Expérience
  { text: "Ton expérience chez PhoneGS", category: "Expérience" },
  { text: "Tes missions freelance", category: "Expérience" },

  // Projets
  { text: "Parle-moi de Mutuelles_v4", category: "Projets" },
  { text: "Présente Shoot", category: "Projets" },
  { text: "Ton blog sur l'IA", category: "Projets" },

  // Photos perso
  { text: "Montre-moi tes photos", category: "Photos" },
  { text: "Photo de Paris", category: "Photos" },
  { text: "La photo fun à l'aquarium", category: "Photos" },

  // Compétences techniques
  { text: "Visualise tes compétences", category: "Démo" },
  { text: "Tes technos préférées", category: "Démo" },

  // Personnalisation
  { text: "Change le thème en mode sombre", category: "Personnalisation" },
  { text: "Fond dégradé violet", category: "Personnalisation" },
];
