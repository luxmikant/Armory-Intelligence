/**
 * @file catalog/page.tsx
 * @description Arsenal Nexus Weapon Catalog - Cinematic Dark Theme
 * 
 * Features:
 * - Browse Star Wars and Real World weapons
 * - Filter by universe, category
 * - Compare weapons across universes
 * - AI-powered search with Tambo
 */

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { ClientOnly } from "@/components/client-only";
import { EmbeddedChat } from "@/components/tambo/embedded-chat";
import { getAllWeapons, getComparisonPairsFull, type WeaponSeed } from "@/lib/weapons-data";
import { 
  Search, 
  Grid3X3, 
  List,
  Filter,
  Crosshair,
  Zap,
  ChevronDown,
  X,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

// ============================================
// WEAPON CARD COMPONENT
// ============================================
function WeaponCard({ weapon, onCompare }: { weapon: WeaponSeed; onCompare?: () => void }) {
  const isSciFi = weapon.universe === "star-wars";
  const accentColor = isSciFi ? "cyan" : "orange";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`
        group relative bg-[#181a24] rounded-xl border overflow-hidden
        transition-all duration-300 hover:scale-[1.02]
        ${isSciFi 
          ? "border-cyan-400/15 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]" 
          : "border-orange-500/15 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]"
        }
      `}
    >
      {/* Gradient accent top */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${
        isSciFi ? "via-cyan-400/40" : "via-orange-500/40"
      } to-transparent`} />

      {/* Weapon Image */}
      {weapon.imageUrl && (
        <div className="relative h-48 bg-[#12141c] overflow-hidden">
          <img 
            src={weapon.imageUrl} 
            alt={weapon.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181a24] via-transparent to-transparent" />
        </div>
      )}

      {/* Universe badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isSciFi 
            ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 backdrop-blur-sm" 
            : "bg-orange-500/10 text-orange-400 border border-orange-500/20 backdrop-blur-sm"
        }`}>
          {isSciFi ? <Zap className="w-3 h-3" /> : <Crosshair className="w-3 h-3" />}
          {isSciFi ? "Sci-Fi" : "Real"}
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <div className={`text-[10px] uppercase tracking-[0.2em] mb-1 ${
            isSciFi ? "text-cyan-400/70" : "text-orange-400/70"
          }`}>
            {weapon.category}
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">{weapon.name}</h3>
          <p className="text-slate-500 text-sm">{weapon.manufacturer}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#12141c] rounded-lg p-2.5">
            <div className="text-slate-500 text-[10px] uppercase tracking-wider">Damage</div>
            <div className="text-white font-bold">{weapon.damage_rating}</div>
            <div className={`h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${isSciFi ? "bg-cyan-400" : "bg-orange-500"}`}
                style={{ width: `${weapon.damage_rating}%` }}
              />
            </div>
          </div>
          <div className="bg-[#12141c] rounded-lg p-2.5">
            <div className="text-slate-500 text-[10px] uppercase tracking-wider">Range</div>
            <div className="text-white font-bold">{weapon.effective_range_m}m</div>
            <div className={`h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${isSciFi ? "bg-cyan-400" : "bg-orange-500"}`}
                style={{ width: `${Math.min(weapon.effective_range_m / 20, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {weapon.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{weapon.era}</span>
            <span>•</span>
            <span>{weapon.weight_kg}kg</span>
          </div>
          {weapon._equivalentKey && (
            <button
              onClick={onCompare}
              className={`text-xs font-medium transition-colors ${
                isSciFi ? "text-cyan-400 hover:text-cyan-300" : "text-orange-400 hover:text-orange-300"
              }`}
            >
              Compare →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// COMPARISON PAIR CARD
// ============================================
function ComparisonPairCard({ 
  sciFi, 
  real 
}: { 
  sciFi: WeaponSeed; 
  real: WeaponSeed;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#181a24] rounded-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="p-5">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Comparison Pair</span>
        </div>

        {/* Two weapons */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sci-Fi side */}
          <div className="text-center">
            {/* Sci-Fi weapon image */}
            {sciFi.imageUrl && (
              <div className="relative h-32 mb-3 bg-[#12141c] rounded-lg overflow-hidden">
                <img 
                  src={sciFi.imageUrl} 
                  alt={sciFi.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-cyan-400 text-xs font-semibold uppercase">Sci-Fi</span>
            </div>
            <h4 className="text-white font-bold text-sm mb-1">{sciFi.name}</h4>
            <p className="text-slate-500 text-xs mb-3">{sciFi.era}</p>
            {/* Stats */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>DMG</span>
                  <span>{sciFi.damage_rating}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${sciFi.damage_rating}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>TAC</span>
                  <span>{sciFi.tactical_score}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${sciFi.tactical_score}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Real side */}
          <div className="text-center">
            {/* Real weapon image */}
            {real.imageUrl && (
              <div className="relative h-32 mb-3 bg-[#12141c] rounded-lg overflow-hidden">
                <img 
                  src={real.imageUrl} 
                  alt={real.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-orange-400 text-xs font-semibold uppercase">Real</span>
            </div>
            <h4 className="text-white font-bold text-sm mb-1">{real.name}</h4>
            <p className="text-slate-500 text-xs mb-3">{real.era}</p>
            {/* Stats */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>DMG</span>
                  <span>{real.damage_rating}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${real.damage_rating}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>TAC</span>
                  <span>{real.tactical_score}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${real.tactical_score}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compare CTA */}
        <div className="mt-5 pt-4 border-t border-white/[0.04] text-center">
          <Link
            href={`/chat?compare=${encodeURIComponent(sciFi.name)}`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Full AI Analysis
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN CATALOG PAGE
// ============================================
export default function CatalogPage() {
  const allWeapons = getAllWeapons();
  const comparisonPairs = getComparisonPairsFull();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [universeFilter, setUniverseFilter] = useState<"all" | "star-wars" | "real">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [view, setView] = useState<"grid" | "comparisons">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allWeapons.map(w => w.category));
    return ["all", ...Array.from(cats)];
  }, [allWeapons]);

  // Filter weapons
  const filteredWeapons = useMemo(() => {
    return allWeapons.filter(weapon => {
      // Search
      if (searchQuery && !weapon.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !weapon.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !weapon.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Universe
      if (universeFilter !== "all" && weapon.universe !== universeFilter) {
        return false;
      }
      // Category
      if (categoryFilter !== "all" && weapon.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [allWeapons, searchQuery, universeFilter, categoryFilter]);

  // Group by universe for display
  const sciFiWeapons = filteredWeapons.filter(w => w.universe === "star-wars");
  const realWeapons = filteredWeapons.filter(w => w.universe === "real");

  // Page context for AI
  const pageContext = useMemo(() => ({
    page: "catalog",
    totalWeapons: allWeapons.length,
    displayedWeapons: filteredWeapons.length,
    sciFiCount: sciFiWeapons.length,
    realCount: realWeapons.length,
    activeFilters: { universe: universeFilter, category: categoryFilter, search: searchQuery },
  }), [allWeapons.length, filteredWeapons.length, sciFiWeapons.length, realWeapons.length, universeFilter, categoryFilter, searchQuery]);

  return (
    <ClientOnly>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
      >
        <div className="min-h-screen bg-[#030305]">
          {/* Header */}
          <header className="border-b border-white/[0.04] bg-[#08090d]/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <span className="text-sm font-black text-white">AN</span>
                  </div>
                  <span className="font-bold text-white">Catalog</span>
                </Link>
                
                <Link 
                  href="/chat"
                  className="flex items-center gap-2 px-4 py-2 bg-[#12141c] text-slate-300 rounded-lg border border-white/[0.06] hover:border-cyan-400/30 transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Chat
                </Link>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-6 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <motion.h1 
                className="text-4xl md:text-5xl font-black text-white mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Weapon <span className="text-gradient-real">Catalog</span>
              </motion.h1>
              <motion.p 
                className="text-slate-400 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {allWeapons.length} weapons across two universes. Compare, analyze, learn.
              </motion.p>
            </div>

            {/* Search & Filters Bar */}
            <motion.div 
              className="mb-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search weapons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#12141c] border border-white/[0.06] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/30"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-colors ${
                    showFilters 
                      ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
                      : "bg-[#12141c] border-white/[0.06] text-slate-400 hover:text-white"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-[#12141c] rounded-xl border border-white/[0.06]">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Universe filter */}
                        <div>
                          <label className="text-slate-400 text-sm block mb-2">Universe</label>
                          <div className="flex gap-2">
                            {[
                              { value: "all", label: "All" },
                              { value: "star-wars", label: "Sci-Fi", color: "cyan" },
                              { value: "real", label: "Real", color: "orange" },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setUniverseFilter(opt.value as typeof universeFilter)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                  universeFilter === opt.value
                                    ? opt.color === "cyan"
                                      ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30"
                                      : opt.color === "orange"
                                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                                      : "bg-white/10 text-white border border-white/20"
                                    : "bg-[#181a24] text-slate-500 border border-white/[0.04] hover:text-white"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Category filter */}
                        <div>
                          <label className="text-slate-400 text-sm block mb-2">Category</label>
                          <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full py-2 px-3 bg-[#181a24] border border-white/[0.06] rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/30"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* View toggle */}
                        <div>
                          <label className="text-slate-400 text-sm block mb-2">View</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setView("grid")}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                view === "grid"
                                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                                  : "bg-[#181a24] text-slate-500 border border-white/[0.04] hover:text-white"
                              }`}
                            >
                              <Grid3X3 className="w-4 h-4" />
                              Grid
                            </button>
                            <button
                              onClick={() => setView("comparisons")}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                view === "comparisons"
                                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30"
                                  : "bg-[#181a24] text-slate-500 border border-white/[0.04] hover:text-white"
                              }`}
                            >
                              <List className="w-4 h-4" />
                              Pairs
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">
                Showing <span className="text-white font-semibold">{filteredWeapons.length}</span> weapons
                {universeFilter !== "all" && (
                  <span className={universeFilter === "star-wars" ? "text-cyan-400" : "text-orange-400"}>
                    {" "}({universeFilter === "star-wars" ? "Sci-Fi" : "Real World"})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  {sciFiWeapons.length} Sci-Fi
                </span>
                <span className="flex items-center gap-1.5 text-orange-400">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  {realWeapons.length} Real
                </span>
              </div>
            </div>

            {/* Content */}
            {view === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredWeapons.map((weapon) => (
                    <WeaponCard key={weapon.name} weapon={weapon} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonPairs.map((pair) => (
                  <ComparisonPairCard 
                    key={pair.sciFi.name} 
                    sciFi={pair.sciFi} 
                    real={pair.real} 
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredWeapons.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-[#12141c] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">No weapons found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setUniverseFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="px-6 py-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>

          {/* Embedded Chat */}
          <div className="fixed bottom-6 right-6 z-50">
            <EmbeddedChat 
              pageName="catalog"
              title="Weapons Expert"
              pageContext={pageContext}
              suggestions={[
                { id: "compare", title: "Compare weapons", detailedSuggestion: "Compare the E-11 to the M4A1", messageId: "compare" },
                { id: "recommend", title: "Get recommendation", detailedSuggestion: "What's the best sci-fi sidearm?", messageId: "recommend" },
              ]}
            />
          </div>
        </div>
      </TamboProvider>
    </ClientOnly>
  );
}
