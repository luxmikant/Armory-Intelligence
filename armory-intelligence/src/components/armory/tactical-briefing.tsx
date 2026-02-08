/**
 * @file tactical-briefing.tsx
 * @description AI-generated tactical mission briefing component
 * 
 * Displays Star Wars-style mission briefings combining sci-fi and real military tactics.
 * Inspired by the Rebel Alliance strategy room aesthetic.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for progress tracking
 * - AI can observe which sections the user reads
 * 
 * STREAMING SAFETY:
 * - All props default safely
 * - Arrays guarded with ?? []
 * - Optional chaining on all nested access
 */

"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";

// Schema
// Using .catch() instead of .default() to handle null values from streaming
export const tacticalBriefingSchema = z.object({
  missionName: z.string().catch("Classified Operation").describe("Name of the tactical mission/briefing"),
  classification: z.enum(["public", "restricted", "classified", "top-secret"]).catch("restricted").describe("Security classification level"),
  briefingText: z.string().catch("Briefing loading...").describe("Main briefing text with tactical analysis"),
  weaponRecommendations: z.array(z.object({
    name: z.string().catch("Unknown").describe("Weapon name"),
    universe: z.enum(["real", "star-wars"]).catch("real").describe("Weapon universe"),
    reason: z.string().catch("Standard issue").describe("Why this weapon is recommended"),
    rating: z.number().catch(3).describe("Suitability rating 1-5"),
  })).catch([]).describe("Recommended weapons for this mission"),
  threatAssessment: z.enum(["low", "moderate", "high", "critical"]).catch("moderate").describe("Threat level"),
  terrain: z.string().catch("Unknown terrain").describe("Mission terrain or environment"),
  objectives: z.array(z.string()).catch(["Complete the mission"]).describe("List of mission objectives"),
  tacticalNotes: z.string().nullish().describe("Additional tactical notes or warnings"),
  historicalReference: z.string().nullish().describe("Real historical military parallel"),
  starWarsReference: z.string().nullish().describe("Star Wars universe parallel"),
});

// State
export const tacticalBriefingStateSchema = z.object({
  isAccepted: z.boolean().describe("Whether the user accepted the mission"),
  readSections: z.array(z.string()).describe("Which sections the user has read"),
  selectedWeapon: z.string().nullable().describe("Which weapon the user selected"),
});

export type TacticalBriefingProps = z.infer<typeof tacticalBriefingSchema>;

const threatColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  low: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", glow: "shadow-green-500/20" },
  moderate: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", glow: "shadow-yellow-500/20" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
  critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/20" },
};

const classificationBadges: Record<string, string> = {
  public: "bg-green-500/10 text-green-400 border-green-500/20",
  restricted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  classified: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "top-secret": "bg-red-500/10 text-red-400 border-red-500/20",
};

