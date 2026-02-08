/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 * 
 * Arsenal Nexus - Star Wars × Modern Military AI-Powered Platform
 * This file registers all custom components and tools for the Tambo AI SDK.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import {
  FirearmCard,
  firearmCardSchema,
  SafetyWarning,
  safetyWarningSchema,
  ComparisonTable,
  comparisonTablePropsSchema,
  InteractiveChecklist,
  interactiveChecklistSchema,
  BallisticsChart,
  ballisticsChartSchema,
  HologramCard,
  hologramCardPropsSchema,
  WeaponShowdown,
  weaponShowdownPropsSchema,
  TacticalBriefing,
  tacticalBriefingPropsSchema,
} from "@/components/armory";
import { FilterPanel, filterPanelSchema } from "@/components/armory/filter-panel";
import { RegulationCard, regulationCardSchema } from "@/components/armory/regulation-card";
import { StepGuide, stepGuideSchema } from "@/components/armory/step-guide";

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { getWeapons, getComparisonData, getWeaponByName } from "@/lib/weapons-service";

// ============================================
// MOCK DATA SERVICE (Replace with actual API later)
// ============================================

const mockFirearmsDatabase = [
  {
    id: "glock-19",
    name: "Glock 19 Gen5",
    manufacturer: "Glock",
    type: "handgun",
    action: "semi-auto",
    caliber: "9mm",
    capacity: 15,
    weight: 1.5,
    barrelLength: 4.02,
    price: 549,
    description: "Compact, reliable pistol popular for concealed carry and duty use.",
    safetyFeatures: ["Safe Action System", "Trigger Safety", "Firing Pin Safety", "Drop Safety"],
  },
  {
    id: "sig-p320",
    name: "Sig Sauer P320 Compact",
    manufacturer: "Sig Sauer",
    type: "handgun",
    action: "semi-auto",
    caliber: "9mm",
    capacity: 15,
    weight: 1.6,
    barrelLength: 3.9,
    price: 579,
    description: "Modular striker-fired pistol adopted by US Military as M17/M18.",
    safetyFeatures: ["Striker Safety", "Disconnect Safety", "3-Point Takedown Safety"],
  },
  {
    id: "ar-15",
    name: "Smith & Wesson M&P15 Sport II",
    manufacturer: "Smith & Wesson",
    type: "rifle",
    action: "semi-auto",
    caliber: "5.56 NATO/.223",
    capacity: 30,
    weight: 6.5,
    barrelLength: 16,
    price: 749,
    description: "Popular AR-15 platform rifle for sport shooting and home defense.",
    safetyFeatures: ["Safety Selector", "Bolt Catch", "Forward Assist"],
  },
  {
    id: "mossberg-500",
    name: "Mossberg 500",
    manufacturer: "Mossberg",
    type: "shotgun",
    action: "pump",
    caliber: "12 Gauge",
    capacity: 6,
    weight: 7.5,
    barrelLength: 18.5,
    price: 419,
    description: "Classic pump-action shotgun trusted for decades in home defense.",
    safetyFeatures: ["Tang Safety", "Dual Extractors", "Anti-Jam Elevator"],
  },
];

// ============================================
// TAMBO TOOLS
// ============================================

