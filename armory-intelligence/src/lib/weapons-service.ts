/**
 * @file weapons-service.ts
 * @description Data service for Arsenal Nexus weapons
 * 
 * Provides functions to query weapons from Supabase (real-time)
 * with fallback to local data when Supabase is not configured.
 * 
 * This dual-mode ensures the app works both:
 * - With Supabase configured (real-time, persistent)
 * - Without Supabase (demo mode with local data)
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import { getAllWeapons, getComparisonPairs } from "./weapons-data";
import type { Weapon, WeaponUniverse, WeaponCategory } from "./database.types";

// ============================================
// QUERY FUNCTIONS
// ============================================

export interface WeaponFilters {
  universe?: WeaponUniverse;
  category?: WeaponCategory;
  search?: string;
  minDamage?: number;
  maxDamage?: number;
  sortBy?: "name" | "damage_rating" | "coolness_factor" | "community_rating" | "tactical_score";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

/**
 * Fetch weapons with optional filters
 */
export async function getWeapons(filters: WeaponFilters = {}): Promise<Weapon[]> {
  if (!isSupabaseConfigured()) {
    return getLocalWeapons(filters);
  }

  try {
    let query = supabase.from("weapons").select("*");

    if (filters.universe) query = query.eq("universe", filters.universe);
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.search) query = query.ilike("name", `%${filters.search}%`);
    if (filters.minDamage) query = query.gte("damage_rating", filters.minDamage);
    if (filters.maxDamage) query = query.lte("damage_rating", filters.maxDamage);
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" });
    }
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;
    return (data as Weapon[]) ?? [];
  } catch {
    return getLocalWeapons(filters);
  }
}

/**
 * Get a single weapon by ID or name
 */
export async function getWeaponByName(name: string): Promise<Weapon | null> {
  if (!isSupabaseConfigured()) {
    const all = getAllWeapons();
    const found = all.find(w => w.name.toLowerCase().includes(name.toLowerCase()));
    return found ? localToWeapon(found) : null;
  }

  try {
    const { data } = await supabase
      .from("weapons")
      .select("*")
      .ilike("name", `%${name}%`)
      .limit(1)
      .single();
    return data as Weapon | null;
  } catch {
    return null;
  }
}

/**
 * Get comparison pairs (sci-fi weapon + real-world equivalent)
 */
export async function getComparisonData(sciFiName?: string): Promise<{
  sciFi: Weapon;
  real: Weapon;
  analysis: ComparisonAnalysis;
}[]> {
  const pairs = getComparisonPairs();
  const allWeapons = getAllWeapons();
  
  const results = [];
  for (const pair of pairs) {
    if (sciFiName && !pair.sciFiName.toLowerCase().includes(sciFiName.toLowerCase())) {
      continue;
    }
    
    const sciFi = allWeapons.find(w => w._matchKey === pair.sciFiKey);
    const real = allWeapons.find(w => w._matchKey === pair.realKey);
    
    if (sciFi && real) {
      results.push({
        sciFi: localToWeapon(sciFi),
        real: localToWeapon(real),
        analysis: generateAnalysis(localToWeapon(sciFi), localToWeapon(real)),
      });
    }
  }
  
  return results;
}

/**
 * Rate a weapon (real-time updates)
 */
export async function rateWeapon(weaponId: string, rating: number, comment?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from("weapon_ratings").insert({
      weapon_id: weaponId,
      user_id: "anonymous",
      rating,
      comment,
    } as any);
    
    if (error) throw error;

    // Update average rating on weapon
    const { data: ratings } = await supabase
      .from("weapon_ratings")
      .select("rating")
      .eq("weapon_id", weaponId);

    if (ratings && ratings.length > 0) {
      const avg = ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length;
      await (supabase
        .from("weapons") as any)
        .update({ community_rating: avg, total_votes: ratings.length })
        .eq("id", weaponId);
    }

    return true;
  } catch {
    return false;
  }
}

// ============================================
// COMPARISON ANALYSIS
// ============================================

export interface ComparisonAnalysis {
  rangeAdvantage: string;
  damageAdvantage: string;
  mobilityAdvantage: string;
  overallWinner: string;
  funFact: string;
  physicsNote: string;
  tacticalVerdict: string;
}

