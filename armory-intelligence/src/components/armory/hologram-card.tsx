/**
 * @file hologram-card.tsx
 * @description Star Wars-themed holographic weapon card with flickering effect
 * 
 * Displays weapons in a holographic style inspired by Star Wars holo-projectors.
 * Sci-fi weapons get a cyan/blue hologram, real weapons get amber/gold.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for AI-visible state
 * - AI can observe user selections and comparison requests
 * 
 * STREAMING SAFETY:
 * - All props default safely via schema .default()
 * - All arrays guarded with ?? []
 * - All optional chains used for nested props
 */

"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";
import { getUniverseColor, renderStars } from "@/lib/theme";

// Schema for Tambo AI component registration
// Using .catch() instead of .default() to handle null values from streaming
export const hologramCardSchema = z.object({
  name: z.string().catch("Unknown Weapon").describe("The weapon name"),
  universe: z.enum(["real", "star-wars"]).catch("real").describe("Whether this is a real or Star Wars weapon"),
  category: z.string().catch("rifle").describe("Weapon category (rifle, pistol, heavy, etc.)"),
  manufacturer: z.string().catch("Unknown").describe("Who manufactured the weapon"),
  era: z.string().catch("Modern").describe("The era (e.g., 'Galactic Civil War', 'Modern', 'WWII')"),
  description: z.string().catch("No data available.").describe("Brief description of the weapon"),
  damageRating: z.number().catch(50).describe("Damage rating 0-100"),
  effectiveRange: z.number().catch(300).describe("Effective range in meters"),
  weight: z.number().catch(3.5).describe("Weight in kilograms"),
  rateOfFire: z.string().catch("Semi-automatic").describe("Rate of fire description"),
  coolnessFactor: z.number().catch(50).describe("Coolness rating 0-100"),
  tacticalScore: z.number().catch(50).describe("Overall tactical effectiveness 0-100"),
  communityRating: z.number().catch(0).describe("Community rating 0-5"),
  specialFeature: z.string().nullish().describe("Unique feature like 'Stun setting' or 'Bayonet lug'"),
  comparisonNotes: z.string().nullish().describe("Notes about real-world equivalent or sci-fi counterpart"),
  imageUrl: z.string().nullish().describe("URL to weapon image"),
});

// State schema
export const hologramCardStateSchema = z.object({
  isFlipped: z.boolean().describe("Whether the card is showing the back side"),
  isSelected: z.boolean().describe("Whether the user selected this card"),
  wantsComparison: z.boolean().describe("Whether the user wants to compare this weapon"),
});

export type HologramCardProps = z.infer<typeof hologramCardSchema>;