export const tools: TamboTool[] = [
  {
    name: "searchFirearms",
    description: "Search firearms database by type, caliber, manufacturer, or price.",
    tool: async ({ type, caliber, manufacturer, maxPrice, limit }) => {
      let results = [...mockFirearmsDatabase];
      if (type) results = results.filter(f => f.type === type);
      if (caliber) results = results.filter(f => f.caliber.toLowerCase().includes(caliber.toLowerCase()));
      if (manufacturer) results = results.filter(f => f.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));
      if (maxPrice) results = results.filter(f => f.price && f.price <= maxPrice);
      if (limit) results = results.slice(0, limit);
      return results;
    },
    inputSchema: z.object({
      type: z.enum(["handgun", "rifle", "shotgun"]).optional().describe("Filter by firearm type"),
      caliber: z.string().optional().describe("Filter by caliber"),
      manufacturer: z.string().optional().describe("Filter by manufacturer"),
      maxPrice: z.number().optional().describe("Maximum price"),
      limit: z.number().optional().describe("Limit results"),
    }),
    outputSchema: z.array(z.object({
      id: z.string(),
      name: z.string(),
      manufacturer: z.string(),
      type: z.string(),
      action: z.string(),
      caliber: z.string(),
      capacity: z.number(),
      weight: z.number(),
      barrelLength: z.number(),
      price: z.number().optional(),
      description: z.string().optional(),
      safetyFeatures: z.array(z.string()).optional(),
    })),
  },
  {
    name: "calculateBallistics",
    description: "Calculate bullet drop, velocity, and energy at a given distance. Use for trajectory/ballistics questions.",
    tool: async ({ firearmId, distance, windSpeed, temperature, humidity, barometricPressure }) => {
      try {
        const response = await fetch("/api/ballistics/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firearmId,
            distance,
            windSpeed,
            temperature,
            humidity,
            barometricPressure,
          }),
        });
        const data = await response.json();
        return data.success ? data.data : { error: data.error };
      } catch (error) {
        return { error: "Failed to calculate ballistics" };
      }
    },
    inputSchema: z.object({
      firearmId: z.string().describe("ID of the firearm to calculate ballistics for"),
      distance: z.number().describe("Distance in yards (0-1000)"),
      windSpeed: z.number().optional().describe("Wind speed in mph"),
      temperature: z.number().optional().describe("Temperature in Fahrenheit"),
      humidity: z.number().optional().describe("Humidity percentage"),
      barometricPressure: z.number().optional().describe("Barometric pressure in inches Hg"),
    }),
    outputSchema: z.object({
      distance: z.number(),
      dropInches: z.number(),
      windDriftInches: z.number(),
      timeOfFlight: z.number(),
      velocityAtDistance: z.number(),
      energyAtMuzzle: z.number(),
      energyAtDistance: z.number(),
      velocityRetention: z.number(),
      error: z.string().optional(),
    }),
  },
  {
    name: "getStateRegulations",
    description: "Get firearms regulations and CCW reciprocity for a US state. Use for legal/regulatory questions.",
    tool: async ({ state }) => {
      try {
        const response = await fetch(`/api/regulations/${state}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return data.success ? data.data : { error: data.error };
      } catch (error) {
        return { error: "Failed to fetch regulations" };
      }
    },
    inputSchema: z.object({
      state: z.string().describe("Two-letter state code (e.g., CA, TX, FL)"),
    }),
    outputSchema: z.object({
      state: z.string(),
      regulations: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        restriction: z.string().optional(),
      })),
      ccwReciprocity: z
        .object({
          state: z.string(),
          reciprocalStates: z.array(z.string()).optional(),
          permitRequired: z.boolean(),
          permitType: z.string().optional(),
        })
        .nullable(),
      error: z.string().optional(),
    }),
  },
  {
    name: "getSafetyChecklist",
    description: "Get safety checklist for storage, cleaning, range use, etc.",
    tool: async ({ category }) => {
      const checklists: Record<string, any> = {
        storage: {
          title: "Firearm Storage Safety Checklist",
          description: "Essential steps for safe firearm storage",
          items: [
            { id: "s1", text: "Unload all firearms before storage", priority: "critical" },
            { id: "s2", text: "Store firearms in a locked safe or cabinet", priority: "critical" },
            { id: "s3", text: "Store ammunition separately", priority: "high" },
          ],
        },
        cleaning: {
          title: "Firearm Cleaning Safety Checklist",
          description: "Safety steps before and during maintenance",
          items: [
            { id: "c1", text: "Remove magazine and verify chamber is EMPTY", priority: "critical" },
            { id: "c2", text: "Point firearm in a safe direction", priority: "critical" },
            { id: "c3", text: "Work in a well-ventilated area", priority: "high" },
          ],
        },
      };
      return checklists[category] || checklists.storage;
    },
    inputSchema: z.object({
      category: z.enum(["storage", "cleaning", "range"]).describe("Type of checklist"),
    }),
    outputSchema: z.object({
      title: z.string(),
      description: z.string(),
      items: z.array(z.object({
        id: z.string(),
        text: z.string(),
        priority: z.string(),
      })),
    }),
  },

  // ============================================
  // ARSENAL NEXUS TOOLS (Star Wars × Real)
  // ============================================
  {
    name: "searchAllWeapons",
    description: "Search the Arsenal Nexus weapons database. Includes both real-world and Star Wars weapons. Use for questions about weapons, blasters, firearms, lightsabers, etc.",
    tool: async ({ universe, category, search, sortBy, limit }) => {
      const weapons = await getWeapons({ universe, category, search, sortBy, sortOrder: "desc", limit: limit ?? 6 });
      return weapons.map(w => ({
        name: w.name,
        universe: w.universe,
        category: w.category,
        manufacturer: w.manufacturer,
        era: w.era,
        description: w.description,
        damageRating: w.damage_rating,
        effectiveRange: w.effective_range_m,
        weight: w.weight_kg,
        rateOfFire: w.rate_of_fire,
        tacticalScore: w.tactical_score,
        coolnessFactor: w.coolness_factor,
        communityRating: w.community_rating,
        comparisonNotes: w.comparison_notes,
        specialFeature: w.stun_setting ? "Stun setting" : w.kyber_crystal_type ? `${w.kyber_crystal_type} crystal` : undefined,
      }));
    },
    inputSchema: z.object({
      universe: z.enum(["real", "star-wars"]).optional().describe("Filter by universe: 'real' for modern weapons, 'star-wars' for sci-fi"),
      category: z.enum(["rifle", "pistol", "heavy", "shotgun", "sniper", "explosive", "melee", "special", "carbine"]).optional().describe("Weapon category"),
      search: z.string().optional().describe("Search by name"),
      sortBy: z.enum(["damage_rating", "coolness_factor", "tactical_score", "community_rating"]).optional().describe("Sort by stat"),
      limit: z.number().optional().describe("Max results (default 6)"),
    }),
    outputSchema: z.array(z.object({
      name: z.string(),
      universe: z.string(),
      category: z.string(),
      manufacturer: z.string(),
      era: z.string(),
      description: z.string(),
      damageRating: z.number(),
      effectiveRange: z.number(),
      weight: z.number(),
      rateOfFire: z.string(),
      tacticalScore: z.number(),
      coolnessFactor: z.number(),
      communityRating: z.number(),
      comparisonNotes: z.string().optional(),
      specialFeature: z.string().optional(),
    })),
  },
  {
    name: "compareSciFiToReal",
    description: "Compare a Star Wars weapon to its real-world equivalent. Use for 'compare E-11 to M4' or 'how does a blaster compare to a rifle' type questions. Generates a head-to-head showdown.",
    tool: async ({ sciFiWeaponName }) => {
      const comparisons = await getComparisonData(sciFiWeaponName);
      if (comparisons.length === 0) {
        return { error: "No comparison found. Try a Star Wars weapon name like 'E-11', 'DL-44', or 'Lightsaber'." };
      }
      const c = comparisons[0];
      return {
        sciFiWeapon: {
          name: c.sciFi.name,
          universe: "star-wars",
          manufacturer: c.sciFi.manufacturer,
          damage: c.sciFi.damage_rating,
          range: c.sciFi.effective_range_m,
          weight: c.sciFi.weight_kg,
          rateOfFire: c.sciFi.rate_of_fire,
          tacticalScore: c.sciFi.tactical_score,
          coolness: c.sciFi.coolness_factor,
          specialAbility: c.sciFi.stun_setting ? "Stun mode" : c.sciFi.kyber_crystal_type ? `${c.sciFi.kyber_crystal_type} crystal` : undefined,
        },
        realWeapon: {
          name: c.real.name,
          universe: "real",
          manufacturer: c.real.manufacturer,
          damage: c.real.damage_rating,
          range: c.real.effective_range_m,
          weight: c.real.weight_kg,
          rateOfFire: c.real.rate_of_fire,
          tacticalScore: c.real.tactical_score,
          coolness: c.real.coolness_factor,
          specialAbility: c.real.action_type ?? undefined,
        },
        rangeAnalysis: c.analysis.rangeAdvantage,
        damageAnalysis: c.analysis.damageAdvantage,
        physicsNote: c.analysis.physicsNote,
        tacticalVerdict: c.analysis.tacticalVerdict,
        funFact: c.analysis.funFact,
      };
    },
    inputSchema: z.object({
      sciFiWeaponName: z.string().describe("The Star Wars weapon name to compare (e.g. 'E-11', 'DL-44', 'Lightsaber', 'Bowcaster')"),
    }),
    outputSchema: z.object({
      sciFiWeapon: z.object({
        name: z.string(),
        universe: z.string(),
        manufacturer: z.string(),
        damage: z.number(),
        range: z.number(),
        weight: z.number(),
        rateOfFire: z.string(),
        tacticalScore: z.number(),
        coolness: z.number(),
        specialAbility: z.string().optional(),
      }),
      realWeapon: z.object({
        name: z.string(),
        universe: z.string(),
        manufacturer: z.string(),
        damage: z.number(),
        range: z.number(),
        weight: z.number(),
        rateOfFire: z.string(),
        tacticalScore: z.number(),
        coolness: z.number(),
        specialAbility: z.string().optional(),
      }),
      rangeAnalysis: z.string(),
      damageAnalysis: z.string(),
      physicsNote: z.string(),
      tacticalVerdict: z.string(),
      funFact: z.string(),
      error: z.string().optional(),
    }),
  },
  {
    name: "getMissionBriefing",
    description: "Generate a tactical mission briefing that blends Star Wars scenarios with real military tactics. Use for 'create a mission', 'tactical scenario', 'battle plan' type requests.",
    tool: async ({ scenarioType, weaponPreference }) => {
      // Build a dynamic briefing from the weapons database
      const allWeapons = await getWeapons({ limit: 19 });
      const sciFiWeapons = allWeapons.filter(w => w.universe === "star-wars");
      const realWeapons = allWeapons.filter(w => w.universe === "real");
      
      // Pick recommended weapons
      const recs = [];
      if (weaponPreference) {
        const match = await getWeaponByName(weaponPreference);
        if (match) recs.push({ name: match.name, universe: match.universe, reason: "User requested", rating: 4 });
      }
      // Add top sci-fi and real weapons
      const topSciFi = sciFiWeapons.sort((a, b) => b.tactical_score - a.tactical_score).slice(0, 2);
      const topReal = realWeapons.sort((a, b) => b.tactical_score - a.tactical_score).slice(0, 2);
      for (const w of topSciFi) recs.push({ name: w.name, universe: w.universe, reason: `Top ${w.category} — tactical score ${w.tactical_score}`, rating: Math.ceil(w.tactical_score / 20) });
      for (const w of topReal) recs.push({ name: w.name, universe: w.universe, reason: `Top ${w.category} — tactical score ${w.tactical_score}`, rating: Math.ceil(w.tactical_score / 20) });
      
      return {
        weaponRecommendations: recs.slice(0, 4),
        availableSciFiWeapons: sciFiWeapons.map(w => w.name),
        availableRealWeapons: realWeapons.map(w => w.name),
        scenarioType: scenarioType ?? "assault",
      };
    },
    inputSchema: z.object({
      scenarioType: z.enum(["assault", "defense", "recon", "extraction", "siege"]).optional().describe("Type of tactical scenario"),
      weaponPreference: z.string().optional().describe("Preferred weapon name to include"),
    }),
    outputSchema: z.object({
      weaponRecommendations: z.array(z.object({
        name: z.string(),
        universe: z.string(),
        reason: z.string(),
        rating: z.number(),
      })),
      availableSciFiWeapons: z.array(z.string()),
      availableRealWeapons: z.array(z.string()),
      scenarioType: z.string(),
    }),
  },
];

// ============================================
// TAMBO COMPONENTS
// ============================================

export const components: TamboComponent[] = [
  {
    name: "FirearmCard",
    description: "Display firearm specifications in card format.",
    component: FirearmCard,
    propsSchema: firearmCardSchema,
  },
  {
    name: "SafetyWarning",
    description: "Display safety warnings and alerts.",
    component: SafetyWarning,
    propsSchema: safetyWarningSchema,
  },
  {
    name: "ComparisonTable",
    description: "Compare 2-4 firearms side-by-side. Users can select a firearm for focus, remove firearms, and mark important specs. AI can observe user preferences.",
    component: ComparisonTable,
    propsSchema: comparisonTablePropsSchema,
  },
  {
    name: "InteractiveChecklist",
    description: "Interactive checklist for safety and maintenance.",
    component: InteractiveChecklist,
    propsSchema: interactiveChecklistSchema,
  },
  {
    name: "BallisticsChart",
    description: "Visualize bullet trajectory and ballistics data.",
    component: BallisticsChart,
    propsSchema: ballisticsChartSchema,
  },
  {
    name: "FilterPanel",
    description: "Dynamic filter panel for firearms by type, caliber, price, and sort order.",
    component: FilterPanel,
    propsSchema: filterPanelSchema,
  },
  {
    name: "Graph",
    description: "Render charts using Recharts.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "Display options as clickable cards.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "RegulationCard",
    description: "Display state firearms regulations with requirements, restrictions, and CCW reciprocity.",
    component: RegulationCard,
    propsSchema: regulationCardSchema,
  },
  {
    name: "StepGuide",
    description: "Step-by-step guide for maintenance, cleaning, and safety procedures with progress tracking.",
    component: StepGuide,
    propsSchema: stepGuideSchema,
  },

  // ============================================
  // ARSENAL NEXUS COMPONENTS (Star Wars × Real)
  // ============================================
  {
    name: "HologramCard",
    description: "Display a weapon in holographic Star Wars style. Use for showing individual weapon details from either universe (real or Star Wars). Sci-fi weapons get a cyan holographic look, real weapons get amber military look. Best for showcasing single weapons.",
    component: HologramCard,
    propsSchema: hologramCardPropsSchema,
  },
  {
    name: "WeaponShowdown",
    description: "Epic head-to-head comparison between a Star Wars weapon and its real-world equivalent. Shows animated stat bars, physics analysis, fun facts, and lets users vote. Use when comparing a sci-fi weapon to a real one, like 'E-11 vs M4A1' or 'DL-44 vs .44 Magnum'. ALWAYS use the compareSciFiToReal tool first to get data.",
    component: WeaponShowdown,
    propsSchema: weaponShowdownPropsSchema,
  },
  {
    name: "TacticalBriefing",
    description: "Star Wars-style tactical mission briefing that blends sci-fi scenarios with real military tactics. Shows mission objectives, threat assessment, weapon recommendations, and historical parallels. Use when users ask for tactical scenarios, mission plans, or 'what if' battle scenarios.",
    component: TacticalBriefing,
    propsSchema: tacticalBriefingPropsSchema,
  },
];


