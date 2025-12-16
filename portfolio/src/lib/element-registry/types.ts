/**
 * Element Registry Types
 * Defines types for styleable elements that the AI can target
 */

export type ElementCategory =
  | "layout"
  | "navigation"
  | "ui"
  | "chat"
  | "windows"
  | "typography"
  | "media"
  | "effects";

export type StyleableElement = {
  selector: string;
  name: string;
  description: string;
  category: ElementCategory;
  componentPath?: string;
  cssClasses?: string[];
  cssVariables?: string[];
  children?: StyleableElement[];
};

export type ElementInfo = {
  selector: string;
  found: boolean;
  count: number;
  tagName: string;
  classList: string[];
  currentStyles: Record<string, string>;
  inlineStyles: Record<string, string>;
  boundingBox: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  children: Array<{ tagName: string; className: string }>;
  attributes: Record<string, string>;
  pseudoElements?: {
    before?: Record<string, string>;
    after?: Record<string, string>;
  };
};

export type ElementListResponse = {
  categories: Array<{
    name: ElementCategory;
    elements: Array<{
      selector: string;
      name: string;
      description: string;
    }>;
  }>;
};