function HologramCardBase(props: HologramCardProps) {
  const {
    name = "Unknown Weapon",
    universe = "real",
    category = "rifle",
    manufacturer = "Unknown",
    era = "Modern",
    description = "No data available.",
    damageRating = 50,
    effectiveRange = 300,
    weight = 3.5,
    rateOfFire = "Semi-automatic",
    coolnessFactor = 50,
    tacticalScore = 50,
    communityRating = 0,
    specialFeature,
    comparisonNotes,
  } = props ?? {};

  const [isFlipped, setIsFlipped] = useTamboComponentState("isFlipped", false, false);
  const [isSelected, setIsSelected] = useTamboComponentState("isSelected", false, false);
  const [wantsComparison, setWantsComparison] = useTamboComponentState("wantsComparison", false, false);

  const colors = getUniverseColor(universe);
  const isStarWars = universe === "star-wars";

  const stats = [
    { label: "DMG", value: damageRating ?? 0, max: 100 },
    { label: "RNG", value: Math.min((effectiveRange ?? 0) / 20, 100), max: 100 },
    { label: "TAC", value: tacticalScore ?? 0, max: 100 },
    { label: "COOL", value: coolnessFactor ?? 0, max: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <div
        className={`
          relative overflow-hidden rounded-xl border backdrop-blur-sm
          ${colors.border} ${colors.bg}
          ${isStarWars ? "hologram-flicker" : ""}
          hover:shadow-lg transition-all duration-300
          ${isSelected ? `ring-2 ring-offset-2 ring-offset-black ${isStarWars ? "ring-cyan-400" : "ring-amber-400"}` : ""}
        `}
        style={{
          boxShadow: isStarWars
            ? "0 0 20px rgba(34,211,238,0.15), inset 0 0 30px rgba(34,211,238,0.05)"
            : "0 0 20px rgba(245,158,11,0.15), inset 0 0 30px rgba(245,158,11,0.05)",
        }}
      >
        {/* Scan lines overlay for hologram effect */}
        {isStarWars && (
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.4) 2px, rgba(0,255,255,0.4) 4px)",
            }}
          />
        )}

        {/* Header */}
        <div className={`relative px-4 pt-4 pb-3 border-b ${colors.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {isStarWars ? "⚡ HOLONET" : "◆ MILSPEC"}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {category}
                </span>
              </div>
              <h3 className={`font-bold text-lg leading-tight ${colors.text} truncate`}>
                {name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {manufacturer} · {era}
              </p>
            </div>
            
            {/* Tactical score badge */}
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${colors.bg} border ${colors.border}`}>
              <span className={`text-lg font-black ${colors.text}`}>{tacticalScore}</span>
              <span className="text-[8px] text-slate-500 uppercase">TAC</span>
            </div>
          </div>
        </div>

        {/* Stats bars */}
        <div className="px-4 py-3 space-y-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-500 w-8">{stat.label}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.value, stat.max)}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className={`h-full rounded-full ${isStarWars ? "bg-cyan-400" : "bg-amber-400"}`}
                  style={{
                    boxShadow: isStarWars
                      ? "0 0 8px rgba(34,211,238,0.5)"
                      : "0 0 8px rgba(245,158,11,0.5)",
                  }}
                />
              </div>
              <span className={`text-[10px] font-mono ${colors.text} w-6 text-right`}>
                {Math.round(stat.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Specs grid */}
        <div className={`grid grid-cols-3 gap-px bg-white/[0.03] border-t ${colors.border}`}>
          {[
            { label: "Range", value: `${effectiveRange}m` },
            { label: "Weight", value: `${weight}kg` },
            { label: "RoF", value: rateOfFire },
          ].map((spec) => (
            <div key={spec.label} className="px-3 py-2 bg-black/30 text-center">
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">{spec.label}</div>
              <div className={`text-xs font-medium ${colors.text} mt-0.5 truncate`}>{spec.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className={`px-4 py-3 border-t ${colors.border}`}>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{description}</p>
          
          {specialFeature && (
            <div className={`mt-2 flex items-center gap-1.5 text-[10px] ${colors.text}`}>
              <span>{isStarWars ? "⚡" : "★"}</span>
              <span className="font-medium">{specialFeature}</span>
            </div>
          )}
        </div>

        {/* Community rating + actions */}
        <div className={`flex items-center justify-between px-4 py-2.5 border-t ${colors.border} bg-white/[0.02]`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isStarWars ? "text-cyan-400" : "text-amber-400"}`}>
              {renderStars(communityRating * 20)}
            </span>
            <span className="text-[10px] text-slate-600">
              {communityRating > 0 ? communityRating.toFixed(1) : "Unrated"}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSelected(!isSelected)}
              className={`text-[10px] px-2.5 py-1 rounded-md border transition-all
                ${isSelected 
                  ? `${colors.bg} ${colors.text} ${colors.border}` 
                  : "border-white/10 text-slate-500 hover:text-white hover:border-white/20"
                }`}
            >
              {isSelected ? "✓ Selected" : "Select"}
            </button>
            <button
              onClick={() => setWantsComparison(true)}
              className="text-[10px] px-2.5 py-1 rounded-md border border-white/10 text-slate-500 hover:text-white hover:border-white/20 transition-all"
            >
              Compare
            </button>
          </div>
        </div>

        {/* Comparison notes footer */}
        {comparisonNotes && (
          <div className={`px-4 py-2 border-t ${colors.border} bg-white/[0.01]`}>
            <p className="text-[10px] text-slate-600 italic">
              💡 {comparisonNotes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const HologramCard = withInteractable(HologramCardBase, {
  componentName: "HologramCard",
  description: "A holographic weapon card that displays weapon details in a Star Wars-inspired hologram style. Sci-fi weapons get cyan hologram effect, real weapons get amber military style. Users can select weapons and request comparisons.",
  propsSchema: hologramCardSchema,
  stateSchema: hologramCardStateSchema,
});

export { hologramCardSchema as hologramCardPropsSchema };
