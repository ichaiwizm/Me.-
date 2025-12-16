/**
 * Element Registry
 * Central registry of all styleable elements in the portfolio
 */

import type { StyleableElement, ElementCategory, ElementListResponse } from "./types";

export const ELEMENT_REGISTRY: StyleableElement[] = [
  // ===================
  // LAYOUT
  // ===================
  {
    selector: "header",
    name: "Header",
    description: "Main navigation header with logo and controls",
    category: "layout",
    componentPath: "components/layout/Header.tsx",
    cssVariables: ["--background", "--foreground", "--border"],
  },
  {
    selector: "main",
    name: "Main Content",
    description: "Primary content area of the page",
    category: "layout",
  },
  {
    selector: ".mobile-bottom-nav",
    name: "Mobile Bottom Nav",
    description: "Bottom navigation bar on mobile devices",
    category: "layout",
    componentPath: "components/layout/MobileBottomNav.tsx",
  },

  // ===================
  // NAVIGATION
  // ===================
  {
    selector: "header nav",
    name: "Navigation Container",
    description: "Container for navigation links in header",
    category: "navigation",
  },
  {
    selector: "header nav a",
    name: "Navigation Links",
    description: "Individual navigation links in header",
    category: "navigation",
  },
  {
    selector: "header nav a[data-active='true']",
    name: "Active Navigation Link",
    description: "Currently active navigation link",
    category: "navigation",
  },
  {
    selector: ".mobile-bottom-nav a",
    name: "Mobile Nav Links",
    description: "Navigation links in mobile bottom bar",
    category: "navigation",
  },

  // ===================
  // UI COMPONENTS
  // ===================
  {
    selector: "[data-slot='button']",
    name: "Buttons",
    description: "All button components (various variants)",
    category: "ui",
    componentPath: "components/ui/button.tsx",
    cssVariables: ["--primary", "--primary-foreground"],
  },
  {
    selector: "button.variant-default",
    name: "Default Buttons",
    description: "Primary action buttons",
    category: "ui",
  },
  {
    selector: "button.variant-ghost",
    name: "Ghost Buttons",
    description: "Transparent/subtle buttons",
    category: "ui",
  },
  {
    selector: "button.variant-outline",
    name: "Outline Buttons",
    description: "Buttons with border outline",
    category: "ui",
  },
  {
    selector: "input, textarea",
    name: "Form Inputs",
    description: "Text inputs and textareas",
    category: "ui",
    componentPath: "components/ui/input.tsx",
    cssVariables: ["--input", "--ring", "--border"],
  },
  {
    selector: ".card, [class*='bg-card']",
    name: "Cards",
    description: "Card containers for content",
    category: "ui",
    cssVariables: ["--card", "--card-foreground"],
  },
  {
    selector: ".badge",
    name: "Badges",
    description: "Small label/tag components",
    category: "ui",
  },
  {
    selector: ".glass, .glass-strong",
    name: "Glass Elements",
    description: "Glassmorphism styled elements",
    category: "ui",
  },

  // ===================
  // CHAT
  // ===================
  {
    selector: ".side-panel, [class*='ChatSidePanel']",
    name: "Chat Panel",
    description: "Main chat interface container",
    category: "chat",
    componentPath: "components/chat/ChatSidePanel.tsx",
  },
  {
    selector: "[class*='ChatMessages']",
    name: "Messages Container",
    description: "Container for chat messages",
    category: "chat",
    componentPath: "components/chat/ChatMessages.tsx",
  },
  {
    selector: "[class*='ChatMessages'] [class*='user']",
    name: "User Messages",
    description: "Messages sent by the user",
    category: "chat",
  },
  {
    selector: "[class*='ChatMessages'] [class*='assistant']",
    name: "Assistant Messages",
    description: "Messages from the AI assistant",
    category: "chat",
  },
  {
    selector: "[class*='PromptBar']",
    name: "Prompt Bar",
    description: "Input area for sending messages",
    category: "chat",
    componentPath: "components/chat/PromptBar.tsx",
  },
  {
    selector: "[class*='ChatToggle'], .chat-toggle",
    name: "Chat Toggle Button",
    description: "Button to open/close chat panel",
    category: "chat",
    componentPath: "components/chat/ChatToggleButton.tsx",
  },
  {
    selector: "[class*='PromptSuggestions']",
    name: "Prompt Suggestions",
    description: "Suggested prompts/questions",
    category: "chat",
    componentPath: "components/chat/PromptSuggestions.tsx",
  },
  {
    selector: ".command-chip",
    name: "Command Chips",
    description: "Visual indicators for executed commands",
    category: "chat",
  },
  {
    selector: ".navigation-card",
    name: "Navigation Cards",
    description: "Interactive navigation buttons in chat",
    category: "chat",
  },

  // ===================
  // WINDOWS
  // ===================
  {
    selector: "[class*='FloatingWindow']",
    name: "Floating Windows",
    description: "Draggable floating window containers",
    category: "windows",
    componentPath: "components/windows/FloatingWindow.tsx",
  },
  {
    selector: "[class*='FloatingWindow'] .window-header",
    name: "Window Header",
    description: "Title bar of floating windows",
    category: "windows",
  },
  {
    selector: "[class*='FloatingWindow'] .traffic-lights",
    name: "Window Traffic Lights",
    description: "Close/minimize/maximize buttons",
    category: "windows",
  },
  {
    selector: "[class*='WindowDock']",
    name: "Window Dock",
    description: "Taskbar for minimized windows",
    category: "windows",
    componentPath: "components/windows/WindowDock.tsx",
  },

  // ===================
  // TYPOGRAPHY
  // ===================
  {
    selector: "h1",
    name: "Heading 1",
    description: "Primary headings (largest)",
    category: "typography",
  },
  {
    selector: "h2",
    name: "Heading 2",
    description: "Secondary headings",
    category: "typography",
  },
  {
    selector: "h3",
    name: "Heading 3",
    description: "Tertiary headings",
    category: "typography",
  },
  {
    selector: "p",
    name: "Paragraphs",
    description: "Body text paragraphs",
    category: "typography",
  },
  {
    selector: "a",
    name: "Links",
    description: "Hyperlinks throughout the site",
    category: "typography",
  },
  {
    selector: "code, pre",
    name: "Code Blocks",
    description: "Inline and block code elements",
    category: "typography",
  },
  {
    selector: ".text-monumental",
    name: "Monumental Text",
    description: "Large hero text on homepage",
    category: "typography",
  },
  {
    selector: ".text-title",
    name: "Title Text",
    description: "Page and section titles",
    category: "typography",
  },

  // ===================
  // MEDIA
  // ===================
  {
    selector: "[class*='ImageGallery']",
    name: "Image Gallery",
    description: "Grid gallery of images",
    category: "media",
    componentPath: "components/media/ImageGallery.tsx",
  },
  {
    selector: "[class*='ImageThumbnail']",
    name: "Image Thumbnails",
    description: "Individual image tiles in gallery",
    category: "media",
    componentPath: "components/media/ImageThumbnail.tsx",
  },
  {
    selector: "[class*='Lightbox']",
    name: "Lightbox",
    description: "Full-screen image viewer",
    category: "media",
    componentPath: "components/media/Lightbox.tsx",
  },
  {
    selector: "img",
    name: "Images",
    description: "All image elements",
    category: "media",
  },

  // ===================
  // EFFECTS
  // ===================
  {
    selector: "body::before",
    name: "Body Overlay (before)",
    description: "Pseudo-element for background effects",
    category: "effects",
  },
  {
    selector: "body::after",
    name: "Body Overlay (after)",
    description: "Pseudo-element for foreground effects",
    category: "effects",
  },
  {
    selector: ".custom-cursor",
    name: "Custom Cursor",
    description: "Custom mouse cursor element",
    category: "effects",
    componentPath: "components/ui/CustomCursor.tsx",
  },
  {
    selector: "::-webkit-scrollbar",
    name: "Scrollbar",
    description: "Custom scrollbar styling",
    category: "effects",
  },
  {
    selector: "::selection",
    name: "Text Selection",
    description: "Highlighted/selected text styling",
    category: "effects",
  },
];

