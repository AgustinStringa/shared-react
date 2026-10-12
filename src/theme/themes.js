/**
 * @typedef {Object} LayoutTheme
 * @property {string} primary - Main brand color for Header background and accents
 * @property {string} primaryDark - Darker shade for Footer background and gradients
 * @property {string} [secondary] - Secondary accent color
 * @property {string} [accent] - Accent for active links, buttons, highlights
 * @property {string} [text] - Main contrast text color (default: #ffffff)
 * @property {string} [textMuted] - Muted text color for subtitles, copyright
 * @property {string} [border] - Border line color
 */

export const THEME_PRESETS = {
  // Brand themes for existing projects
  weather: {
    primary: "#00796b",       // Verde agua / teal característico
    primaryDark: "#004d40",   // Teal oscuro
    secondary: "#26a69a",     // Aguamarina
    accent: "#80cbc4",
    text: "#ffffff",
    textMuted: "#b2dfdb",
    border: "rgba(255, 255, 255, 0.15)",
  },
  veterinaria: {
    primary: "#722166",       // Violeta veterinaria
    primaryDark: "#4a1242",   // Violeta oscuro
    secondary: "#FDA60B",     // Amarillo / ámbar
    accent: "#FDA60B",
    text: "#ffffff",
    textMuted: "#f5d0fe",
    border: "rgba(255, 255, 255, 0.15)",
  },
  cotizador: {
    primary: "#3E4BEE",       // Azul principal
    primaryDark: "#171669",   // Azul índigo profundo
    secondary: "#60a5fa",
    accent: "#93c5fd",
    text: "#ffffff",
    textMuted: "#cbd5e1",
    border: "rgba(255, 255, 255, 0.15)",
  },
  presupuesto: {
    primary: "#004e92",       // Azul cobalto / financiero
    primaryDark: "#000428",   // Azul noche profundo
    secondary: "#0284c7",
    accent: "#38bdf8",
    text: "#ffffff",
    textMuted: "#93c5fd",
    border: "rgba(255, 255, 255, 0.15)",
  },
  cripto: {
    primary: "#6868d4",       // Violeta cripto original (rgb(104, 104, 212))
    primaryDark: "#0d2235",   // Azul marino espacial
    secondary: "#8b5cf6",
    accent: "#a78bfa",
    text: "#ffffff",
    textMuted: "#94a3b8",
    border: "rgba(255, 255, 255, 0.15)",
  },
  breakingBad: {
    primary: "#0f4f42",       // Verde químico Heisenberg
    primaryDark: "#062822",   // Verde bosque profundo
    secondary: "#e0ac3e",     // Amarillo dorado
    accent: "#e0ac3e",
    text: "#ffffff",
    textMuted: "#a7f3d0",
    border: "rgba(255, 255, 255, 0.15)",
  },

  // Base presets that preserve the original default variants under the new structure
  slate: {
    primary: "#334155",
    primaryDark: "#1e293b",
    secondary: "#64748b",
    accent: "#94a3b8",
    text: "#ffffff",
    textMuted: "#cbd5e1",
    border: "rgba(255, 255, 255, 0.12)",
  },
  dark: {
    primary: "#111827",
    primaryDark: "#0f172a",
    secondary: "#374151",
    accent: "#60a5fa",
    text: "#ffffff",
    textMuted: "#94a3b8",
    border: "rgba(255, 255, 255, 0.1)",
  },
  teal: {
    primary: "#00897b",
    primaryDark: "#00796b",
    secondary: "#26a69a",
    accent: "#80cbc4",
    text: "#ffffff",
    textMuted: "#b2dfdb",
    border: "rgba(255, 255, 255, 0.15)",
  },
  primary: {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    secondary: "#3b82f6",
    accent: "#93c5fd",
    text: "#ffffff",
    textMuted: "#bfdbfe",
    border: "rgba(255, 255, 255, 0.15)",
  },
};

/**
 * Normaliza y resuelve un theme a partir de un string preset o un objeto de configuración.
 * @param {string|LayoutTheme} [theme='slate']
 * @returns {LayoutTheme}
 */
export function resolveTheme(theme = "slate") {
  if (typeof theme === "string") {
    return THEME_PRESETS[theme] || THEME_PRESETS.slate;
  }

  if (theme && typeof theme === "object") {
    const fallback = THEME_PRESETS.slate;
    return {
      primary: theme.primary || fallback.primary,
      primaryDark: theme.primaryDark || theme.primary || fallback.primaryDark,
      secondary: theme.secondary || fallback.secondary,
      accent: theme.accent || theme.secondary || fallback.accent,
      text: theme.text || fallback.text,
      textMuted: theme.textMuted || fallback.textMuted,
      border: theme.border || fallback.border,
    };
  }

  return THEME_PRESETS.slate;
}
