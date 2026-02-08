/**
 * @file theme.ts
 * @description Arsenal Nexus Star Wars × Modern Military theme system
 * 
 * Three themes: Empire (dark Imperial red), Rebellion (warm orange), Tactical (military green)
 * Used for dynamic theming across the UI.
 */

export type ThemeMode = "empire" | "rebellion" | "tactical";

export interface Theme {
  name: string;
  label: string;
  icon: string;
  tagline: string;
  colors: {
    primary: string;
    primaryGlow: string;
    secondary: string;
    accent: string;
    bg: string;
    bgCard: string;
    border: string;
    text: string;
    textMuted: string;
  };
  css: Record<string, string>;
}

export const themes: Record<ThemeMode, Theme> = {
  empire: {
    name: "empire",
    label: "Galactic Empire",
    icon: "⚡",
    tagline: "The Empire's Finest Arsenal",
    colors: {
      primary: "#ef4444",
      primaryGlow: "rgba(239,68,68,0.3)",
      secondary: "#1e293b",
      accent: "#f87171",
      bg: "#0a0a0f",
      bgCard: "#111118",
      border: "rgba(239,68,68,0.15)",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
    },
    css: {
      "--theme-primary": "#ef4444",
      "--theme-glow": "0 0 30px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1)",
      "--theme-border": "rgba(239,68,68,0.15)",
      "--theme-bg-card": "#111118",
      "--theme-gradient": "linear-gradient(135deg, #ef4444, #dc2626)",
    },
  },
  rebellion: {
    name: "rebellion",
    label: "Rebel Alliance",
    icon: "✦",
    tagline: "Hope Burns Bright",
    colors: {
      primary: "#f97316",
      primaryGlow: "rgba(249,115,22,0.3)",
      secondary: "#1c1917",
      accent: "#fb923c",
      bg: "#0c0a09",
      bgCard: "#1c1917",
      border: "rgba(249,115,22,0.15)",
      text: "#fafaf9",
      textMuted: "#a8a29e",
    },
    css: {
      "--theme-primary": "#f97316",
      "--theme-glow": "0 0 30px rgba(249,115,22,0.3), 0 0 60px rgba(249,115,22,0.1)",
      "--theme-border": "rgba(249,115,22,0.15)",
      "--theme-bg-card": "#1c1917",
      "--theme-gradient": "linear-gradient(135deg, #f97316, #ea580c)",
    },
  },
  tactical: {
    name: "tactical",
    label: "Tactical Ops",
    icon: "◆",
    tagline: "Modern Warfare Meets the Future",
    colors: {
      primary: "#22c55e",
      primaryGlow: "rgba(34,197,94,0.3)",
      secondary: "#0f172a",
      accent: "#4ade80",
      bg: "#080c0a",
      bgCard: "#0f1a14",
      border: "rgba(34,197,94,0.15)",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
    },
    css: {
      "--theme-primary": "#22c55e",
      "--theme-glow": "0 0 30px rgba(34,197,94,0.3), 0 0 60px rgba(34,197,94,0.1)",
      "--theme-border": "rgba(34,197,94,0.15)",
      "--theme-bg-card": "#0f1a14",
      "--theme-gradient": "linear-gradient(135deg, #22c55e, #16a34a)",
    },
  },
};

export function getTheme(mode: ThemeMode): Theme {
  return themes[mode];
}

// Universe color: sci-fi = blue/cyan, real = amber/orange
export function getUniverseColor(universe: "real" | "star-wars") {
  return universe === "star-wars"
    ? { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" }
    : { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/20" };
}

// Star/rating display helpers
export function renderStars(rating: number, max = 100): string {
  const stars = Math.round((rating / max) * 5);
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}
