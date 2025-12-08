/**
 * Constantes de couleurs et styles pour le portfolio de Ichai
 */

export const BRAND_COLORS = {
  primary: "#8b5cf6",          // Violet lavande principal
  primaryLight: "#a78bfa",     // Violet clair
  primaryDark: "#7c3aed",      // Violet foncé

  secondary: "#6366f1",        // Indigo
  secondaryLight: "#818cf8",   // Indigo clair

  accent: "#ec4899",           // Rose accent
  accentLight: "#f472b6",      // Rose clair

  success: "#10b981",          // Vert succès
  successLight: "#34d399",     // Vert clair

  warning: "#f59e0b",          // Orange avertissement
  error: "#ef4444",            // Rouge erreur
} as const;

export const GRADIENTS = {
  primary: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
  secondary: "linear-gradient(90deg, #6366f1, #818cf8)",
  accent: "linear-gradient(90deg, #ec4899, #f472b6)",
  success: "linear-gradient(90deg, #10b981, #34d399)",
  sunset: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  ocean: "linear-gradient(135deg, #667eea 0%, #a78bfa 100%)",
} as const;

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(139, 92, 246, 0.05)",
  md: "0 4px 6px -1px rgba(139, 92, 246, 0.1)",
  lg: "0 10px 15px -3px rgba(139, 92, 246, 0.1)",
  xl: "0 20px 25px -5px rgba(139, 92, 246, 0.1)",
  hover: "0 8px 20px rgba(139, 92, 246, 0.2)",
  focus: "0 0 0 3px rgba(139, 92, 246, 0.3)",
} as const;

export const ANIMATIONS = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
} as const;

export const BORDERS = {
  radius: {
    sm: "6px",
    md: "10px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  width: {
    thin: "1px",
    normal: "2px",
    thick: "3px",
  },
} as const;

export const SPACING = {
  xs: "0.5rem",   // 8px
  sm: "0.75rem",  // 12px
  md: "1rem",     // 16px
  lg: "1.5rem",   // 24px
  xl: "2rem",     // 32px
  "2xl": "3rem",  // 48px
} as const;
