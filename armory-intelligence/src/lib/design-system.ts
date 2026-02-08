/**
 * @file design-system.ts
 * @description Arsenal Nexus Cinematic Design System
 * 
 * Design Philosophy:
 * - Deep space + military hangar aesthetic
 * - Near-black / deep navy base
 * - Gunmetal gray for cards and panels (industrial, machined look)
 * - Orange/amber gradients: Real guns, heat, power, muzzle flash
 * - Cyan/electric blue gradients: Star Wars blasters, holograms, futuristic energy
 * - Minimal, premium, serious — no bright colors, no neon overload
 * - Tactical, sci-fi, elite armory dashboard
 * 
 * Loose coupling: Components import from this file, not hardcoded values
 */

// ============================================
// COLOR PALETTE
// ============================================

export const colors = {
  // Base backgrounds (dark space)
  bg: {
    void: "#030305",        // Deepest black - page bg
    space: "#08090d",       // Deep space navy - sections
    hangar: "#0c0e14",      // Military hangar - alt sections
    panel: "#12141c",       // Gunmetal panel bg
    card: "#181a24",        // Card surface
    cardHover: "#1e2130",   // Card hover state
    elevated: "#22252f",    // Elevated surfaces
  },

  // Accent: Real World (Orange/Amber - heat, power, muzzle flash)
  real: {
    primary: "#f97316",     // Orange-500
    secondary: "#fb923c",   // Orange-400
    muted: "#ea580c",       // Orange-600
    glow: "rgba(249,115,22,0.15)",
    glowStrong: "rgba(249,115,22,0.3)",
    gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #d97706 100%)",
    gradientSubtle: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(245,158,11,0.05) 100%)",
    border: "rgba(249,115,22,0.2)",
    borderStrong: "rgba(249,115,22,0.4)",
  },

  // Accent: Star Wars (Cyan/Electric Blue - holograms, energy)
  scifi: {
    primary: "#22d3ee",     // Cyan-400
    secondary: "#67e8f9",   // Cyan-300
    muted: "#06b6d4",       // Cyan-500
    glow: "rgba(34,211,238,0.15)",
    glowStrong: "rgba(34,211,238,0.3)",
    gradient: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)",
    gradientSubtle: "linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(6,182,212,0.05) 100%)",
    border: "rgba(34,211,238,0.2)",
    borderStrong: "rgba(34,211,238,0.4)",
  },

  // Neutrals (gunmetal grays)
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // Semantic
  semantic: {
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
    info: "#3b82f6",
  },

  // Text
  text: {
    primary: "#f1f5f9",      // Light gray - main text
    secondary: "#94a3b8",    // Muted gray - secondary text
    muted: "#64748b",        // Dim - tertiary text
    inverse: "#030305",      // Dark text on light bg
  },

  // Borders
  border: {
    subtle: "rgba(255,255,255,0.04)",
    default: "rgba(255,255,255,0.08)",
    strong: "rgba(255,255,255,0.12)",
  },
} as const;

// ============================================
// EFFECTS & SHADOWS
// ============================================

export const effects = {
  // Glows (used sparingly for CTAs, energy, highlights)
  glow: {
    realSoft: "0 0 20px rgba(249,115,22,0.1), 0 0 40px rgba(249,115,22,0.05)",
    real: "0 0 30px rgba(249,115,22,0.2), 0 0 60px rgba(249,115,22,0.1)",
    realStrong: "0 0 40px rgba(249,115,22,0.3), 0 0 80px rgba(249,115,22,0.15)",
    scifiSoft: "0 0 20px rgba(34,211,238,0.1), 0 0 40px rgba(34,211,238,0.05)",
    scifi: "0 0 30px rgba(34,211,238,0.2), 0 0 60px rgba(34,211,238,0.1)",
    scifiStrong: "0 0 40px rgba(34,211,238,0.3), 0 0 80px rgba(34,211,238,0.15)",
  },

  // Shadows for cards and panels
  shadow: {
    card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
    cardHover: "0 8px 32px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)",
    panel: "0 4px 16px rgba(0,0,0,0.3)",
    modal: "0 16px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)",
  },

  // Gradients (cinematic, subtle)
  gradient: {
    // Hero bg gradients
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.08), transparent 70%)",
    heroGrid: "linear-gradient(rgba(249,115,22,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.015) 1px, transparent 1px)",
    // Section gradients  
    sectionReal: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(249,115,22,0.06), transparent 70%)",
    sectionSciFi: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,211,238,0.06), transparent 70%)",
    // Card gradients
    cardReal: "linear-gradient(135deg, rgba(249,115,22,0.02) 0%, transparent 50%)",
    cardSciFi: "linear-gradient(135deg, rgba(34,211,238,0.02) 0%, transparent 50%)",
    // Overlays
    fadeDown: "linear-gradient(to bottom, transparent 0%, #030305 100%)",
    fadeUp: "linear-gradient(to top, transparent 0%, #030305 100%)",
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font families
  font: {
    display: "'Inter', system-ui, sans-serif",  // Headers
    body: "'Inter', system-ui, sans-serif",     // Body text
    mono: "'JetBrains Mono', monospace",        // Code, technical data
  },

  // Font sizes with line heights
  size: {
    hero: { size: "4.5rem", lineHeight: "0.95", tracking: "-0.03em" },
    h1: { size: "3rem", lineHeight: "1", tracking: "-0.025em" },
    h2: { size: "2.25rem", lineHeight: "1.1", tracking: "-0.02em" },
    h3: { size: "1.5rem", lineHeight: "1.25", tracking: "-0.01em" },
    h4: { size: "1.25rem", lineHeight: "1.35", tracking: "0" },
    body: { size: "1rem", lineHeight: "1.6", tracking: "0" },
    small: { size: "0.875rem", lineHeight: "1.5", tracking: "0" },
    xs: { size: "0.75rem", lineHeight: "1.4", tracking: "0.01em" },
    mono: { size: "0.8125rem", lineHeight: "1.5", tracking: "0.02em" },
  },

  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
} as const;

