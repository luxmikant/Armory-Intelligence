/**
 * @file interactive-checklist.tsx
 * @description Tambo Interactable component for interactive safety/maintenance checklists
 * 
 * This component renders an interactive checklist that users can check off,
 * perfect for safety protocols, cleaning procedures, and storage checklists.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for AI-visible state
 * - AI can observe which items users have checked and their progress
 */

"use client";

import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";

// Checklist item schema
// Using .catch() instead of .default() to handle null values from streaming
const checklistItemSchema = z.object({
  id: z.string().catch("").describe("Unique item identifier"),
  text: z.string().catch("").describe("The checklist item text"),
  priority: z.enum(["critical", "high", "medium", "low"]).nullish().describe("Priority level"),
  note: z.string().nullish().describe("Additional note or tip"),
});

// Schema for Tambo AI component registration (props)
// Using .catch() instead of .default() to handle null values from streaming
export const interactiveChecklistPropsSchema = z.object({
  title: z.string().catch("Checklist").describe("Title of the checklist"),
  description: z.string().nullish().describe("Description or context"),
  category: z.enum(["safety", "storage", "cleaning", "transport", "range", "purchase"]).catch("safety").describe("Checklist category"),
  items: z.array(checklistItemSchema).catch([]).describe("Array of checklist items"),
  allowSkip: z.boolean().catch(false).describe("Whether items can be skipped"),
  showProgress: z.boolean().catch(true).describe("Whether to show progress bar"),
});

// State schema for interactable tracking
// Using .catch() instead of .default() to handle null values from streaming
export const interactiveChecklistStateSchema = z.object({
  checkedItemIds: z.array(z.string()).catch([]).describe("IDs of items that have been checked off"),
  expandedItemId: z.string().nullable().catch(null).describe("ID of the item currently expanded to show its note"),
  completedAt: z.string().nullable().catch(null).describe("ISO timestamp when checklist was fully completed"),
});

// Keep alias for backward compatibility
export const interactiveChecklistSchema = interactiveChecklistPropsSchema;

export type InteractiveChecklistProps = z.infer<typeof interactiveChecklistPropsSchema>;

// Category icons and colors
const categoryConfig = {
  safety: { icon: "🛡️", color: "text-red-400", bgColor: "bg-red-500/10" },
  storage: { icon: "🔐", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  cleaning: { icon: "🧹", color: "text-green-400", bgColor: "bg-green-500/10" },
  transport: { icon: "🚗", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  range: { icon: "🎯", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  purchase: { icon: "🛒", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
};

// Priority indicators
const priorityConfig = {
  critical: { color: "bg-red-500", label: "Critical" },
  high: { color: "bg-orange-500", label: "High" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  low: { color: "bg-slate-500", label: "Low" },
};

function InteractiveChecklistBase({
  title,
  description,
  category,
  items,
  allowSkip = false,
  showProgress = true,
}: InteractiveChecklistProps) {
  // Tambo AI-visible state - allows AI to observe user progress
  const [checkedItemIds, setCheckedItemIds] = useTamboComponentState<string[]>(
    "checkedItemIds",
    [],
    []
  );
  
  const [expandedItemId, setExpandedItemId] = useTamboComponentState<string | null>(
    "expandedItemId",
    null,
    null
  );

  const [completedAt, setCompletedAt] = useTamboComponentState<string | null>(
    "completedAt",
    null,
    null
  );

  // Safe access with fallback
  const checkedIds = checkedItemIds ?? [];
  const checkedItems = new Set(checkedIds);
  
  const config = categoryConfig[category] ?? categoryConfig.safety;
  const safeItems = items ?? [];
  const progress = safeItems.length > 0 ? (checkedItems.size / safeItems.length) * 100 : 0;
  const isComplete = safeItems.length > 0 && checkedItems.size === safeItems.length;

  const toggleItem = (id: string) => {
    const newCheckedIds = checkedIds.includes(id)
      ? checkedIds.filter(i => i !== id)
      : [...checkedIds, id];
    
    setCheckedItemIds(newCheckedIds);
    
    // Track completion time for AI visibility
    if (newCheckedIds.length === safeItems.length && !completedAt) {
      setCompletedAt(new Date().toISOString());
    } else if (newCheckedIds.length < safeItems.length && completedAt) {
      setCompletedAt(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className={`p-4 ${config.bgColor} border-b border-slate-700`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {description && (
              <p className="text-sm text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
          <span className={`text-xs uppercase tracking-wider ${config.color} px-2 py-1 rounded-full border border-current/30`}>
            {category}
          </span>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{checkedItems.size} of {safeItems.length} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${isComplete ? "bg-green-500" : "bg-orange-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Checklist items */}
      <div className="p-2">
        <AnimatePresence>
          {safeItems.map((item, idx) => {
            const isChecked = checkedItems.has(item.id);
            const isExpanded = expandedItemId === item.id;
            const priority = item.priority ? priorityConfig[item.priority] : null;

            return (
              <motion.div
                key={item.id || `checklist-item-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`mb-1 rounded-lg transition-colors ${
                  isChecked ? "bg-green-500/10" : "bg-slate-800/50 hover:bg-slate-800"
                }`}
              >
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  {/* Checkbox */}
                  <motion.div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isChecked
                        ? "bg-green-500 border-green-500"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isChecked && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {priority && (
                        <span className={`w-2 h-2 rounded-full ${priority.color}`} title={priority.label} />
                      )}
                      <p className={`text-sm ${isChecked ? "text-slate-500 line-through" : "text-white"}`}>
                        {item.text}
                      </p>
                    </div>

                    {/* Expandable note */}
                    {item.note && (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-slate-400 mt-2 pl-4 border-l-2 border-slate-600"
                          >
                            💡 {item.note}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Expand button for notes */}
                  {item.note && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedItemId(isExpanded ? null : item.id);
                      }}
                      className="text-slate-500 hover:text-slate-300 text-xs"
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-green-500/20 border-t border-green-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-green-400 font-bold">Checklist Complete!</p>
                <p className="text-sm text-green-300/70">All items have been verified.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Wrap with withInteractable for Tambo AI integration
// This allows the AI to observe which items users have checked and their progress
export const InteractiveChecklist = withInteractable(InteractiveChecklistBase, {
  componentName: "InteractiveChecklist",
  description: "Interactive checklist for safety, storage, cleaning, transport, range, and purchase protocols. Users can check items off and AI can observe their progress through the list.",
  propsSchema: interactiveChecklistPropsSchema,
  stateSchema: interactiveChecklistStateSchema,
});

export default InteractiveChecklist;
