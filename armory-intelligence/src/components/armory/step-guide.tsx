/**
 * @file step-guide.tsx
 * @description Step-by-step guide component for maintenance procedures and instructions
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const stepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  tips: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  duration: z.string().optional(),
});

export const stepGuideSchema = z.object({
  title: z.string().describe("Guide title"),
  description: z.string().describe("Brief description of the procedure"),
  category: z.enum(["cleaning", "maintenance", "assembly", "disassembly", "safety", "storage"]).describe("Guide category"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level"),
  totalDuration: z.string().optional().describe("Estimated total time"),
  toolsRequired: z.array(z.string()).optional().describe("List of required tools"),
  steps: z.array(stepSchema).describe("Array of steps"),
  safetyNotice: z.string().optional().describe("Safety notice shown at top"),
});

export type StepGuideProps = z.infer<typeof stepGuideSchema>;
type Step = z.infer<typeof stepSchema>;

function DifficultyBadge({ difficulty }: { difficulty: "beginner" | "intermediate" | "advanced" }) {
  const config = {
    beginner: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Beginner" },
    intermediate: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Intermediate" },
    advanced: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Advanced" },
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${config[difficulty].color}`}>
      {config[difficulty].label}
    </span>
  );
}

function StepCard({ step, stepNumber, isActive, isCompleted, onClick }: {
  step: Step;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`cursor-pointer border rounded-lg transition-all ${
        isActive
          ? "bg-slate-800 border-orange-500/50 shadow-lg shadow-orange-500/10"
          : isCompleted
          ? "bg-slate-800/50 border-green-500/30"
          : "bg-slate-900 border-slate-700 hover:border-slate-600"
      }`}
    >
      {/* Step Header */}
      <div className="p-4 flex items-start gap-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? "bg-green-500 text-white"
              : isActive
              ? "bg-orange-500 text-white"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          {isCompleted ? "✓" : stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${isActive ? "text-white" : "text-slate-300"}`}>
            {step.title}
          </h4>
          {step.duration && (
            <p className="text-xs text-slate-500 mt-1">⏱️ {step.duration}</p>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Tools Required */}
              {step.tools && step.tools.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tools Needed</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tools.map((tool, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {step.tips && step.tips.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs text-blue-400 font-medium mb-2">💡 Tips</p>
                  <ul className="space-y-1">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-blue-300">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {step.warnings && step.warnings.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-medium mb-2">⚠️ Warnings</p>
                  <ul className="space-y-1">
                    {step.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-red-300">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function StepGuide({
  title,
  description,
  category,
  difficulty,
  totalDuration,
  toolsRequired = [],
  steps,
  safetyNotice,
}: StepGuideProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const handleMarkComplete = () => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const progress = (completedSteps.size / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 border-b border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded capitalize">
                {category}
              </span>
              <DifficultyBadge difficulty={difficulty} />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-slate-400 text-sm mt-1">{description}</p>
          </div>
          {totalDuration && (
            <div className="text-right">
              <p className="text-xs text-slate-500">Est. Time</p>
              <p className="text-sm font-medium text-slate-300">⏱️ {totalDuration}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{completedSteps.size} / {steps.length} steps</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Tools Required */}
        {toolsRequired.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tools Required</p>
            <div className="flex flex-wrap gap-2">
              {toolsRequired.map((tool, i) => (
                <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                  🔧 {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice */}
      {safetyNotice && (
        <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">
            <strong>⚠️ Safety First:</strong> {safetyNotice}
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="p-6 space-y-3">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            stepNumber={index + 1}
            isActive={activeStep === index}
            isCompleted={completedSteps.has(index)}
            onClick={() => handleStepClick(index)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={activeStep === 0}
          className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleMarkComplete}
          className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition-colors"
        >
          {completedSteps.has(activeStep) ? "Completed ✓" : "Mark Complete"}
        </button>
        <button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}

export default StepGuide;
