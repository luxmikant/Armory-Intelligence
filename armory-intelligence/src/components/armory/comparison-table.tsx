/**
 * @file comparison-table.tsx
 * @description Tambo Interactable component for side-by-side firearm comparison
 * 
 * This component renders a comparison table for 2-4 firearms,
 * highlighting differences and helping users make informed decisions.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for AI-visible state
 * - AI can observe which firearms are being compared and user preferences
 */

"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";

// Single firearm schema for comparison
// Using .catch() instead of .default() to handle null values from streaming
const firearmCompareSchema = z.object({
  id: z.string().catch("").describe("Unique identifier"),
  name: z.string().catch("Unknown").describe("Firearm name/model"),
  manufacturer: z.string().catch("Unknown").describe("Manufacturer name"),
  type: z.string().catch("handgun").describe("Type of firearm"),
  caliber: z.string().catch("9mm").describe("Caliber"),
  capacity: z.number().catch(0).describe("Magazine capacity"),
  weight: z.number().catch(0).describe("Weight in lbs"),
  barrelLength: z.number().catch(0).describe("Barrel length in inches"),
  price: z.number().nullish().describe("Price in USD"),
  imageUrl: z.string().nullish().describe("Image URL"),
});

// Schema for Tambo AI component registration (props schema)
// Using .catch() instead of .default() to handle null values from streaming
export const comparisonTablePropsSchema = z.object({
  firearms: z.array(firearmCompareSchema).max(4).catch([]).describe("Array of 2-4 firearms to compare"),
  highlightDifferences: z.boolean().catch(true).describe("Whether to highlight spec differences"),
  showRecommendation: z.boolean().catch(false).describe("Whether to show AI recommendation"),
  recommendation: z.string().nullish().describe("AI recommendation text if showRecommendation is true"),
});

// State schema for interactable tracking
// Using .catch() instead of .default() to handle null values from streaming
export const comparisonTableStateSchema = z.object({
  selectedFirearmId: z.string().nullable().catch(null).describe("ID of the firearm user is focusing on"),
  removedFirearmIds: z.array(z.string()).catch([]).describe("IDs of firearms user has removed from comparison"),
  preferredSpec: z.string().nullable().catch(null).describe("The spec the user cares most about (e.g., 'price', 'capacity')"),
});

export type ComparisonTableProps = z.infer<typeof comparisonTablePropsSchema>;

// Spec row configuration
const specRows = [
  { key: "type", label: "Type", icon: "📦" },
  { key: "caliber", label: "Caliber", icon: "◎" },
  { key: "capacity", label: "Capacity", icon: "▣", suffix: " rds" },
  { key: "weight", label: "Weight", icon: "⚖", suffix: " lbs" },
  { key: "barrelLength", label: "Barrel", icon: "↔", suffix: '"' },
  { key: "price", label: "Price", icon: "💰", prefix: "$", format: "currency" },
];

