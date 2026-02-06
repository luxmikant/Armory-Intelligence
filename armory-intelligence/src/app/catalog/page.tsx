"use client";

/**
 * @file catalog/page.tsx
 * @description Firearms catalog page with filtering, search, and embedded AI chat
 */

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FirearmCard } from "@/components/armory/firearm-card";
import { FilterPanel } from "@/components/armory/filter-panel";
import { EmbeddedChat } from "@/components/tambo/embedded-chat";
import { PageContextHelper } from "@/components/tambo/page-context-helper";
import { PageHeader } from "@/components/armory/page-header";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { ClientOnly } from "@/components/client-only";
import { Search, Grid3X3, List, Loader2 } from "lucide-react";

interface Firearm {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  action: string;
  caliber: string;
  capacity: number;
  weight: number;
  barrelLength: number;
  price?: number;
  description?: string;
  safetyFeatures?: string[];
  imageUrl?: string;
}

export default function CatalogPage() {
  const [firearms, setFirearms] = useState<Firearm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    types: [] as string[],
    calibers: [] as string[],
    priceRange: [0, 5000] as [number, number],
    sortBy: "name-asc" as string,
  });

  useEffect(() => {
    fetchFirearms();
  }, [filters]);

  const fetchFirearms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.types.length) params.append("types", filters.types.join(","));
      if (filters.calibers.length) params.append("calibers", filters.calibers.join(","));
      params.append("minPrice", String(filters.priceRange[0]));
      params.append("maxPrice", String(filters.priceRange[1]));
      params.append("sortBy", filters.sortBy);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/firearms?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setFirearms(data.data);
      } else {
        setError(data.error || "Failed to fetch firearms");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFirearms();
  };

  const filteredFirearms = firearms.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Context for AI - knows what's happening on the page
  const pageContext = useMemo(() => ({
    page: "catalog",
    totalFirearms: firearms.length,
    displayedFirearms: filteredFirearms.length,
    activeFilters: filters,
    searchQuery,
    view,
  }), [firearms.length, filteredFirearms.length, filters, searchQuery, view]);

  // Catalog-specific AI suggestions
  const catalogSuggestions = useMemo(() => [
    {
      id: "catalog-search",
      title: "Find a firearm",
      detailedSuggestion: "Help me find a 9mm handgun under $600",
      messageId: "search-query",
    },
    {
      id: "catalog-compare",
      title: "Compare firearms",
      detailedSuggestion: "Compare the Glock 19 and Sig P320",
      messageId: "compare-query",
    },
    {
      id: "catalog-recommend",
      title: "Get a recommendation",
      detailedSuggestion: "What's a good first handgun for home defense?",
      messageId: "recommend-query",
    },
  ], []);

  return (
    <ClientOnly>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
      >
        <PageContextHelper 
          contextKey="catalogPage"
          context={pageContext}
        />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <PageHeader pageName="Catalog" accentColor="text-orange-400" />

          <div className="container mx-auto px-6 py-8">
        {/* Page Title and Search */}
        <div className="mb-8">
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Firearms Catalog
          </motion.h1>
          <motion.p 
            className="text-slate-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Browse our comprehensive database of firearms with detailed specifications
          </motion.p>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, manufacturer, or caliber..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                availableTypes={["handgun", "rifle", "shotgun"]}
                availableCalibers={["9mm", ".45 ACP", "5.56 NATO", "12 Gauge", ".308 Winchester", ".22 LR"]}
                priceRange={{ min: 0, max: 5000 }}
                onApplyFilters={(newFilters: { types: string[]; calibers: string[]; priceRange: { min: number; max: number }; sortBy: string }) => setFilters({ ...filters, ...newFilters, priceRange: [newFilters.priceRange.min, newFilters.priceRange.max] })}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400">
                {loading ? "Loading..." : `${filteredFirearms.length} firearms found`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    view === "grid" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    view === "list" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchFirearms}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Firearms Grid/List */}
            {!loading && !error && (
              <motion.div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredFirearms.map((firearm, index) => (
                  <motion.div
                    key={firearm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FirearmCard
                      name={firearm.name}
                      manufacturer={firearm.manufacturer}
                      type={firearm.type as "handgun" | "rifle" | "shotgun"}
                      action={firearm.action || "semi-auto"}
                      caliber={firearm.caliber}
                      capacity={firearm.capacity}
                      weight={firearm.weight}
                      barrelLength={firearm.barrelLength}
                      price={firearm.price}
                      description={firearm.description}
                      safetyFeatures={firearm.safetyFeatures}
                      imageUrl={firearm.imageUrl}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredFirearms.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 mb-4">No firearms match your filters</p>
                <button
                  onClick={() => {
                    setFilters({
                      types: [],
                      calibers: [],
                      priceRange: [0, 5000],
                      sortBy: "name-asc",
                    });
                    setSearchQuery("");
                  }}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Embedded AI Chat */}
      <EmbeddedChat
        pageName="catalog"
        suggestions={catalogSuggestions}
        pageContext={pageContext}
        title="Catalog Assistant"
      />
        </div>
      </TamboProvider>
    </ClientOnly>
  );
}