/**
 * Get all elements in a specific category
 */
export function getElementsByCategory(category: ElementCategory): StyleableElement[] {
  return ELEMENT_REGISTRY.filter((el) => el.category === category);
}

/**
 * Find an element by its selector
 */
export function findElement(selector: string): StyleableElement | undefined {
  return ELEMENT_REGISTRY.find((el) => el.selector === selector);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): ElementCategory[] {
  return [...new Set(ELEMENT_REGISTRY.map((el) => el.category))];
}

/**
 * Build a formatted list of elements for AI consumption
 */
export function buildElementList(category?: ElementCategory): ElementListResponse {
  const categories = category ? [category] : getAllCategories();

  return {
    categories: categories.map((cat) => ({
      name: cat,
      elements: getElementsByCategory(cat).map((el) => ({
        selector: el.selector,
        name: el.name,
        description: el.description,
      })),
    })),
  };
}

/**
 * Search elements by name or description
 */
export function searchElements(query: string): StyleableElement[] {
  const lowerQuery = query.toLowerCase();
  return ELEMENT_REGISTRY.filter(
    (el) =>
      el.name.toLowerCase().includes(lowerQuery) ||
      el.description.toLowerCase().includes(lowerQuery) ||
      el.selector.toLowerCase().includes(lowerQuery)
  );
}
