"use client";

/**
 * @file maintenance/page.tsx
 * @description Firearm maintenance guides with step-by-step instructions
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { StepGuide } from "@/components/armory/step-guide";
import { SafetyWarning } from "@/components/armory/safety-warning";
import { EmbeddedChat } from "@/components/tambo/embedded-chat";
import { PageContextHelper } from "@/components/tambo/page-context-helper";
import { PageHeader } from "@/components/armory/page-header";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { ClientOnly } from "@/components/client-only";
import { 
  Wrench, 
  Brush,
  Droplets,
  Eye,
  Shield,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

const maintenanceGuides = [
  {
    id: "basic-cleaning",
    title: "Basic Cleaning Guide",
    description: "Essential steps for routine firearm cleaning after range use",
    duration: "30-45 minutes",
    difficulty: "Beginner",
    icon: Brush,
    color: "from-green-500 to-green-600",
    steps: [
      {
        id: 1,
        title: "Safety Check",
        description: "Remove magazine and verify the chamber is completely empty. Visually and physically inspect to ensure no ammunition is present.",
        warning: "ALWAYS verify the firearm is unloaded before any cleaning",
        tips: ["Point in a safe direction", "Remove all ammunition from the cleaning area", "Double-check the chamber"],
      },
      {
        id: 2,
        title: "Disassemble the Firearm",
        description: "Follow your manufacturer's instructions to field strip the firearm. Most semi-automatic pistols require removing the slide, barrel, and recoil spring.",
        tips: ["Work on a clean, padded surface", "Keep small parts organized", "Take photos if needed for reassembly reference"],
      },
      {
        id: 3,
        title: "Clean the Barrel",
        description: "Attach a bore brush to your cleaning rod and apply solvent. Run it through the barrel several times from chamber to muzzle.",
        tips: ["Always clean from chamber to muzzle when possible", "Use bronze brushes for lead, nylon for plated bullets", "Let solvent sit for 5-10 minutes for heavy fouling"],
      },
      {
        id: 4,
        title: "Patch the Barrel",
        description: "Run solvent-soaked patches through the barrel until they come out clean. Follow with dry patches to remove excess solvent.",
        tips: ["Use properly-sized patches", "One pass per patch", "Continue until patches are clean"],
      },
      {
        id: 5,
        title: "Clean the Slide and Frame",
        description: "Use a brush and solvent to clean the slide rails, breech face, and frame rails. Pay attention to the firing pin channel and extractor.",
        tips: ["Use nylon brush for frame", "Q-tips work great for tight spots", "Clean the feed ramp thoroughly"],
      },
      {
        id: 6,
        title: "Clean and Inspect the Barrel",
        description: "Wipe down the outside of the barrel. Inspect the barrel for wear, pitting, or damage. Check the chamber and feed ramp.",
        tips: ["Look for unusual wear patterns", "Check crown for damage", "Inspect locking lugs"],
      },
      {
        id: 7,
        title: "Lubricate Moving Parts",
        description: "Apply a thin layer of gun oil to the slide rails, barrel hood, barrel locking surfaces, and any other friction points.",
        warning: "Less is more - excess oil attracts dirt and can cause malfunctions",
        tips: ["Use manufacturer-recommended lubricant", "Avoid getting oil in the firing pin channel", "Wipe off excess"],
      },
      {
        id: 8,
        title: "Reassemble and Function Check",
        description: "Reassemble the firearm following manufacturer instructions. Perform a function check to ensure everything operates correctly.",
        tips: ["Ensure slide locks back on empty magazine", "Check trigger reset", "Verify all safeties function properly"],
      },
    ],
  },
  {
    id: "deep-cleaning",
    title: "Deep Cleaning Guide",
    description: "Thorough cleaning for neglected firearms or after extended use",
    duration: "1-2 hours",
    difficulty: "Intermediate",
    icon: Droplets,
    color: "from-blue-500 to-blue-600",
    steps: [
      {
        id: 1,
        title: "Safety and Preparation",
        description: "Clear the firearm completely. Set up a well-ventilated workspace with cleaning mat, solvent, brushes, picks, and all necessary tools.",
        warning: "Strong solvents require good ventilation - work in a well-aired space",
        tips: ["Use nitrile gloves for solvent protection", "Lay out all tools before starting", "Have plenty of rags ready"],
      },
      {
        id: 2,
        title: "Complete Disassembly",
        description: "Perform a complete detail strip, removing all pins, springs, and small parts. Refer to manufacturer documentation or armorer's manual.",
        warning: "Only perform full disassembly if you're comfortable and have proper training",
        tips: ["Work in a parts tray", "Photograph each step", "Keep springs contained - they fly!"],
      },
      {
        id: 3,
        title: "Soak Metal Parts",
        description: "Place metal parts in a parts tray with solvent. Let soak for 15-30 minutes to loosen carbon and debris.",
        tips: ["Don't soak polymer parts", "Use ultrasonic cleaner if available", "Replace solvent if heavily contaminated"],
      },
      {
        id: 4,
        title: "Scrub All Parts",
        description: "Using brushes and picks, thoroughly clean each part. Pay special attention to the firing pin, extractor, and all springs.",
        tips: ["Use brass picks for stubborn deposits", "Clean inside the magazine well", "Inspect each part as you clean"],
      },
      {
        id: 5,
        title: "Clean the Bore Thoroughly",
        description: "Use a bore guide and make multiple passes with brush and solvent. Use a jag and patch combo for final cleaning.",
        tips: ["Consider using a bore snake for initial cleanup", "Copper solvent for jacket fouling", "Bore light inspection"],
      },
      {
        id: 6,
        title: "Dry All Parts",
        description: "Use compressed air and clean patches to completely dry all parts. Ensure no solvent remains in the firing pin channel.",
        tips: ["Pay attention to hidden cavities", "Let parts air dry completely", "Inspect for any remaining debris"],
      },
      {
        id: 7,
        title: "Inspect for Wear",
        description: "Carefully inspect all parts for wear, cracks, or damage. Check springs for proper tension and condition.",
        warning: "Replace any worn or damaged parts before reassembly",
        tips: ["Check recoil spring length", "Inspect firing pin tip", "Look for frame cracks"],
      },
      {
        id: 8,
        title: "Lubricate and Reassemble",
        description: "Apply appropriate lubricant to all friction points and reassemble the firearm. Follow manufacturer specifications for lubrication points.",
        tips: ["Grease for high-friction areas", "Light oil for general lubrication", "Function test thoroughly"],
      },
    ],
  },
  {
    id: "inspection",
    title: "Safety Inspection Guide",
    description: "Pre-use inspection to ensure safe operation",
    duration: "10-15 minutes",
    difficulty: "Beginner",
    icon: Eye,
    color: "from-amber-500 to-amber-600",
    steps: [
      {
        id: 1,
        title: "Visual Exterior Inspection",
        description: "Examine the exterior of the firearm for damage, rust, or debris. Check grips/stocks for cracks or looseness.",
        tips: ["Look for rust or pitting", "Check for dents or bulges", "Ensure sights are secure"],
      },
      {
        id: 2,
        title: "Clear and Verify Unloaded",
        description: "Remove magazine, lock slide back, visually and physically verify chamber is empty.",
        warning: "Never skip this step - treat every firearm as if it's loaded",
        tips: ["Visual check", "Physical check with finger", "Check magazine well"],
      },
      {
        id: 3,
        title: "Check Bore Condition",
        description: "Look through the barrel to check for obstructions, excessive fouling, or damage.",
        warning: "NEVER look down a loaded barrel - always verify unloaded first",
        tips: ["Use a bore light", "Check for obstructions", "Look for rust or pitting"],
      },
      {
        id: 4,
        title: "Test Safety Mechanisms",
        description: "Verify all safety mechanisms engage and disengage properly. Test magazine release and slide lock.",
        tips: ["Engage and disengage safety multiple times", "Check grip safety if equipped", "Verify magazine drops free"],
      },
      {
        id: 5,
        title: "Function Check",
        description: "With an empty firearm, check trigger pull, reset, and overall action. Verify slide/action operates smoothly.",
        tips: ["Trigger should have consistent pull", "Listen for trigger reset", "Action should be smooth"],
      },
      {
        id: 6,
        title: "Ammunition Inspection",
        description: "Inspect ammunition for damage, corrosion, or defects. Check for proper caliber match.",
        warning: "Never use damaged, corroded, or improperly stored ammunition",
        tips: ["Check case for cracks", "Verify bullet is seated properly", "Match caliber to firearm"],
      },
    ],
  },
];

export default function MaintenancePage() {
  const [selectedGuide, setSelectedGuide] = useState(maintenanceGuides[0]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      if (stepId < selectedGuide.steps.length) {
        setCurrentStep(stepId + 1);
      }
    }
  };

  const handleGuideChange = (guide: typeof maintenanceGuides[0]) => {
    setSelectedGuide(guide);
    setCompletedSteps([]);
    setCurrentStep(1);
  };

  const progressPercent = (completedSteps.length / selectedGuide.steps.length) * 100;

  // Context for AI - knows which guide is being viewed
  const pageContext = useMemo(() => ({
    page: "maintenance",
    selectedGuide: selectedGuide.title,
    guideId: selectedGuide.id,
    currentStep,
    completedSteps: completedSteps.length,
    totalSteps: selectedGuide.steps.length,
    progressPercent: Math.round(progressPercent),
  }), [selectedGuide, currentStep, completedSteps, progressPercent]);

  // Maintenance-specific AI suggestions
  const maintenanceSuggestions = useMemo(() => [
    {
      id: "maint-help",
      title: "Help with this step",
      detailedSuggestion: `Explain step ${currentStep} of ${selectedGuide.title} in more detail`,
      messageId: "step-help-query",
    },
    {
      id: "maint-products",
      title: "Recommended products",
      detailedSuggestion: `What cleaning products and tools do I need for ${selectedGuide.title.toLowerCase()}?`,
      messageId: "products-query",
    },
    {
      id: "maint-troubleshoot",
      title: "Troubleshooting",
      detailedSuggestion: "What are common maintenance mistakes to avoid?",
      messageId: "troubleshoot-query",
    },
  ], [selectedGuide, currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <PageHeader pageName="Maintenance" accentColor="text-purple-400" />

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Maintenance Guides</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Keep your firearms in optimal condition with our step-by-step maintenance guides.
          </p>
        </motion.div>

        {/* Safety Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SafetyWarning
            level="warning"
            title="Before You Begin"
            message="Always ensure your firearm is completely unloaded before performing any maintenance. Remove all ammunition from your work area."
            dismissible={false}
          />
        </motion.div>

        {/* Guide Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {maintenanceGuides.map((guide) => {
            const Icon = guide.icon;
            const isSelected = selectedGuide.id === guide.id;
            return (
              <button
                key={guide.id}
                onClick={() => handleGuideChange(guide)}
                className={`p-5 rounded-xl border transition-all text-left ${
                  isSelected
                    ? `bg-gradient-to-br ${guide.color} border-transparent text-white`
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? "bg-white/20" : "bg-slate-700/50"}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${isSelected ? "text-white" : "text-white"}`}>
                      {guide.title}
                    </h3>
                    <p className={`text-sm mb-3 ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${isSelected ? "text-white/70" : "text-slate-500"}`}>
                        <Clock className="w-3 h-3" />
                        {guide.duration}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? "bg-white/20 text-white" 
                          : "bg-slate-700 text-slate-400"
                      }`}>
                        {guide.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Progress
              </h3>
              <span className="text-slate-400 text-sm">
                {completedSteps.length} of {selectedGuide.steps.length} steps completed
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {progressPercent === 100 && (
              <p className="text-green-400 text-sm mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Maintenance complete! Great job keeping your firearm in top condition.
              </p>
            )}
          </div>
        </motion.div>

        {/* Step Guide Component */}
        <motion.div
          key={selectedGuide.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StepGuide
            title={selectedGuide.title}
            description={selectedGuide.description}
            category="cleaning"
            difficulty={selectedGuide.difficulty === "Beginner" ? "beginner" : selectedGuide.difficulty === "Intermediate" ? "intermediate" : "advanced"}
            totalDuration={selectedGuide.duration}
            steps={selectedGuide.steps.map(step => ({
              id: String(step.id),
              title: step.title,
              description: step.description,
              tips: step.tips,
              warnings: step.warning ? [step.warning] : undefined,
            }))}
          />
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <a
            href="/safety"
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-green-500/50 transition-all group"
          >
            <Shield className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-white font-semibold mb-2 group-hover:text-green-400 transition-colors">
              Safety Checklists
            </h3>
            <p className="text-slate-400 text-sm">
              Review essential safety procedures before and after maintenance.
            </p>
          </a>
          
          <a
            href="/chat"
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all group"
          >
            <AlertTriangle className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
              Ask the AI Assistant
            </h3>
            <p className="text-slate-400 text-sm">
              Have questions about your specific firearm? Get AI-powered guidance.
            </p>
          </a>
        </motion.div>
      </div>

      {/* Embedded AI Chat with Context Helpers */}
      <ClientOnly>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={components}
          tools={tools}
        >
          <PageContextHelper 
            contextKey="maintenancePage"
            context={pageContext}
          />
          <EmbeddedChat
            pageName="maintenance"
            suggestions={maintenanceSuggestions}
            pageContext={pageContext}
            title="Maintenance Assistant"
          />
        </TamboProvider>
      </ClientOnly>
    </div>
  );
}
