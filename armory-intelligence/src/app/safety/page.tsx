"use client";

/**
 * @file safety/page.tsx
 * @description Safety education page with checklists, warnings, and embedded AI chat
 */

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { SafetyWarning } from "@/components/armory/safety-warning";
import { InteractiveChecklist } from "@/components/armory/interactive-checklist";
import { EmbeddedChat } from "@/components/tambo/embedded-chat";
import { PageContextHelper } from "@/components/tambo/page-context-helper";
import { PageHeader } from "@/components/armory/page-header";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { ClientOnly } from "@/components/client-only";

import { 
  Shield, 
  Lock, 
  Crosshair, 
  Brush, 
  Truck, 
  AlertTriangle,
  CheckCircle2,
  BookOpen
} from "lucide-react";

const safetyCategories = [
  { 
    id: "storage", 
    name: "Safe Storage", 
    icon: Lock, 
    color: "from-blue-500 to-blue-600",
    description: "Proper firearm storage prevents unauthorized access" 
  },
  { 
    id: "handling", 
    name: "Safe Handling", 
    icon: Crosshair, 
    color: "from-green-500 to-green-600",
    description: "Basic handling rules every owner must follow" 
  },
  { 
    id: "cleaning", 
    name: "Cleaning Safety", 
    icon: Brush, 
    color: "from-purple-500 to-purple-600",
    description: "Stay safe during maintenance and cleaning" 
  },
  { 
    id: "transport", 
    name: "Transportation", 
    icon: Truck, 
    color: "from-orange-500 to-orange-600",
    description: "Legal and safe transport guidelines" 
  },
  { 
    id: "range", 
    name: "Range Safety", 
    icon: Crosshair, 
    color: "from-red-500 to-red-600",
    description: "Essential rules for range and field use" 
  },
];

const fundamentalRules = [
  {
    rule: "Treat every firearm as if it's loaded",
    explanation: "Even when you know a firearm is unloaded, handle it with the same care as a loaded weapon. This mindset prevents negligent discharges.",
    priority: "critical" as const,
  },
  {
    rule: "Never point the muzzle at anything you're not willing to destroy",
    explanation: "Always be aware of where your firearm is pointed. Keep it in a safe direction at all times.",
    priority: "critical" as const,
  },
  {
    rule: "Keep your finger off the trigger until ready to shoot",
    explanation: "Rest your finger along the frame, outside the trigger guard, until you have made the conscious decision to shoot.",
    priority: "critical" as const,
  },
  {
    rule: "Be sure of your target and what's beyond it",
    explanation: "Identify your target and what lies beyond it. Bullets can penetrate targets and continue traveling.",
    priority: "critical" as const,
  },
];

const storageChecklist = {
  title: "Firearm Storage Safety Checklist",
  items: [
    { id: "s1", text: "Unload all firearms before storage", priority: "critical" as const },
    { id: "s2", text: "Store firearms in a locked safe or cabinet", priority: "critical" as const },
    { id: "s3", text: "Store ammunition separately from firearms", priority: "high" as const },
    { id: "s4", text: "Use trigger locks or cable locks as secondary security", priority: "medium" as const },
    { id: "s5", text: "Keep safe combination/keys secure and private", priority: "high" as const },
    { id: "s6", text: "Install safe in climate-controlled area", priority: "low" as const },
    { id: "s7", text: "Teach household members gun safety rules", priority: "critical" as const },
    { id: "s8", text: "Consider quick-access safes for home defense firearms", priority: "medium" as const },
  ],
  description: "Follow these steps to ensure your firearms are stored safely and securely.",
};

const cleaningChecklist = {
  title: "Cleaning & Maintenance Safety Checklist",
  items: [
    { id: "c1", text: "Remove magazine and verify chamber is EMPTY", priority: "critical" as const },
    { id: "c2", text: "Double-check: visually and physically inspect chamber", priority: "critical" as const },
    { id: "c3", text: "Point firearm in safe direction during inspection", priority: "critical" as const },
    { id: "c4", text: "Work in well-ventilated area (solvent fumes)", priority: "high" as const },
    { id: "c5", text: "Keep ammunition out of cleaning area", priority: "critical" as const },
    { id: "c6", text: "Use appropriate cleaning supplies for your firearm", priority: "medium" as const },
    { id: "c7", text: "Follow manufacturer's disassembly instructions", priority: "high" as const },
    { id: "c8", text: "Perform function check after reassembly", priority: "high" as const },
  ],
  description: "Essential safety steps before and during firearm maintenance.",
};

