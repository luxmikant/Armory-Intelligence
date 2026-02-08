/**
 * @file weapon-showdown.tsx
 * @description Head-to-head weapon comparison: Star Wars vs Real World
 * 
 * Epic split-screen showdown between a sci-fi weapon and its real-world equivalent.
 * Features animated stat bars, physics comparisons, and community voting.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for vote tracking
 * - AI can observe user preferences and voting patterns
 * 
 * STREAMING SAFETY:
 * - All props default safely
 * - Arrays guarded with ?? []
 * - Optional chaining on all nested access
 */

"use client";

import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";

// Weapon info schema for each side
// Using .catch() instead of .default() to handle null values from streaming
const showdownWeaponSchema = z.object({
  name: z.string().catch("Unknown").describe("Weapon name"),
  universe: z.enum(["real", "star-wars"]).catch("real").describe("Weapon universe"),
  manufacturer: z.string().catch("Unknown").describe("Manufacturer"),
  damage: z.number().catch(50).describe("Damage rating 0-100"),
  range: z.number().catch(300).describe("Effective range in meters"),
  weight: z.number().catch(3).describe("Weight in kg"),
  rateOfFire: z.string().catch("Semi-auto").describe("Rate of fire"),
  tacticalScore: z.number().catch(50).describe("Overall tactical score 0-100"),
  coolness: z.number().catch(50).describe("Coolness factor 0-100"),
  specialAbility: z.string().nullish().describe("Unique feature"),
});

// Main schema
// Using .catch() instead of .default() to handle null values from streaming
export const weaponShowdownSchema = z.object({
  title: z.string().catch("Weapon Showdown").describe("Title of the showdown"),
  sciFiWeapon: showdownWeaponSchema.nullish().describe("The Star Wars weapon"),
  realWeapon: showdownWeaponSchema.nullish().describe("The real-world equivalent"),
  rangeAnalysis: z.string().catch("Analyzing...").describe("Who wins on range and why"),
  damageAnalysis: z.string().catch("Analyzing...").describe("Who wins on damage and why"),
  physicsNote: z.string().catch("Comparing physics...").describe("Fun physics comparison"),
  tacticalVerdict: z.string().catch("Calculating...").describe("Overall tactical verdict"),
  funFact: z.string().catch("Loading fun facts...").describe("An interesting comparison fact"),
});

// State schema
export const weaponShowdownStateSchema = z.object({
  userVote: z.enum(["scifi", "real", "none"]).describe("Which side the user voted for"),
  expandedSection: z.string().nullable().describe("Which analysis section is expanded"),
});

export type WeaponShowdownProps = z.infer<typeof weaponShowdownSchema>;

