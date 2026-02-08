/**
 * @file index.ts
 * @description Export all Armory Intelligence components
 */

// Core Components
export { FirearmCard, firearmCardSchema, firearmCardStateSchema } from "./firearm-card";
export type { FirearmCardProps } from "./firearm-card";

export { SafetyWarning, safetyWarningSchema } from "./safety-warning";
export type { SafetyWarningProps } from "./safety-warning";

export { ComparisonTable, comparisonTablePropsSchema, comparisonTablePropsSchema as comparisonTableSchema, comparisonTableStateSchema } from "./comparison-table";
export type { ComparisonTableProps } from "./comparison-table";

export { InteractiveChecklist, interactiveChecklistSchema, interactiveChecklistPropsSchema, interactiveChecklistStateSchema } from "./interactive-checklist";
export type { InteractiveChecklistProps } from "./interactive-checklist";

export { BallisticsChart, ballisticsChartSchema, ballisticsChartPropsSchema, ballisticsChartStateSchema } from "./ballistics-chart";
export type { BallisticsChartProps } from "./ballistics-chart";

export { FilterPanel, filterPanelSchema, filterPanelPropsSchema, filterPanelStateSchema } from "./filter-panel";
export type { FilterPanelProps } from "./filter-panel";

export { RegulationCard, regulationCardSchema } from "./regulation-card";
export type { RegulationCardProps } from "./regulation-card";

export { StepGuide, stepGuideSchema } from "./step-guide";
export type { StepGuideProps } from "./step-guide";

// Arsenal Nexus - Star Wars × Modern Military Components
export { HologramCard, hologramCardPropsSchema, hologramCardSchema, hologramCardStateSchema } from "./hologram-card";
export type { HologramCardProps } from "./hologram-card";

export { WeaponShowdown, weaponShowdownPropsSchema, weaponShowdownSchema, weaponShowdownStateSchema } from "./weapon-showdown";
export type { WeaponShowdownProps } from "./weapon-showdown";

export { TacticalBriefing, tacticalBriefingPropsSchema, tacticalBriefingSchema, tacticalBriefingStateSchema } from "./tactical-briefing";
export type { TacticalBriefingProps } from "./tactical-briefing";
