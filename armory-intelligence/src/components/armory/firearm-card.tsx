/**
 * @file firearm-card.tsx
 * @description Tambo Interactable component for displaying firearm specifications
 * 
 * This component renders a detailed specification card for firearms,
 * showing key attributes like caliber, capacity, dimensions, and price.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for AI-visible state
 * - AI can observe when users select/compare firearms
 */

"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";

// Schema for Tambo AI component registration
export const firearmCardSchema = z.object({
  name: z.string().describe("The name/model of the firearm"),
  manufacturer: z.string().describe("The manufacturer/brand name"),
  type: z.enum(["handgun", "rifle", "shotgun"]).describe("The type of firearm"),
  action: z.string().describe("The action type (semi-auto, bolt, pump, lever, revolver)"),
  caliber: z.string().describe("The caliber/gauge of the firearm"),
  capacity: z.number().describe("Magazine/chamber capacity"),
  weight: z.number().describe("Weight in pounds"),
  barrelLength: z.number().describe("Barrel length in inches"),
  price: z.number().optional().describe("MSRP price in USD"),
  imageUrl: z.string().optional().describe("URL to firearm image"),
  description: z.string().optional().describe("Brief description of the firearm"),
  safetyFeatures: z.array(z.string()).optional().describe("List of safety features"),
});

// State schema for interactable tracking
export const firearmCardStateSchema = z.object({
  isExpanded: z.boolean().describe("Whether the card is showing expanded details"),
  isSelected: z.boolean().describe("Whether the user has selected this firearm"),
  isInComparison: z.boolean().describe("Whether the user added this to comparison"),
});

export type FirearmCardProps = z.infer<typeof firearmCardSchema>;

// Type icons mapping
const typeIcons: Record<string, string> = {
  handgun: "🔫",
  rifle: "🎯",
  shotgun: "💥",
};

// Action badges
const actionColors: Record<string, string> = {
  "semi-auto": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bolt": "bg-green-500/20 text-green-400 border-green-500/30",
  "pump": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "lever": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "revolver": "bg-red-500/20 text-red-400 border-red-500/30",
};

function FirearmCardBase({
  name,
  manufacturer,
  type,
  action,
  caliber,
  capacity,
  weight,
  barrelLength,
  price,
  imageUrl,
  description,
  safetyFeatures,
}: FirearmCardProps) {
  // AI-visible state using useTamboComponentState
  const [isExpanded, setIsExpanded] = useTamboComponentState(
    "isExpanded",
    false,
    false // setFromProp - initial value
  );
  
  const [isSelected, setIsSelected] = useTamboComponentState(
    "isSelected", 
    false,
    false
  );
  
  const [isInComparison, setIsInComparison] = useTamboComponentState(
    "isInComparison",
    false,
    false
  );

  const actionColorClass = actionColors[action.toLowerCase()] || "bg-slate-500/20 text-slate-400 border-slate-500/30";

  // Handler for selecting the firearm
  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  // Handler for adding to comparison
  const handleAddToComparison = () => {
    setIsInComparison(!isInComparison);
  };

  // Handler for expanding details
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-md bg-slate-900 border rounded-xl overflow-hidden shadow-xl cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "border-orange-500 ring-2 ring-orange-500/30" 
          : isInComparison 
            ? "border-blue-500 ring-2 ring-blue-500/30"
            : "border-slate-700 hover:border-slate-500"
      }`}
      onClick={handleSelect}
    >
      {/* Header with image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <div className="text-6xl opacity-30">{typeIcons[type] || "🔫"}</div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-slate-800/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-300 uppercase tracking-wider">
          {type}
        </div>
        
        {/* Action badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${actionColorClass}`}>
          {action}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-orange-500 rounded-full text-xs font-medium text-white">
            ✓ Selected
          </div>
        )}

        {/* Comparison indicator */}
        {isInComparison && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-blue-500 rounded-full text-xs font-medium text-white">
            📊 Comparing
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="mb-4">
          <p className="text-sm text-orange-400 font-medium">{manufacturer}</p>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{description}</p>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <SpecItem label="Caliber" value={caliber} icon="◎" />
          <SpecItem label="Capacity" value={`${capacity} rds`} icon="▣" />
          <SpecItem label="Weight" value={`${weight} lbs`} icon="⚖" />
          <SpecItem label="Barrel" value={`${barrelLength}"`} icon="↔" />
        </div>

        {/* Safety Features */}
        {safetyFeatures && safetyFeatures.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Safety Features</p>
            <div className="flex flex-wrap gap-1">
              {safetyFeatures.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-md border border-green-500/20"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <span className="text-sm text-slate-400">MSRP</span>
            <span className="text-2xl font-bold text-orange-400">
              ${price.toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons - AI can observe these interactions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToComparison();
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isInComparison
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {isInComparison ? "✓ In Comparison" : "📊 Compare"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand();
            }}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {isExpanded ? "▲ Less" : "▼ More Details"}
          </button>
        </div>

        {/* Expanded Details - shown when user clicks "More Details" */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-700"
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-slate-400">Action Type</div>
              <div className="text-white font-medium">{action}</div>
              <div className="text-slate-400">Weight</div>
              <div className="text-white font-medium">{weight} lbs</div>
              <div className="text-slate-400">Barrel Length</div>
              <div className="text-white font-medium">{barrelLength}&quot;</div>
              <div className="text-slate-400">Capacity</div>
              <div className="text-white font-medium">{capacity} rounds</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Helper component for spec items
function SpecItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-slate-500">{icon}</span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

/**
 * Interactable FirearmCard - Wrapped with withInteractable for AI awareness
 * 
 * This allows Tambo to:
 * 1. See current props of the component
 * 2. Update props in response to user messages
 * 3. Track user interactions (selection, comparison, expansion)
 */
export const FirearmCard = withInteractable(FirearmCardBase, {
  componentName: "FirearmCard",
  description: "A firearm specification card that displays details like caliber, capacity, weight, and price. Users can select it, add it to comparison, or expand for more details. The AI can observe these interactions.",
  propsSchema: firearmCardSchema,
  stateSchema: firearmCardStateSchema,
});

export default FirearmCard;