function WeaponShowdownBase(props: WeaponShowdownProps) {
  const {
    title = "Weapon Showdown",
    sciFiWeapon,
    realWeapon,
    rangeAnalysis = "Analyzing...",
    damageAnalysis = "Analyzing...",
    physicsNote = "Comparing physics...",
    tacticalVerdict = "Calculating...",
    funFact = "Loading fun facts...",
  } = props ?? {};

  const safeSciFi = sciFiWeapon ?? { name: "Unknown", universe: "star-wars" as const, manufacturer: "Unknown", damage: 50, range: 300, weight: 3, rateOfFire: "Semi-auto", tacticalScore: 50, coolness: 50 };
  const safeReal = realWeapon ?? { name: "Unknown", universe: "real" as const, manufacturer: "Unknown", damage: 50, range: 300, weight: 3, rateOfFire: "Semi-auto", tacticalScore: 50, coolness: 50 };

  const [userVote, setUserVote] = useTamboComponentState<string>("userVote", "none", "none");
  const [expandedSection, setExpandedSection] = useTamboComponentState<string | null>("expandedSection", null, null);

  const comparisonStats = [
    { label: "Damage", scifi: safeSciFi.damage ?? 0, real: safeReal.damage ?? 0 },
    { label: "Range", scifi: Math.min((safeSciFi.range ?? 0) / 20, 100), real: Math.min((safeReal.range ?? 0) / 20, 100) },
    { label: "Tactical", scifi: safeSciFi.tacticalScore ?? 0, real: safeReal.tacticalScore ?? 0 },
    { label: "Coolness", scifi: safeSciFi.coolness ?? 0, real: safeReal.coolness ?? 0 },
  ];

  const sciFiTotal = comparisonStats.reduce((s, c) => s + c.scifi, 0);
  const realTotal = comparisonStats.reduce((s, c) => s + c.real, 0);
  const winner = sciFiTotal > realTotal ? "scifi" : sciFiTotal < realTotal ? "real" : "tie";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl"
    >
      <div className="rounded-xl border border-white/10 overflow-hidden bg-black/60 backdrop-blur-sm">
        {/* Title banner */}
        <div className="relative px-5 py-3 bg-gradient-to-r from-cyan-950/50 via-black to-amber-950/50 border-b border-white/10">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 8px)" }}
          />
          <div className="relative flex items-center justify-between">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
              ⚡ {safeSciFi.universe === "star-wars" ? "Sci-Fi" : "Side A"}
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {title}
            </h2>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              ◆ {safeReal.universe === "real" ? "Real" : "Side B"}
            </span>
          </div>
        </div>

        {/* Split card - weapon names */}
        <div className="grid grid-cols-2 divide-x divide-white/10">
          {/* Sci-Fi side */}
          <div className="p-4 bg-cyan-950/10">
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <h3 className="font-bold text-cyan-300 text-sm">{safeSciFi.name}</h3>
              <p className="text-[10px] text-cyan-500/60 mt-0.5">{safeSciFi.manufacturer}</p>
              {safeSciFi.specialAbility && (
                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {safeSciFi.specialAbility}
                </span>
              )}
            </div>
          </div>

          {/* Real side */}
          <div className="p-4 bg-amber-950/10">
            <div className="text-center">
              <div className="text-2xl mb-1">◆</div>
              <h3 className="font-bold text-amber-300 text-sm">{safeReal.name}</h3>
              <p className="text-[10px] text-amber-500/60 mt-0.5">{safeReal.manufacturer}</p>
              {safeReal.specialAbility && (
                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {safeReal.specialAbility}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stat comparison bars */}
        <div className="px-4 py-3 space-y-3 border-t border-white/10">
          {comparisonStats.map((stat, idx) => {
            const sciFiWins = stat.scifi > stat.real;
            return (
              <div key={stat.label || `stat-${idx}`} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono ${sciFiWins ? "text-cyan-400" : "text-slate-500"}`}>
                    {Math.round(stat.scifi)}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <span className={`text-xs font-mono ${!sciFiWins ? "text-amber-400" : "text-slate-500"}`}>
                    {Math.round(stat.real)}
                  </span>
                </div>
                <div className="flex gap-1 h-2">
                  {/* Sci-fi bar (right aligned) */}
                  <div className="flex-1 flex justify-end">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.scifi, 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-l-full ${sciFiWins ? "bg-cyan-400" : "bg-cyan-400/30"}`}
                      style={sciFiWins ? { boxShadow: "0 0 8px rgba(34,211,238,0.4)" } : {}}
                    />
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-white/20" />
                  {/* Real bar (left aligned) */}
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.real, 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-r-full ${!sciFiWins ? "bg-amber-400" : "bg-amber-400/30"}`}
                      style={!sciFiWins ? { boxShadow: "0 0 8px rgba(245,158,11,0.4)" } : {}}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analysis cards */}
        <div className="px-4 py-3 space-y-2 border-t border-white/10">
          {[
            { key: "range", icon: "🎯", label: "Range Analysis", text: rangeAnalysis },
            { key: "damage", icon: "💥", label: "Damage Analysis", text: damageAnalysis },
            { key: "physics", icon: "🔬", label: "Physics Note", text: physicsNote },
          ].map((section, idx) => (
            <button
              key={section.key || `section-${idx}`}
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-all border border-white/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  {section.icon} {section.label}
                </span>
                <span className="text-[10px] text-slate-600">
                  {expandedSection === section.key ? "▲" : "▼"}
                </span>
              </div>
              <AnimatePresence>
                {expandedSection === section.key && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-xs text-slate-400 mt-2 leading-relaxed overflow-hidden"
                  >
                    {section.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {/* Fun fact */}
        <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02]">
          <p className="text-[11px] text-slate-400 italic">
            🤓 <span className="text-slate-300 font-medium">Fun Fact:</span> {funFact}
          </p>
        </div>

        {/* Verdict + voting */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="text-center mb-3">
            <span className={`text-xs font-bold uppercase tracking-widest
              ${winner === "scifi" ? "text-cyan-400" : winner === "real" ? "text-amber-400" : "text-white"}
            `}>
              {winner === "scifi" ? `⚡ ${safeSciFi.name} Wins` : winner === "real" ? `◆ ${safeReal.name} Wins` : "🤝 Dead Even"}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">{tacticalVerdict}</p>
          </div>

          {/* Vote buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setUserVote("scifi")}
              className={`text-xs py-2 rounded-lg border transition-all font-medium
                ${userVote === "scifi"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "border-white/10 text-slate-500 hover:text-cyan-300 hover:border-cyan-500/30"
                }`}
            >
              {userVote === "scifi" ? "✓ " : ""}Vote Sci-Fi
            </button>
            <button
              onClick={() => setUserVote("real")}
              className={`text-xs py-2 rounded-lg border transition-all font-medium
                ${userVote === "real"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10"
                  : "border-white/10 text-slate-500 hover:text-amber-300 hover:border-amber-500/30"
                }`}
            >
              {userVote === "real" ? "✓ " : ""}Vote Real
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const WeaponShowdown = withInteractable(WeaponShowdownBase, {
  componentName: "WeaponShowdown",
  description: "Head-to-head comparison between a Star Wars weapon and its real-world equivalent with animated stat bars, physics analysis, and voting.",
  propsSchema: weaponShowdownSchema,
  stateSchema: weaponShowdownStateSchema,
});

export { weaponShowdownSchema as weaponShowdownPropsSchema };