export function ComparisonTableBase({
  firearms = [],
  highlightDifferences = true,
  showRecommendation = false,
  recommendation,
}: ComparisonTableProps) {
  // AI-visible state using useTamboComponentState
  const [selectedFirearmId, setSelectedFirearmId] = useTamboComponentState<string | null>(
    "selectedFirearmId",
    null,
    null
  );
  
  const [removedFirearmIds, setRemovedFirearmIds] = useTamboComponentState<string[]>(
    "removedFirearmIds",
    [],
    []
  );

  const [preferredSpec, setPreferredSpec] = useTamboComponentState<string | null>(
    "preferredSpec",
    null,
    null
  );

  // Guard: if firearms array is empty or insufficient
  if (!firearms || firearms.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 text-center">
        <p className="text-slate-400 text-sm">No firearms data available for comparison.</p>
      </div>
    );
  }

  // Filter out removed firearms (with fallback for undefined)
  const removedIds = removedFirearmIds ?? [];
  const visibleFirearms = firearms.filter(f => !removedIds.includes(f.id));

  // Function to check if values differ across firearms
  const valuesDiffer = (key: string): boolean => {
    const values = visibleFirearms.map((f) => f[key as keyof typeof f]);
    return new Set(values.filter(v => v !== undefined)).size > 1;
  };

  // Format value based on spec type
  const formatValue = (value: unknown, spec: typeof specRows[0]): string => {
    if (value === undefined || value === null) return "—";
    if (spec.format === "currency" && typeof value === "number") {
      return `${spec.prefix || ""}${value.toLocaleString()}`;
    }
    return `${spec.prefix || ""}${value}${spec.suffix || ""}`;
  };

  // Find best value for highlighting (lowest price, highest capacity, etc.)
  const getBestValue = (key: string): number | string | undefined => {
    const values = visibleFirearms.map((f) => f[key as keyof typeof f]).filter((v) => v !== undefined);
    if (key === "price") return Math.min(...values.map(Number));
    if (key === "capacity") return Math.max(...values.map(Number));
    return undefined;
  };

  // Handler for selecting a firearm for focus
  const handleSelectFirearm = (id: string) => {
    setSelectedFirearmId(selectedFirearmId === id ? null : id);
  };

  // Handler for removing a firearm from comparison
  const handleRemoveFirearm = (id: string) => {
    if (visibleFirearms.length > 2) {
      setRemovedFirearmIds([...removedIds, id]);
    }
  };

  // Handler for setting preferred spec
  const handleSetPreferredSpec = (spec: string) => {
    setPreferredSpec(preferredSpec === spec ? null : spec);
  };

  // Show message if no firearms or too few firearms remain
  if (visibleFirearms.length === 0) {
    return (
      <div className="w-full p-8 rounded-xl border border-slate-700 bg-slate-900 text-center">
        <p className="text-slate-400 text-lg mb-2">No firearms to compare</p>
        <p className="text-slate-500 text-sm">Add firearms to start comparing specifications</p>
      </div>
    );
  }

  if (visibleFirearms.length < 2) {
    return (
      <div className="w-full p-8 rounded-xl border border-slate-700 bg-slate-900 text-center">
        <p className="text-slate-400">Need at least 2 firearms to compare.</p>
        <button 
          onClick={() => setRemovedFirearmIds([])}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Reset Comparison
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
    >
      {/* Header row with firearm images/names */}
      <div className="grid border-b border-slate-700" style={{ gridTemplateColumns: `120px repeat(${visibleFirearms.length}, 1fr)` }}>
        <div className="bg-slate-800 p-4 flex items-center justify-center">
          <span className="text-slate-400 text-sm font-medium">Compare</span>
        </div>
        {visibleFirearms.map((firearm, idx) => (
          <motion.div
            key={firearm.id || `compare-${idx}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleSelectFirearm(firearm.id)}
            className={`bg-slate-800/50 p-4 text-center border-l border-slate-700 cursor-pointer transition-all relative ${
              selectedFirearmId === firearm.id ? 'ring-2 ring-orange-500 bg-slate-800' : 'hover:bg-slate-800'
            }`}
          >
            {/* Remove button */}
            {visibleFirearms.length > 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFirearm(firearm.id);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-700 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Remove from comparison"
              >
                ✕
              </button>
            )}
            {/* Image placeholder */}
            <div className="h-24 mb-3 flex items-center justify-center bg-slate-900/50 rounded-lg">
              {firearm.imageUrl ? (
                <img src={firearm.imageUrl} alt={firearm.name} className="h-full object-contain" />
              ) : (
                <span className="text-4xl opacity-30">🔫</span>
              )}
            </div>
            <p className="text-xs text-orange-400">{firearm.manufacturer}</p>
            <h4 className="text-white font-bold">{firearm.name}</h4>
            {selectedFirearmId === firearm.id && (
              <span className="mt-2 inline-block text-xs bg-orange-500 text-white px-2 py-0.5 rounded">Selected</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Spec rows */}
      {specRows.map((spec, rowIdx) => {
        const differs = highlightDifferences && valuesDiffer(spec.key);
        const bestValue = getBestValue(spec.key);
        const isPreferred = preferredSpec === spec.key;

        return (
          <motion.div
            key={spec.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + rowIdx * 0.05 }}
            className={`grid border-b border-slate-700/50 last:border-b-0 ${
              differs ? "bg-slate-800/30" : ""
            } ${isPreferred ? "ring-1 ring-orange-500/50" : ""}`}
            style={{ gridTemplateColumns: `120px repeat(${visibleFirearms.length}, 1fr)` }}
          >
            {/* Label cell */}
            <div 
              className="p-3 flex items-center gap-2 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => handleSetPreferredSpec(spec.key)}
              title="Click to mark as important specification"
            >
              <span className="text-slate-500">{spec.icon}</span>
              <span className={`text-sm ${isPreferred ? 'text-orange-400 font-medium' : 'text-slate-400'}`}>
                {spec.label}
                {isPreferred && <span className="ml-1">★</span>}
              </span>
            </div>

            {/* Value cells */}
            {visibleFirearms.map((firearm, fIdx) => {
              const value = firearm[spec.key as keyof typeof firearm];
              const isBest = bestValue !== undefined && value === bestValue;
              const isSelectedColumn = selectedFirearmId === firearm.id;

              return (
                <div
                  key={`${firearm.id || `f-${fIdx}`}-${spec.key}`}
                  className={`p-3 text-center border-l border-slate-700/50 transition-colors ${
                    isBest && highlightDifferences ? "bg-green-500/10" : ""
                  } ${isSelectedColumn ? "bg-orange-500/5" : ""}`}
                >
                  <span
                    className={`font-medium ${
                      isBest && highlightDifferences
                        ? "text-green-400"
                        : differs
                        ? "text-orange-300"
                        : "text-white"
                    }`}
                  >
                    {formatValue(value, spec)}
                  </span>
                  {isBest && highlightDifferences && (
                    <span className="ml-1 text-xs text-green-500">★</span>
                  )}
                </div>
              );
            })}
          </motion.div>
        );
      })}

      {/* AI Recommendation */}
      {showRecommendation && recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gradient-to-r from-orange-500/10 to-transparent border-t border-orange-500/30"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">🤖</span>
            <div>
              <p className="text-xs text-orange-400 uppercase tracking-wider mb-1">AI Recommendation</p>
              <p className="text-slate-300 text-sm">{recommendation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Wrap with withInteractable for Tambo AI integration
// This allows the AI to observe user interactions with the comparison table
export const ComparisonTable = withInteractable(ComparisonTableBase, {
  componentName: "ComparisonTable",
  description: "Side-by-side comparison table for 2-4 firearms. Users can select a firearm for focus, remove firearms from comparison, and mark specifications as important. The AI can observe which firearms are being compared and user preferences.",
  propsSchema: comparisonTablePropsSchema,
  stateSchema: comparisonTableStateSchema,
});

export default ComparisonTable;
