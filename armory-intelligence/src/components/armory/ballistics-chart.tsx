/**
 * @file ballistics-chart.tsx
 * @description Tambo Interactable component for ballistics trajectory visualization
 * 
 * This component renders interactive trajectory charts showing bullet drop,
 * velocity, and energy at various distances.
 * 
 * TAMBO INTEGRATION:
 * - Wrapped with withInteractable for AI interaction awareness
 * - Uses useTamboComponentState for AI-visible state
 * - AI can observe which distance the user is focusing on
 */

"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

// Trajectory data point schema
// Using .catch() instead of .default() to handle null values from streaming
const trajectoryPointSchema = z.object({
  distance: z.number().catch(0).describe("Distance in yards"),
  drop: z.number().catch(0).describe("Bullet drop in inches"),
  velocity: z.number().catch(0).describe("Velocity in fps"),
  energy: z.number().catch(0).describe("Energy in ft-lbs"),
  windDrift: z.number().nullish().describe("Wind drift in inches"),
});

// Schema for Tambo AI component registration (props)
// Using .catch() instead of .default() to handle null values from streaming
export const ballisticsChartPropsSchema = z.object({
  caliber: z.string().catch("9mm").describe("Caliber being displayed (e.g., '.308 Winchester')"),
  bulletWeight: z.number().catch(115).describe("Bullet weight in grains"),
  muzzleVelocity: z.number().catch(1200).describe("Muzzle velocity in fps"),
  trajectoryData: z.array(trajectoryPointSchema).catch([]).describe("Array of trajectory data points"),
  zeroDistance: z.number().catch(100).describe("Zero distance in yards"),
  showVelocity: z.boolean().catch(true).describe("Show velocity line"),
  showEnergy: z.boolean().catch(true).describe("Show energy line"),
  comparisonData: z.object({
    caliber: z.string(),
    trajectoryData: z.array(trajectoryPointSchema),
  }).nullish().describe("Optional comparison caliber data"),
});

// State schema for interactable tracking
// Using .catch() instead of .default() to handle null values from streaming
export const ballisticsChartStateSchema = z.object({
  selectedDistance: z.number().nullable().catch(null).describe("The distance in yards the user is currently examining"),
  focusedMetric: z.enum(["drop", "velocity", "energy", "windDrift"]).nullable().catch(null).describe("Which metric the user is most interested in"),
  isTableExpanded: z.boolean().catch(false).describe("Whether the data table is expanded for detailed viewing"),
});

// Keep alias for backward compatibility
export const ballisticsChartSchema = ballisticsChartPropsSchema;

export type BallisticsChartProps = z.infer<typeof ballisticsChartPropsSchema>;

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
      <p className="text-orange-400 font-bold mb-2">{label} yards</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(1)}
          {entry.name === "Drop" || entry.name === "Wind Drift" ? " in" : ""}
          {entry.name === "Velocity" ? " fps" : ""}
          {entry.name === "Energy" ? " ft-lbs" : ""}
        </p>
      ))}
    </div>
  );
};

