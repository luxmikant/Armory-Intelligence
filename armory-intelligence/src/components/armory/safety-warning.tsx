/**
 * @file safety-warning.tsx
 * @description Tambo component for displaying safety warnings and alerts
 * 
 * This component renders prominent safety warnings with different severity levels,
 * used throughout the application to emphasize critical safety information.
 */

"use client";

import { z } from "zod";
import { motion } from "framer-motion";

// Schema for Tambo AI component registration
export const safetyWarningSchema = z.object({
  level: z.enum(["critical", "warning", "caution", "info"]).describe("Severity level of the warning"),
  title: z.string().describe("Short title for the warning"),
  message: z.string().describe("Detailed warning message"),
  actions: z.array(z.string()).optional().describe("Recommended actions to take"),
  dismissible: z.boolean().optional().default(false).describe("Whether the warning can be dismissed"),
});

export type SafetyWarningProps = z.infer<typeof safetyWarningSchema>;

// Level configurations
const levelConfig = {
  critical: {
    icon: "⚠️",
    bgColor: "bg-red-900/30",
    borderColor: "border-red-500",
    textColor: "text-red-400",
    titleColor: "text-red-300",
    accentColor: "bg-red-500",
  },
  warning: {
    icon: "⚡",
    bgColor: "bg-amber-900/30",
    borderColor: "border-amber-500",
    textColor: "text-amber-400",
    titleColor: "text-amber-300",
    accentColor: "bg-amber-500",
  },
  caution: {
    icon: "📋",
    bgColor: "bg-yellow-900/30",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-400",
    titleColor: "text-yellow-300",
    accentColor: "bg-yellow-500",
  },
  info: {
    icon: "ℹ️",
    bgColor: "bg-blue-900/30",
    borderColor: "border-blue-500",
    textColor: "text-blue-400",
    titleColor: "text-blue-300",
    accentColor: "bg-blue-500",
  },
};

export function SafetyWarning({
  level = "info", // Default to info if not provided
  title,
  message,
  actions,
  dismissible = false,
}: SafetyWarningProps) {
  // Validate level exists in config, fallback to info
  const validLevel = level in levelConfig ? level : "info";
  const config = levelConfig[validLevel];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full max-w-lg rounded-xl border-l-4 ${config.borderColor} ${config.bgColor} overflow-hidden`}
    >
      {/* Animated accent bar for critical warnings */}
      {level === "critical" && (
        <motion.div
          className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{config.icon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-lg ${config.titleColor} uppercase tracking-wide`}>
                {title}
              </h4>
              {dismissible && (
                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                  ✕
                </button>
              )}
            </div>
            <p className={`mt-2 ${config.textColor}`}>{message}</p>
          </div>
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="mt-4 ml-9">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Recommended Actions:
            </p>
            <ul className="space-y-1">
              {actions.map((action, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center gap-2 ${config.textColor}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span className="text-sm">{action}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Level indicator */}
        <div className="mt-4 ml-9 flex items-center gap-2">
          <span className={`text-xs uppercase tracking-wider ${config.textColor} opacity-60`}>
            {level} alert
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SafetyWarning;
