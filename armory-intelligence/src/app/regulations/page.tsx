"use client";

/**
 * @file regulations/page.tsx
 * @description State firearms regulations lookup page with embedded AI chat
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RegulationCard } from "@/components/armory/regulation-card";
import { EmbeddedChat } from "@/components/tambo/embedded-chat";
import { PageContextHelper } from "@/components/tambo/page-context-helper";
import { PageHeader } from "@/components/armory/page-header";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { ClientOnly } from "@/components/client-only";
import { 
  Scale, 
  MapPin, 
  Search, 
  AlertTriangle,
  Info,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";

const usStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

// Mock data for demonstration (will be replaced with API data)
const mockRegulations: Record<string, any> = {
  TX: {
    stateName: "Texas",
    stateCode: "TX",
    permitRequired: false,
    permitType: "Constitutional Carry",
    openCarryLegal: true,
    concealedCarryLegal: true,
    purchasePermitRequired: false,
    registrationRequired: false,
    assaultWeaponsBan: false,
    magazineCapacityLimit: null,
    waitingPeriod: null,
    universalBackgroundChecks: false,
    redFlagLaw: false,
    standYourGround: true,
    castleDoctrine: true,
    dutyToRetreat: false,
    restrictions: [
      "Cannot carry in schools, polling places, courthouses",
      "Cannot carry while intoxicated",
      "Must be 21+ for handgun purchase from FFL",
    ],
    reciprocity: ["AZ", "FL", "GA", "KY", "LA", "MS", "NC", "OH", "OK", "SC", "TN", "UT", "WV"],
    lastUpdated: "2024-01-15",
  },
  CA: {
    stateName: "California",
    stateCode: "CA",
    permitRequired: true,
    permitType: "May Issue",
    openCarryLegal: false,
    concealedCarryLegal: true,
    purchasePermitRequired: true,
    registrationRequired: true,
    assaultWeaponsBan: true,
    magazineCapacityLimit: 10,
    waitingPeriod: 10,
    universalBackgroundChecks: true,
    redFlagLaw: true,
    standYourGround: false,
    castleDoctrine: true,
    dutyToRetreat: true,
    restrictions: [
      "Assault weapons and .50 BMG rifles banned",
      "10-round magazine capacity limit",
      "10-day waiting period for all purchases",
      "Handgun roster limits available models",
      "Safe handling demonstration required",
    ],
    reciprocity: [],
    lastUpdated: "2024-01-15",
  },
};

export default function RegulationsPage() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [regulations, setRegulations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredStates = usStates.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateSelect = async (stateCode: string) => {
    setSelectedState(stateCode);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/regulations/${stateCode}`);
      const data = await response.json();

      if (data.success) {
        setRegulations(data.data);
      } else {
        // Fallback to mock data for demo
        if (mockRegulations[stateCode]) {
          setRegulations(mockRegulations[stateCode]);
        } else {
          setError(`Regulations for ${stateCode} are being compiled. Check back soon.`);
          setRegulations(null);
        }
      }
    } catch (err) {
      // Fallback to mock data
      if (mockRegulations[stateCode]) {
        setRegulations(mockRegulations[stateCode]);
      } else {
        setError("Failed to fetch regulations");
        setRegulations(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Context for AI - knows what state is selected
  const selectedStateName = usStates.find(s => s.code === selectedState)?.name;
  const pageContext = useMemo(() => ({
    page: "regulations",
    selectedState: selectedState || "none",
    selectedStateName: selectedStateName || "none",
    hasRegulations: !!regulations,
    permitRequired: regulations?.permitRequired,
    concealedCarryLegal: regulations?.concealedCarryLegal,
    openCarryLegal: regulations?.openCarryLegal,
  }), [selectedState, selectedStateName, regulations]);

  // Regulations-specific AI suggestions
  const regulationsSuggestions = useMemo(() => [
    {
      id: "regulations-explain",
      title: selectedState ? `Explain ${selectedStateName} laws` : "Select a state",
      detailedSuggestion: selectedState 
        ? `Explain the key firearms regulations in ${selectedStateName}` 
        : "Help me understand state firearms regulations",
      messageId: "explain-query",
    },
    {
      id: "regulations-compare",
      title: "Compare states",
      detailedSuggestion: "Compare Texas and California gun laws",
      messageId: "compare-query",
    },
    {
      id: "regulations-travel",
      title: "Traveling with firearms",
      detailedSuggestion: selectedState 
        ? `What do I need to know about traveling to ${selectedStateName} with a firearm?`
        : "What are the rules for traveling between states with firearms?",
      messageId: "travel-query",
    },
  ], [selectedState, selectedStateName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <PageHeader pageName="Regulations" accentColor="text-blue-400" />

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">State Regulations</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Understand firearms laws in your state. Laws vary significantly—always verify with local authorities.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-400 font-semibold mb-1">Legal Disclaimer</h3>
              <p className="text-amber-200/70 text-sm">
                This information is for educational purposes only and may not reflect the most current laws. 
                Always consult official state sources, legal counsel, or local law enforcement for the most 
                accurate and up-to-date regulations.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* State Selector */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 sticky top-24"
            >
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Select Your State
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search states..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm"
                />
              </div>

              {/* State List */}
              <div className="max-h-96 overflow-y-auto space-y-1 pr-2">
                {filteredStates.map((state) => (
                  <button
                    key={state.code}
                    onClick={() => handleStateSelect(state.code)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                      selectedState === state.code
                        ? "bg-blue-500 text-white"
                        : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <span>{state.name}</span>
                    <span className="text-xs opacity-70">{state.code}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Regulations Display */}
          <div className="lg:col-span-2">
            {!selectedState && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/30 rounded-2xl p-12 border border-slate-700 text-center"
              >
                <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl text-slate-400 mb-2">Select a State</h3>
                <p className="text-slate-500">
                  Choose a state from the list to view its firearms regulations
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/30 rounded-2xl p-12 border border-slate-700 text-center"
              >
                <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-slate-400">Loading regulations...</p>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-950/30 rounded-2xl p-8 border border-red-500/30 text-center"
              >
                <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-300">{error}</p>
              </motion.div>
            )}

            {regulations && !loading && (
              <motion.div
                key={selectedState}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <RegulationCard
                  state={regulations.stateName || usStates.find(s => s.code === selectedState)?.name || selectedState}
                  stateCode={regulations.stateCode || selectedState}
                  permitRequired={regulations.permitRequired ?? false}
                  openCarry={regulations.openCarryLegal ? "allowed" : "prohibited"}
                  concealedCarry={regulations.permitType === "Constitutional Carry" ? "unrestricted" : regulations.concealedCarryLegal ? "shall-issue" : "may-issue"}
                  waitingPeriod={regulations.waitingPeriod}
                  backgroundCheck={true}
                  registrationRequired={regulations.registrationRequired ?? false}
                  assaultWeaponBan={regulations.assaultWeaponsBan ?? false}
                  magazineCapacityLimit={regulations.magazineCapacityLimit}
                  redFlagLaw={regulations.redFlagLaw ?? false}
                  reciprocalStates={regulations.reciprocity}
                  lastUpdated={regulations.lastUpdated}
                />

                {/* Quick Reference */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                    <h4 className="text-white font-medium mb-3">Self-Defense Laws</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Stand Your Ground</span>
                        {regulations.standYourGround ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Castle Doctrine</span>
                        {regulations.castleDoctrine ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Duty to Retreat</span>
                        {regulations.dutyToRetreat ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                    <h4 className="text-white font-medium mb-3">Additional Requirements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Universal Background Checks</span>
                        {regulations.universalBackgroundChecks ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Red Flag Law</span>
                        {regulations.redFlagLaw ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Assault Weapons Ban</span>
                        {regulations.assaultWeaponsBan ? (
                          <CheckCircle2 className="w-5 h-5 text-red-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded AI Chat with Context Helpers */}
      <ClientOnly>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={components}
          tools={tools}
        >
          <PageContextHelper 
            contextKey="regulationsPage"
            context={pageContext}
          />
          <EmbeddedChat
            pageName="regulations"
            suggestions={regulationsSuggestions}
            pageContext={pageContext}
            title="Regulations Assistant"
          />
        </TamboProvider>
      </ClientOnly>
    </div>
  );
}
