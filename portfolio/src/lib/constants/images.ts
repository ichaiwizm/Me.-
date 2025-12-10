/**
 * Complete image registry for the portfolio
 * All 5 images properly catalogued with metadata
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
    tags: ["nuit", "terrasse", "jérusalem", "détente", "ambiance"],
    description: "Vue nocturne depuis ma terrasse à Jérusalem",
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