function generateAnalysis(sciFi: Weapon, real: Weapon): ComparisonAnalysis {
  const rangeWinner = sciFi.effective_range_m > real.effective_range_m ? sciFi.name : real.name;
  const damageWinner = sciFi.damage_rating > real.damage_rating ? sciFi.name : real.name;
  const mobilityWinner = sciFi.weight_kg < real.weight_kg ? sciFi.name : real.name;

  const boltSpeed = 130; // m/s approximate for blaster bolts
  const bulletSpeed = real.muzzle_velocity_ms ?? 900;

  return {
    rangeAdvantage: `${rangeWinner} wins with ${Math.max(sciFi.effective_range_m, real.effective_range_m)}m effective range`,
    damageAdvantage: `${damageWinner} deals more damage (rating: ${Math.max(sciFi.damage_rating, real.damage_rating)}/100)`,
    mobilityAdvantage: `${mobilityWinner} is lighter at ${Math.min(sciFi.weight_kg, real.weight_kg)}kg`,
    overallWinner: sciFi.tactical_score > real.tactical_score ? sciFi.name : real.name,
    funFact: `Blaster bolts travel at ~${boltSpeed} m/s while ${real.caliber || "bullets"} travel at ${bulletSpeed} m/s — ${(bulletSpeed / boltSpeed).toFixed(1)}x faster! You could literally see a blaster bolt coming and dodge it if you were fast enough.`,
    physicsNote: sciFi.plasma_temperature_k 
      ? `${sciFi.name} plasma reaches ${sciFi.plasma_temperature_k?.toLocaleString()}K — that's ${(sciFi.plasma_temperature_k / 5778).toFixed(1)}x hotter than the surface of the Sun!`
      : `${sciFi.name} operates on fictional physics that would violate thermodynamics in our universe.`,
    tacticalVerdict: sciFi.tactical_score >= real.tactical_score
      ? `In a fair fight, ${sciFi.name} would win on paper. But factor in bullet velocity advantage, and the real weapon likely wins at range.`
      : `${real.name} wins on pure tactics. Modern engineering beats mass-produced Imperial designs.`,
  };
}

// ============================================
// LOCAL DATA FALLBACK
// ============================================

function localToWeapon(seed: ReturnType<typeof getAllWeapons>[0]): Weapon {
  return {
    id: seed._matchKey,
    name: seed.name,
    universe: seed.universe as WeaponUniverse,
    category: seed.category as WeaponCategory,
    manufacturer: seed.manufacturer,
    era: seed.era,
    description: seed.description,
    image_url: seed.image_url,
    weight_kg: seed.weight_kg,
    effective_range_m: seed.effective_range_m,
    rate_of_fire: seed.rate_of_fire,
    damage_rating: seed.damage_rating,
    caliber: seed.caliber,
    muzzle_velocity_ms: seed.muzzle_velocity_ms,
    capacity: seed.capacity,
    price_usd: seed.price_usd,
    action_type: seed.action_type,
    energy_output_kj: seed.energy_output_kj,
    plasma_temperature_k: seed.plasma_temperature_k,
    kyber_crystal_type: seed.kyber_crystal_type,
    stun_setting: seed.stun_setting,
    ammo_type: seed.ammo_type,
    tactical_score: seed.tactical_score,
    coolness_factor: seed.coolness_factor,
    community_rating: seed.community_rating,
    total_votes: seed.total_votes,
    comparison_notes: seed.comparison_notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function getLocalWeapons(filters: WeaponFilters): Weapon[] {
  let weapons = getAllWeapons().map(localToWeapon);

  if (filters.universe) weapons = weapons.filter(w => w.universe === filters.universe);
  if (filters.category) weapons = weapons.filter(w => w.category === filters.category);
  if (filters.search) weapons = weapons.filter(w => w.name.toLowerCase().includes(filters.search!.toLowerCase()));
  if (filters.minDamage) weapons = weapons.filter(w => w.damage_rating >= filters.minDamage!);
  if (filters.sortBy) {
    weapons.sort((a, b) => {
      const aVal = a[filters.sortBy!] as number;
      const bVal = b[filters.sortBy!] as number;
      return filters.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }
  if (filters.limit) weapons = weapons.slice(0, filters.limit);

  return weapons;
}