function BallisticsChartBase({
  caliber,
  bulletWeight,
  muzzleVelocity,
  trajectoryData,
  zeroDistance = 100,
  showVelocity = true,
  showEnergy = true,
  comparisonData,
}: BallisticsChartProps) {
  // AI-visible state using useTamboComponentState
  const [selectedDistance, setSelectedDistance] = useTamboComponentState<number | null>(
    "selectedDistance",
    null,
    null
  );
  
  const [focusedMetric, setFocusedMetric] = useTamboComponentState<"drop" | "velocity" | "energy" | "windDrift" | null>(
    "focusedMetric",
    null,
    null
  );

  const [isTableExpanded, setIsTableExpanded] = useTamboComponentState<boolean>(
    "isTableExpanded",
    false,
    false
  );

  // Calculate key stats (guard against empty/undefined arrays during streaming)
  const safeTrajectoryData = trajectoryData ?? [];
  const maxDistance = safeTrajectoryData.length > 0 ? Math.max(...safeTrajectoryData.map((d) => d.distance)) : 0;
  const maxDrop = safeTrajectoryData.length > 0 ? Math.max(...safeTrajectoryData.map((d) => Math.abs(d.drop))) : 0;
  const finalVelocity = safeTrajectoryData[safeTrajectoryData.length - 1]?.velocity ?? 0;
  const finalEnergy = safeTrajectoryData[safeTrajectoryData.length - 1]?.energy ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📊</span>
              {caliber} Ballistics
            </h3>
            <p className="text-sm text-slate-400">
              {bulletWeight}gr • {muzzleVelocity} fps MV • {zeroDistance}yd zero
            </p>
          </div>
          {comparisonData && (
            <div className="text-xs text-slate-400">
              vs {comparisonData.caliber}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-px bg-slate-700">
        <StatBox label="Max Range" value={`${maxDistance} yds`} icon="↔" />
        <StatBox label="Max Drop" value={`${maxDrop.toFixed(1)}"`} icon="↓" />
        <StatBox label="Final Velocity" value={`${finalVelocity} fps`} icon="⚡" />
        <StatBox label="Final Energy" value={`${finalEnergy} ft-lbs`} icon="💥" />
      </div>

      {/* Trajectory Chart */}
      <div className="p-4">
        <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-3">Bullet Drop</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={safeTrajectoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="distance"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{ value: "Distance (yards)", position: "bottom", fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{ value: "Drop (inches)", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Zero line */}
              <Line
                type="monotone"
                dataKey={() => 0}
                stroke="#475569"
                strokeDasharray="5 5"
                dot={false}
                name="Zero"
              />
              
              {/* Main trajectory */}
              <Area
                type="monotone"
                dataKey="drop"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Drop"
                dot={{ fill: "#f97316", strokeWidth: 0, r: 3 }}
              />

              {/* Comparison trajectory */}
              {comparisonData && (
                <Line
                  type="monotone"
                  data={comparisonData.trajectoryData}
                  dataKey="drop"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name={comparisonData.caliber}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Velocity/Energy Chart */}
      {(showVelocity || showEnergy) && (
        <div className="p-4 border-t border-slate-700">
          <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-3">
            {showVelocity && showEnergy ? "Velocity & Energy" : showVelocity ? "Velocity" : "Energy"}
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safeTrajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="distance"
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                {showEnergy && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {showVelocity && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="velocity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Velocity"
                  />
                )}
                
                {showEnergy && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="energy"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    name="Energy"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="p-4 border-t border-slate-700">
        <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-3">Trajectory Table</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-3 py-2 text-left text-slate-400 font-medium">Distance</th>
                <th className="px-3 py-2 text-right text-slate-400 font-medium">Drop</th>
                <th className="px-3 py-2 text-right text-slate-400 font-medium">Velocity</th>
                <th className="px-3 py-2 text-right text-slate-400 font-medium">Energy</th>
                {safeTrajectoryData[0]?.windDrift !== undefined && (
                  <th className="px-3 py-2 text-right text-slate-400 font-medium">Wind</th>
                )}
              </tr>
            </thead>
            <tbody>
              {safeTrajectoryData.filter((_, i) => i % 2 === 0 || i === safeTrajectoryData.length - 1).map((point, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-700/50 hover:bg-slate-800/50"
                >
                  <td className="px-3 py-2 text-white">{point.distance} yds</td>
                  <td className="px-3 py-2 text-right text-orange-400">{point.drop.toFixed(1)}"</td>
                  <td className="px-3 py-2 text-right text-blue-400">{point.velocity} fps</td>
                  <td className="px-3 py-2 text-right text-green-400">{point.energy} ft-lbs</td>
                  {point.windDrift != null && (
                    <td className="px-3 py-2 text-right text-purple-400">{point.windDrift.toFixed(1)}"</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// Helper stat box component
function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-slate-800 p-3 text-center">
      <span className="text-slate-500 text-xs block">{icon}</span>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-slate-500 text-xs">{label}</p>
    </div>
  );
}

// Wrap with withInteractable for Tambo AI integration
// This allows the AI to observe which distances and metrics users are examining
export const BallisticsChart = withInteractable(BallisticsChartBase, {
  componentName: "BallisticsChart",
  description: "Interactive ballistics trajectory chart showing bullet drop, velocity, and energy at various distances. Users can examine specific distances and metrics. The AI can observe which data points interest the user.",
  propsSchema: ballisticsChartPropsSchema,
  stateSchema: ballisticsChartStateSchema,
});

export default BallisticsChart;