export default function SafetyPage() {
  const [selectedCategory, setSelectedCategory] = useState("storage");
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const handleItemToggle = (itemId: string) => {
    setCompletedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const currentChecklist = selectedCategory === "cleaning" ? cleaningChecklist : storageChecklist;
  const categoryName = safetyCategories.find(c => c.id === selectedCategory)?.name || "Safety";

  // Context for AI - knows which safety topic is being viewed
  const pageContext = useMemo(() => ({
    page: "safety",
    selectedCategory,
    categoryName,
    completedItems: completedItems.length,
    totalItems: currentChecklist.items.length,
    checklistProgress: Math.round((completedItems.length / currentChecklist.items.length) * 100),
  }), [selectedCategory, categoryName, completedItems, currentChecklist]);

  // Safety-specific AI suggestions
  const safetySuggestions = useMemo(() => [
    {
      id: "safety-quiz",
      title: "Quiz me on safety",
      detailedSuggestion: `Quiz me on ${categoryName.toLowerCase()} safety rules`,
      messageId: "quiz-query",
    },
    {
      id: "safety-explain",
      title: "Explain the rules",
      detailedSuggestion: "Explain the 4 fundamental rules of firearm safety in detail",
      messageId: "explain-query",
    },
    {
      id: "safety-scenario",
      title: "Safety scenario",
      detailedSuggestion: `What should I do if I find an unattended firearm?`,
      messageId: "scenario-query",
    },
  ], [categoryName]);

  return (
    <ClientOnly>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
      >
        <PageContextHelper 
          contextKey="safetyPage"
          context={pageContext}
        />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <PageHeader pageName="Safety" accentColor="text-green-400" />

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Firearms Safety</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Safety is the foundation of responsible firearms ownership. Learn and practice these essential guidelines.
          </p>
        </motion.div>

        {/* Critical Safety Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <SafetyWarning
            level="critical"
            title="The Four Fundamental Rules"
            message="These rules must be followed at ALL times. Violating any one of them can result in injury or death."
            actions={fundamentalRules.map(r => r.rule)}
            dismissible={false}
          />
        </motion.div>

        {/* Fundamental Rules Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {fundamentalRules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-2xl p-6 border border-red-500/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{rule.rule}</h3>
                  <p className="text-slate-400 text-sm">{rule.explanation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Tabs */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Safety Checklists</h2>
          <div className="flex flex-wrap gap-3">
            {safetyCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Category Content */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Checklist */}
          <div>
            <InteractiveChecklist
              title={currentChecklist.title}
              description={currentChecklist.description}
              category={selectedCategory as "storage" | "cleaning" | "transport" | "range" | "safety" | "purchase"}
              items={currentChecklist.items}
              allowSkip={false}
              showProgress={true}
            />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-400" />
                Why This Matters
              </h3>
              <p className="text-slate-400 mb-4">{currentChecklist.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-400"><strong className="text-red-400">Critical:</strong> Must be done every time</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-slate-400"><strong className="text-orange-400">High:</strong> Strongly recommended</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-400"><strong className="text-yellow-400">Medium:</strong> Recommended practice</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-400"><strong className="text-blue-400">Low:</strong> Best practice</span>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-gradient-to-br from-green-950/50 to-green-900/30 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Your Progress
                </h3>
                <span className="text-green-400 font-bold">
                  {completedItems.length}/{currentChecklist.items.length}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{
                    width: `${(completedItems.length / currentChecklist.items.length) * 100}%`,
                  }}
                />
              </div>
              {completedItems.length === currentChecklist.items.length && (
                <p className="text-green-400 text-sm mt-3">
                  ✓ Checklist complete! Great job practicing safety.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/maintenance"
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all group"
            >
              <Brush className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                Maintenance Guides
              </h3>
              <p className="text-slate-400 text-sm">
                Step-by-step guides for cleaning and maintaining your firearms.
              </p>
            </a>
            
            <a
              href="/regulations"
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all group"
            >
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                State Regulations
              </h3>
              <p className="text-slate-400 text-sm">
                Understand the laws in your state regarding ownership and carry.
              </p>
            </a>
            
            <a
              href="/chat"
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all group"
            >
              <AlertTriangle className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                Ask the AI
              </h3>
              <p className="text-slate-400 text-sm">
                Have questions? Our AI assistant can help with safety-related queries.
              </p>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Embedded AI Chat */}
      <EmbeddedChat
        pageName="safety"
        suggestions={safetySuggestions}
        pageContext={pageContext}
        title="Safety Assistant"
      />
        </div>
      </TamboProvider>
    </ClientOnly>
  );
}
