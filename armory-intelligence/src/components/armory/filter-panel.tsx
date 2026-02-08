/**
 * @file filter-panel.tsx
 * @description Tambo Interactable dynamic filter panel for firearms catalog
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for AI-visible state
 * - AI can observe user filter preferences (types, calibers, price, sort)
 */

"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";

type FilterState = {
  types: string[];
  calibers: string[];
  priceRange: { min: number; max: number };
  sortBy: string;
};

// Zod schema for filter panel props (for Tambo registration)
export const filterPanelPropsSchema = z.object({
  onApplyFilters: z.any().optional().describe("Callback when filters are applied"),
  onClearFilters: z.any().optional().describe("Callback when filters are cleared"),
  availableTypes: z.array(z.string()).optional().describe("Available firearm types to filter by (e.g., Handgun, Rifle, Shotgun)"),
  availableCalibers: z.array(z.string()).optional().describe("Available calibers to filter by (e.g., 9mm, .45 ACP, .223)"),
  priceRange: z.object({ min: z.number(), max: z.number() }).optional().describe("Min and max price range for filtering"),
  isOpen: z.boolean().optional().describe("Whether the filter panel starts expanded"),
});

// State schema for interactable tracking
export const filterPanelStateSchema = z.object({
  selectedTypes: z.array(z.string()).default([]).describe("Firearm types user has selected (e.g., Handgun, Rifle)"),
  selectedCalibers: z.array(z.string()).default([]).describe("Calibers user has selected (e.g., 9mm, .45 ACP)"),
  priceMin: z.number().default(0).describe("Minimum price the user is looking for"),
  priceMax: z.number().default(5000).describe("Maximum price the user is willing to pay"),
  sortBy: z.string().default("relevance").describe("How user wants results sorted (relevance, price-low, price-high, name, newest, popularity)"),
  isExpanded: z.boolean().default(false).describe("Whether the filter panel is currently open"),
});

// Keep alias for backward compatibility
export const filterPanelSchema = filterPanelPropsSchema;

export type FilterPanelProps = {
  onApplyFilters?: (filters: FilterState) => void;
  onClearFilters?: () => void;
  availableTypes?: string[];
  availableCalibers?: string[];
  priceRange?: { min: number; max: number };
  isOpen?: boolean;
};

function FilterPanelBase({
  onApplyFilters = () => {},
  onClearFilters = () => {},
  availableTypes = ["Handgun", "Rifle", "Shotgun", "Revolver"],
  availableCalibers = ["9mm", "45 ACP", ".223", "12 GA", ".308"],
  priceRange = { min: 0, max: 5000 },
  isOpen = false,
}: FilterPanelProps) {
  // AI-visible state using useTamboComponentState
  const [selectedTypes, setSelectedTypes] = useTamboComponentState<string[]>(
    "selectedTypes",
    [],
    []
  );
  const [selectedCalibers, setSelectedCalibers] = useTamboComponentState<string[]>(
    "selectedCalibers",
    [],
    []
  );
  const [priceMin, setPriceMin] = useTamboComponentState<number>(
    "priceMin",
    priceRange.min,
    priceRange.min
  );
  const [priceMax, setPriceMax] = useTamboComponentState<number>(
    "priceMax",
    priceRange.max,
    priceRange.max
  );
  const [sortBy, setSortBy] = useTamboComponentState<string>(
    "sortBy",
    "relevance",
    "relevance"
  );
  const [isExpanded, setIsExpanded] = useTamboComponentState<boolean>(
    "isExpanded",
    isOpen,
    isOpen
  );

  // Safe access with fallbacks for type safety
  const types = selectedTypes ?? [];
  const calibers = selectedCalibers ?? [];

  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes(
      types.includes(type) ? types.filter((t: string) => t !== type) : [...types, type]
    );
  }, [types, setSelectedTypes]);

  const handleCaliberToggle = useCallback((caliber: string) => {
    setSelectedCalibers(
      calibers.includes(caliber)
        ? calibers.filter((c: string) => c !== caliber)
        : [...calibers, caliber]
    );
  }, [calibers, setSelectedCalibers]);

  const handleApply = useCallback(() => {
    if (typeof onApplyFilters === "function") {
      onApplyFilters({
        types,
        calibers,
        priceRange: { min: priceMin ?? priceRange.min, max: priceMax ?? priceRange.max },
        sortBy: sortBy ?? "relevance",
      });
    }
  }, [types, calibers, priceMin, priceMax, sortBy, onApplyFilters, priceRange]);

  const handleClear = useCallback(() => {
    setSelectedTypes([]);
    setSelectedCalibers([]);
    setPriceMin(priceRange.min);
    setPriceMax(priceRange.max);
    setSortBy("relevance");
    if (typeof onClearFilters === "function") {
      onClearFilters();
    }
  }, [priceRange.min, priceRange.max, onClearFilters, setSelectedTypes, setSelectedCalibers, setPriceMin, setPriceMax, setSortBy]);

  const activeFiltersCount = types.length + calibers.length;

  return (
    <motion.div
      className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white">Filters</span>
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full"
            >
              {activeFiltersCount} active
            </motion.span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-slate-400"
        >
          ▼
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6 border-t border-slate-800">
              {/* Firearm Type Filter */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Firearm Type
                </h3>
                <div className="space-y-2">
                  {availableTypes?.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={types.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 accent-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Caliber Filter */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Caliber
                </h3>
                <div className="space-y-2">
                  {availableCalibers?.map((caliber) => (
                    <label
                      key={caliber}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={calibers.includes(caliber)}
                        onChange={() => handleCaliberToggle(caliber)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 accent-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {caliber}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">
                      Minimum: ${priceMin}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">
                      Maximum: ${priceMax}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm hover:border-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors"
                >
                  Apply Filters
                </motion.button>
                {activeFiltersCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded transition-colors"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Wrap with withInteractable for Tambo AI integration
// This allows the AI to observe user filter preferences
export const FilterPanel = withInteractable(FilterPanelBase, {
  componentName: "FilterPanel",
  description: "Dynamic filter panel for firearms catalog. Users can filter by type, caliber, price range, and sort order. The AI can observe which filters are active to understand user preferences.",
  propsSchema: filterPanelPropsSchema,
  stateSchema: filterPanelStateSchema,
});

export default FilterPanel;
