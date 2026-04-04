export const colors = {
  // Primary — Fresh greens (pear)
  pear: {
    50: "#f3ffe0",
    100: "#e2ffb3",
    200: "#d4ff47",
    300: "#aaff2b",
    400: "#8ecc00",
    500: "#6ba300",
  },

  // Secondary — Teal / electric blue (tech accent)
  accent: {
    50: "#e0fffe",
    100: "#b3fffc",
    200: "#00ffff",
    300: "#00d4d4",
    400: "#0070dd",
    500: "#1990ff",
  },

  // Neutral — Deep purples (background)
  neutral: {
    50: "#f5f5f7",
    100: "#e8e8ec",
    200: "#c4c4cc",
    300: "#8888a0",
    400: "#4a4a6a",
    500: "#2d2d52",
    600: "#1d2050",
    700: "#121433",
    800: "#0c0e22",
    900: "#06070f",
  },

  // Semantic
  white: "#ffffff",
  black: "#06070f",
} as const;

export const typography = {
  fontFamily: {
    heading: "'Montserrat', 'Inter', 'Helvetica Neue', sans-serif",
    body: "'Inter', 'Helvetica Neue', 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
} as const;

export const brand = {
  name: "wispear",
  domain: "wispear.ai",
  slogan: "Collective wisdom, whispered to your agent.",
  tagline: "The recommendation engine for AI agent components.",
} as const;