// ============================================
// SPACING & LAYOUT
// ============================================

export const layout = {
  // Container max widths
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Spacing scale
  space: {
    px: "1px",
    0: "0",
    0.5: "0.125rem",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
  },

  // Border radius
  radius: {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
} as const;

// ============================================
// ANIMATIONS
// ============================================

export const animation = {
  // Timing functions
  ease: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Durations
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    slowest: "800ms",
  },

  // Keyframe animations (referenced in CSS)
  keyframes: {
    hologramFlicker: "hologram-flicker",
    glowPulse: "glow-pulse",
    scanLine: "scan-line",
    float: "float",
  },
} as const;

// ============================================
// COMPONENT HELPERS
// ============================================

/**
 * Get accent colors based on universe type
 */
export function getUniverseAccent(universe: "real" | "star-wars" | "scifi") {
  return universe === "real" ? colors.real : colors.scifi;
}

/**
 * Get card styles for a given universe
 */
export function getCardStyles(universe: "real" | "star-wars" | "scifi") {
  const accent = getUniverseAccent(universe);
  return {
    background: colors.bg.card,
    border: accent.border,
    gradient: accent.gradientSubtle,
    glow: accent.glow,
    glowHover: accent.glowStrong,
    textAccent: accent.primary,
  };
}

/**
 * Generate CSS variables for runtime theming
 */
export function getCSSVariables() {
  return {
    "--color-bg-void": colors.bg.void,
    "--color-bg-space": colors.bg.space,
    "--color-bg-hangar": colors.bg.hangar,
    "--color-bg-panel": colors.bg.panel,
    "--color-bg-card": colors.bg.card,
    "--color-real-primary": colors.real.primary,
    "--color-real-glow": colors.real.glow,
    "--color-scifi-primary": colors.scifi.primary,
    "--color-scifi-glow": colors.scifi.glow,
    "--color-text-primary": colors.text.primary,
    "--color-text-secondary": colors.text.secondary,
    "--color-border": colors.border.default,
  };
}

// ============================================
// TAILWIND CLASS HELPERS
// ============================================

export const tw = {
  // Card base styles
  card: "bg-[#181a24] border border-white/[0.06] rounded-xl",
  cardHover: "hover:border-white/[0.1] hover:bg-[#1e2130] transition-all duration-200",
  
  // Panel styles
  panel: "bg-[#12141c] border border-white/[0.04] rounded-lg",
  
  // Text styles
  textPrimary: "text-slate-100",
  textSecondary: "text-slate-400",
  textMuted: "text-slate-500",
  
  // Button styles
  btnReal: "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-semibold hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]",
  btnSciFi: "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-semibold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]",
  btnGhost: "border border-white/10 text-slate-300 hover:bg-white/5",
  
  // Glow effects
  glowReal: "shadow-[0_0_30px_rgba(249,115,22,0.2)]",
  glowSciFi: "shadow-[0_0_30px_rgba(34,211,238,0.2)]",
  
  // Accent borders
  borderReal: "border-orange-500/20",
  borderSciFi: "border-cyan-400/20",
} as const;

export type ColorKey = keyof typeof colors;
export type EffectKey = keyof typeof effects;
