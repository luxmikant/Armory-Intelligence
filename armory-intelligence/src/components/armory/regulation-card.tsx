/**
 * @file regulation-card.tsx
 * @description Component displaying state firearms regulations with requirements and restrictions
 */

"use client";

import { motion } from "framer-motion";
import { z } from "zod";

export const regulationCardSchema = z.object({
  state: z.string().describe("State name or two-letter code"),
  stateCode: z.string().describe("Two-letter state code"),
  permitRequired: z.boolean().describe("Whether a permit is required for purchase"),
  permitType: z.string().optional().describe("Type of permit if required"),
  openCarry: z.enum(["allowed", "restricted", "prohibited"]).describe("Open carry status"),
  concealedCarry: z.enum(["shall-issue", "may-issue", "no-issue", "unrestricted"]).describe("Concealed carry policy"),
  waitingPeriod: z.number().optional().describe("Waiting period in days, if any"),
  backgroundCheck: z.boolean().describe("Whether background check is required"),
  registrationRequired: z.boolean().describe("Whether firearm registration is required"),
  assaultWeaponBan: z.boolean().describe("Whether assault weapons are banned"),
  magazineCapacityLimit: z.number().optional().describe("Maximum magazine capacity, if limited"),
  redFlagLaw: z.boolean().describe("Whether red flag laws are in effect"),
  reciprocalStates: z.array(z.string()).optional().describe("States with CCW reciprocity"),
  lastUpdated: z.string().optional().describe("Date regulations were last updated"),
  disclaimer: z.string().optional().describe("Legal disclaimer text"),
});

export type RegulationCardProps = z.infer<typeof regulationCardSchema>;

function StatusBadge({ status, label }: { status: "allowed" | "restricted" | "prohibited" | "required" | "not-required"; label: string }) {
  const colors = {
    allowed: "bg-green-500/20 text-green-400 border-green-500/30",
    restricted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    prohibited: "bg-red-500/20 text-red-400 border-red-500/30",
    required: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "not-required": "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[status]}`}>
      {label}
    </span>
  );
}

export function RegulationCard({
  state,
  stateCode,
  permitRequired,
  permitType,
  openCarry,
  concealedCarry,
  waitingPeriod,
  backgroundCheck,
  registrationRequired,
  assaultWeaponBan,
  magazineCapacityLimit,
  redFlagLaw,
  reciprocalStates = [],
  lastUpdated,
  disclaimer,
}: RegulationCardProps) {
  const getCCWLabel = () => {
    switch (concealedCarry) {
      case "shall-issue": return "Shall Issue";
      case "may-issue": return "May Issue";
      case "no-issue": return "No Issue";
      case "unrestricted": return "Constitutional Carry";
      default: return concealedCarry;
    }
  };

  const getCCWStatus = (): "allowed" | "restricted" | "prohibited" => {
    switch (concealedCarry) {
      case "unrestricted":
      case "shall-issue":
        return "allowed";
      case "may-issue":
        return "restricted";
      case "no-issue":
        return "prohibited";
      default:
        return "restricted";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{state}</h3>
            <p className="text-slate-400 text-sm">{stateCode} Firearms Regulations</p>
          </div>
          <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-orange-400">{stateCode}</span>
          </div>
        </div>
      </div>

      {/* Main Regulations */}
      <div className="p-6 space-y-6">
        {/* Key Policies */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Open Carry</p>
            <StatusBadge 
              status={openCarry} 
              label={openCarry.charAt(0).toUpperCase() + openCarry.slice(1)} 
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Concealed Carry</p>
            <StatusBadge status={getCCWStatus()} label={getCCWLabel()} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Permit Required</p>
            <StatusBadge 
              status={permitRequired ? "required" : "not-required"} 
              label={permitRequired ? (permitType || "Yes") : "No"} 
            />
          </div>
        </div>

        {/* Requirements List */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Requirements</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-300">Background Check</span>
              <span className={backgroundCheck ? "text-green-400" : "text-slate-500"}>
                {backgroundCheck ? "✓ Required" : "○ Not Required"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-300">Registration</span>
              <span className={registrationRequired ? "text-orange-400" : "text-slate-500"}>
                {registrationRequired ? "✓ Required" : "○ Not Required"}
              </span>
            </div>
            {waitingPeriod !== undefined && (
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-300">Waiting Period</span>
                <span className={waitingPeriod > 0 ? "text-orange-400" : "text-slate-500"}>
                  {waitingPeriod > 0 ? `${waitingPeriod} days` : "None"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Restrictions */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Restrictions</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${assaultWeaponBan ? "bg-red-500/10 border-red-500/30" : "bg-slate-800 border-slate-700"}`}>
              <p className="text-xs text-slate-400">Assault Weapon Ban</p>
              <p className={`font-medium ${assaultWeaponBan ? "text-red-400" : "text-green-400"}`}>
                {assaultWeaponBan ? "Yes" : "No"}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${magazineCapacityLimit ? "bg-orange-500/10 border-orange-500/30" : "bg-slate-800 border-slate-700"}`}>
              <p className="text-xs text-slate-400">Magazine Limit</p>
              <p className={`font-medium ${magazineCapacityLimit ? "text-orange-400" : "text-green-400"}`}>
                {magazineCapacityLimit ? `${magazineCapacityLimit} rounds` : "None"}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${redFlagLaw ? "bg-yellow-500/10 border-yellow-500/30" : "bg-slate-800 border-slate-700"}`}>
              <p className="text-xs text-slate-400">Red Flag Law</p>
              <p className={`font-medium ${redFlagLaw ? "text-yellow-400" : "text-slate-400"}`}>
                {redFlagLaw ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* CCW Reciprocity */}
        {reciprocalStates.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">CCW Reciprocity</h4>
            <div className="flex flex-wrap gap-2">
              {reciprocalStates.map((recipState) => (
                <span
                  key={recipState}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700"
                >
                  {recipState}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-400">
              <strong>⚠️ Disclaimer:</strong> {disclaimer}
            </p>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-xs text-slate-500 text-right">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default RegulationCard;
