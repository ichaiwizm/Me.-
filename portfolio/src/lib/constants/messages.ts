/**
 * Messages et textes constants pour le portfolio
 */

export const WELCOME_MESSAGES = {
  greeting: "Bonjour ! Je suis Ichai, ingénieur full-stack.",
  subtext: "Posez-moi des questions sur mes projets, compétences ou expérience !",
  fullGreeting:
    "Bonjour ! Je suis Ichai, ingénieur full-stack. Posez-moi des questions sur mes projets, compétences ou expérience !",
} as const;

export const WINDOW_TITLES = {
  skills: "Compétences Techniques",
  cv: "CV - Ichai Wizman",
  contact: "Me contacter",
  projects: "Mes Projets Phares",
  about: "À propos de moi",
  experience: "Mon Expérience",
  education: "Mon Parcours",
} as const;

export const TOAST_MESSAGES = {
  success: {
    messageSent: "Message envoyé avec succès !",
    windowCreated: "Fenêtre créée",
    themeChanged: "Thème modifié",
    copied: "Copié dans le presse-papiers",
  },
  error: {
    generic: "Une erreur s'est produite",
    networkError: "Erreur de connexion",
    invalidInput: "Entrée invalide",
  },
  info: {
    loading: "Chargement en cours...",
    processing: "Traitement en cours...",
  },
} as const;

export const BUTTON_LABELS = {
  sendMessage: "Envoyer le message",
  downloadCV: "Télécharger mon CV",
  viewProject: "Voir le projet",
  contactMe: "Me contacter",
  viewMore: "En savoir plus",
  close: "Fermer",
  minimize: "Réduire",
  expand: "Agrandir",
} as const;

export const PLACEHOLDERS = {
  name: "Votre nom",
  email: "Votre email",
  message: "Votre message",
  search: "Rechercher...",
} as const;

export const ARIA_LABELS = {
  closeWindow: "Fermer la fenêtre",
  minimizeWindow: "Réduire la fenêtre",
  themeSwitcher: "Changer de thème",
  resetApp: "Tout réinitialiser",
  toggleChat: "Afficher/masquer le chat",
  sendMessage: "Envoyer le message",
} as const;
