export type CategoryKey = "portfolio" | "contact" | "experience" | "projects" | "photos" | "demo" | "customization";

export type Suggestion = {
  textKey: string;
  category: CategoryKey;
};

export const SUGGESTIONS: Suggestion[] = [
  // Portfolio - Main section
  { textKey: "showProjects", category: "portfolio" },
  { textKey: "showCV", category: "portfolio" },
  { textKey: "whatSkills", category: "portfolio" },
  { textKey: "tellAbout", category: "portfolio" },

  // Contact
  { textKey: "howContact", category: "contact" },
  { textKey: "contactForm", category: "contact" },

  // Experience
  { textKey: "phonegsExp", category: "experience" },
  { textKey: "freelanceMissions", category: "experience" },

  // Projects
  { textKey: "aboutMutuelles", category: "projects" },
  { textKey: "presentShoot", category: "projects" },
  { textKey: "aiBlog", category: "projects" },

  // Personal photos
  { textKey: "showPhotos", category: "photos" },
  { textKey: "parisPhoto", category: "photos" },
  { textKey: "aquariumPhoto", category: "photos" },

  // Technical skills
  { textKey: "visualizeSkills", category: "demo" },
  { textKey: "favoriteTech", category: "demo" },

  // Customization
  { textKey: "darkTheme", category: "customization" },
  { textKey: "purpleGradient", category: "customization" },
  { textKey: "modeMadMax", category: "customization" },
  { textKey: "modeCyberpunk", category: "customization" },
  { textKey: "modeNature", category: "customization" },
  { textKey: "modeRetroArcade", category: "customization" },
  { textKey: "modeVaporwave", category: "customization" },
  { textKey: "modeHacker", category: "customization" },
];
