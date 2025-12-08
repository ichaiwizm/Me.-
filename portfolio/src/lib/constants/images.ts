/**
 * Complete image registry for the portfolio
 * All 17 images properly catalogued with metadata
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ImageMeta {
  id: string;
  name: string;
  path: string;
  category: "personal" | "travel" | "professional";
  tags: string[];
  description?: string;
}

export type ImageCategory = ImageMeta["category"];

// ============================================================================
// IMAGE REGISTRY
// ============================================================================

/**
 * Complete registry of all portfolio images
 * Organized by category with searchable tags
 */
export const IMAGE_REGISTRY: ImageMeta[] = [
  // -------------------------------------------------------------------------
  // FAMILY & EVENTS (PNG - High quality)
  // -------------------------------------------------------------------------
  {
    id: "family-event",
    name: "Moment en famille",
    path: "/images/family-event.png",
    category: "personal",
    tags: ["famille", "enfant", "événement", "israël", "célébration"],
    description: "Un moment précieux en famille lors d'un événement",
  },
  {
    id: "rooftop-night",
    name: "Soirée sur le toit",
    path: "/images/rooftop-night.png",
    category: "personal",
    tags: ["nuit", "terrasse", "ville", "détente", "ambiance"],
    description: "Vue nocturne depuis une terrasse parisienne",
  },
  {
    id: "park-moment",
    name: "Balade au parc",
    path: "/images/park-moment.png",
    category: "personal",
    tags: ["parc", "famille", "nature", "détente", "enfant"],
    description: "Promenade en famille dans un parc",
  },
  {
    id: "aquarium-fun",
    name: "Fun à l'aquarium",
    path: "/images/aquarium-fun.png",
    category: "personal",
    tags: ["aquarium", "fun", "poissons", "aventure", "découverte"],
    description: "Visite ludique à l'aquarium",
  },
  {
    id: "paris-champs-elysees",
    name: "Champs-Élysées, Paris",
    path: "/images/paris-champs-elysees.png",
    category: "travel",
    tags: ["paris", "voyage", "france", "arc de triomphe", "champs-élysées"],
    description: "Promenade sur les Champs-Élysées à Paris",
  },

  // -------------------------------------------------------------------------
  // CHILDHOOD & FAMILY (JPG - Archives)
  // -------------------------------------------------------------------------
  {
    id: "bat-mitzvah-speech",
    name: "Discours Bat Mitzvah",
    path: "/images/bat-mitzvah-speech.jpg",
    category: "personal",
    tags: ["famille", "célébration", "discours", "bat-mitzvah", "tradition"],
    description: "Moment émouvant lors d'un discours de Bat Mitzvah",
  },
  {
    id: "childhood-ichai-siblings",
    name: "Ichai et ses frères",
    path: "/images/childhood-ichai-siblings.jpg",
    category: "personal",
    tags: ["enfance", "famille", "frères", "souvenir", "fratrie"],
    description: "Photo de famille avec mes frères",
  },
  {
    id: "childhood-tata-johanna",
    name: "Avec Tata Johanna",
    path: "/images/childhood-tata-johanna.jpg",
    category: "personal",
    tags: ["enfance", "famille", "tante", "souvenir", "complicité"],
    description: "Moment complice avec Tata Johanna",
  },
  {
    id: "childhood-yonathan",
    name: "Avec Yonathan",
    path: "/images/childhood-yonathan.jpg",
    category: "personal",
    tags: ["enfance", "famille", "frère", "souvenir", "yonathan"],
    description: "Souvenir d'enfance avec mon frère Yonathan",
  },

  // -------------------------------------------------------------------------
  // SPECIAL OCCASIONS
  // -------------------------------------------------------------------------
  {
    id: "ichai-wedding-djellaba",
    name: "Mariage en djellaba",
    path: "/images/ichai-wedding-djellaba.jpg",
    category: "personal",
    tags: ["mariage", "tradition", "célébration", "djellaba", "fête"],
    description: "Célébration de mariage en tenue traditionnelle",
  },
  {
    id: "kimono-chez-nanou",
    name: "Kimono chez Nanou",
    path: "/images/kimono-chez-nanou.jpg",
    category: "personal",
    tags: ["tradition", "japon", "famille", "kimono", "nanou"],
    description: "En kimono chez Nanou",
  },
  {
    id: "nephew-yinone",
    name: "Neveu Yinone",
    path: "/images/nephew-yinone.jpg",
    category: "personal",
    tags: ["famille", "neveu", "enfant", "yinone", "complicité"],
    description: "Moment avec mon neveu Yinone",
  },
  {
    id: "paris-proposal",
    name: "Demande à Paris",
    path: "/images/paris-proposal.jpg",
    category: "personal",
    tags: ["paris", "amour", "couple", "demande", "romantique"],
    description: "Un moment romantique inoubliable à Paris",
  },

  // -------------------------------------------------------------------------
  // TRAVEL
  // -------------------------------------------------------------------------
  {
    id: "mountain-funicular",
    name: "Funiculaire en montagne",
    path: "/images/mountain-funicular.jpg",
    category: "travel",
    tags: ["voyage", "montagne", "transport", "funiculaire", "aventure"],
    description: "Montée en funiculaire dans les montagnes",
  },
  {
    id: "venice-mood",
    name: "Ambiance Venise",
    path: "/images/venice-mood.jpg",
    category: "travel",
    tags: ["voyage", "italie", "venise", "romantique", "ambiance"],
    description: "L'atmosphère unique de Venise",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get an image by its ID
 */
export function getImageById(id: string): ImageMeta | undefined {
  return IMAGE_REGISTRY.find((img) => img.id === id);
}

/**
 * Get all images in a specific category
 */
export function getImagesByCategory(category: ImageCategory): ImageMeta[] {
  return IMAGE_REGISTRY.filter((img) => img.category === category);
}

/**
 * Search images by query (searches name, tags, and description)
 */
export function searchImages(query: string): ImageMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return IMAGE_REGISTRY;

  return IMAGE_REGISTRY.filter(
    (img) =>
      img.name.toLowerCase().includes(q) ||
      img.id.toLowerCase().includes(q) ||
      img.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      img.description?.toLowerCase().includes(q)
  );
}

/**
 * Get images by tag
 */
export function getImagesByTag(tag: string): ImageMeta[] {
  const t = tag.toLowerCase();
  return IMAGE_REGISTRY.filter((img) =>
    img.tags.some((imgTag) => imgTag.toLowerCase().includes(t))
  );
}

/**
 * Get a random selection of images
 */
export function getRandomImages(count: number): ImageMeta[] {
  const shuffled = [...IMAGE_REGISTRY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get all unique tags from the registry
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  IMAGE_REGISTRY.forEach((img) => img.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

/**
 * Get all unique categories
 */
export function getAllCategories(): ImageCategory[] {
  const categories = new Set<ImageCategory>();
  IMAGE_REGISTRY.forEach((img) => categories.add(img.category));
  return Array.from(categories);
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const IMAGE_CATEGORIES: Record<ImageCategory, string> = {
  personal: "Personnel",
  travel: "Voyages",
  professional: "Professionnel",
};

export const TOTAL_IMAGES = IMAGE_REGISTRY.length;