function TacticalBriefingBase(props: TacticalBriefingProps) {
  const {
    missionName = "Classified Operation",
    classification = "restricted",
    briefingText = "Briefing loading...",
    weaponRecommendations,
    threatAssessment = "moderate",
    terrain = "Unknown terrain",
    objectives,
    tacticalNotes,
    historicalReference,
    starWarsReference,
  } = props ?? {};

  const safeWeapons = weaponRecommendations ?? [];
  const safeObjectives = objectives ?? ["Complete the mission"];

  const [isAccepted, setIsAccepted] = useTamboComponentState("isAccepted", false, false);
  const [readSections, setReadSections] = useTamboComponentState<string[]>("readSections", [], []);
  const [selectedWeapon, setSelectedWeapon] = useTamboComponentState<string | null>("selectedWeapon", null, null);

  const threat = threatColors[threatAssessment] ?? threatColors.moderate;
  const classifBadge = classificationBadges[classification] ?? classificationBadges.restricted;

  const markRead = (section: string) => {
    const read = readSections ?? [];
    if (!read.includes(section)) {
      setReadSections([...read, section]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl"
    >
      <div className="rounded-xl border border-white/10 overflow-hidden bg-black/60 backdrop-blur-sm">
        {/* Header - Imperial styled */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/10">
          {/* Pulsing scanline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${classifBadge}`}>
                  {classification?.toUpperCase()}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${threat.bg} ${threat.text} border ${threat.border}`}>
                  THREAT: {threatAssessment?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{missionName}</h2>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                TERRAIN: {terrain?.toUpperCase()} · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
            
            {/* Threat indicator */}
            <div className={`w-3 h-3 rounded-full ${threat.bg} ${threat.border} border shadow-lg ${threat.glow} animate-pulse`} />
          </div>
        </div>

        {/* Mission Objectives */}
        <div className="px-5 py-3 border-b border-white/10" onClick={() => markRead("objectives")}>
          <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
            ◆ Mission Objectives
          </h3>
          <div className="space-y-1.5">
            {safeObjectives.map((obj, idx) => (
              <div key={`obj-${idx}`} className="flex items-start gap-2">
                <span className="text-cyan-500 text-xs mt-0.5">▸</span>
                <span className="text-xs text-slate-300 leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Briefing Text */}
        <div className="px-5 py-3 border-b border-white/10" onClick={() => markRead("briefing")}>
          <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
            ◆ Tactical Briefing
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {briefingText}
          </p>
        </div>

        {/* Weapon Recommendations */}
        {safeWeapons.length > 0 && (
          <div className="px-5 py-3 border-b border-white/10" onClick={() => markRead("weapons")}>
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
              ◆ Recommended Armament
            </h3>
            <div className="space-y-2">
              {safeWeapons.map((weapon, idx) => {
                const isSciFi = weapon?.universe === "star-wars";
                const isWeaponSelected = selectedWeapon === weapon?.name;
                return (
                  <button
                    key={weapon?.name || `weapon-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeapon(weapon?.name ?? null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-all
                      ${isWeaponSelected
                        ? `${isSciFi ? "bg-cyan-500/10 border-cyan-500/30" : "bg-amber-500/10 border-amber-500/30"}`
                        : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{isSciFi ? "⚡" : "◆"}</span>
                        <span className={`text-xs font-medium ${isSciFi ? "text-cyan-300" : "text-amber-300"}`}>
                          {weapon?.name ?? "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={`star-${idx}-${i}`} className={`text-[8px] ${i < (weapon?.rating ?? 0) ? (isSciFi ? "text-cyan-400" : "text-amber-400") : "text-slate-700"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 pl-5">{weapon?.reason}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* References */}
        {(historicalReference || starWarsReference) && (
          <div className="px-5 py-3 border-b border-white/10 space-y-2" onClick={() => markRead("references")}>
            {historicalReference && (
              <div className="flex items-start gap-2">
                <span className="text-amber-500 text-xs mt-0.5">📚</span>
                <div>
                  <span className="text-[9px] text-amber-500/60 uppercase tracking-wider font-bold">Historical Parallel</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{historicalReference}</p>
                </div>
              </div>
            )}
            {starWarsReference && (
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 text-xs mt-0.5">🌌</span>
                <div>
                  <span className="text-[9px] text-cyan-500/60 uppercase tracking-wider font-bold">Star Wars Parallel</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{starWarsReference}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tactical notes */}
        {tacticalNotes && (
          <div className="px-5 py-3 border-b border-white/10 bg-yellow-500/[0.02]" onClick={() => markRead("notes")}>
            <p className="text-[10px] text-yellow-400/80 flex items-start gap-2">
              <span>⚠</span>
              <span className="leading-relaxed">{tacticalNotes}</span>
            </p>
          </div>
        )}

        {/* Accept mission */}
        <div className="px-5 py-3 bg-white/[0.02]">
          <button
            onClick={() => setIsAccepted(!isAccepted)}
            className={`w-full text-xs py-2.5 rounded-lg border font-bold uppercase tracking-wider transition-all
              ${isAccepted
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                : "border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
          >
            {isAccepted ? "✓ Mission Accepted" : "Accept Mission Briefing"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export const TacticalBriefing = withInteractable(TacticalBriefingBase, {
  componentName: "TacticalBriefing",
  description: "Star Wars-style tactical mission briefing that blends sci-fi scenarios with real military tactics. Shows objectives, threat assessment, weapon recommendations, and historical parallels.",
  propsSchema: tacticalBriefingSchema,
  stateSchema: tacticalBriefingStateSchema,
});

export { tacticalBriefingSchema as tacticalBriefingPropsSchema };
