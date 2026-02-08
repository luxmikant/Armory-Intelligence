/**
 * @file api/weapons/seed/route.ts
 * @description API route to seed the Supabase database with Arsenal Nexus weapons data
 * 
 * POST /api/weapons/seed — Seeds all weapons into Supabase
 * GET /api/weapons/seed — Returns current weapon count
 */

import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getAllWeapons } from "@/lib/weapons-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: false,
      error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
      localWeaponsCount: getAllWeapons().length,
    });
  }

  const { count, error } = await supabase
    .from("weapons")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    success: true,
    supabaseWeaponsCount: count ?? 0,
    localWeaponsCount: getAllWeapons().length,
    needsSeed: (count ?? 0) === 0,
  });
}

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase is not configured" },
      { status: 400 }
    );
  }

  const allWeapons = getAllWeapons();

  // Map local data to Supabase schema
  const rows = allWeapons.map((w) => ({
    name: w.name,
    universe: w.universe,
    category: w.category,
    manufacturer: w.manufacturer,
    era: w.era,
    description: w.description,
    image_url: w.image_url,
    weight_kg: w.weight_kg,
    effective_range_m: w.effective_range_m,
    rate_of_fire: w.rate_of_fire,
    damage_rating: w.damage_rating,
    caliber: w.caliber,
    muzzle_velocity_ms: w.muzzle_velocity_ms,
    capacity: w.capacity,
    price_usd: w.price_usd,
    action_type: w.action_type,
    energy_output_kj: w.energy_output_kj,
    plasma_temperature_k: w.plasma_temperature_k,
    kyber_crystal_type: w.kyber_crystal_type,
    stun_setting: w.stun_setting,
    ammo_type: w.ammo_type,
    tactical_score: w.tactical_score,
    coolness_factor: w.coolness_factor,
    community_rating: w.community_rating,
    total_votes: w.total_votes,
    comparison_notes: w.comparison_notes,
  }));

  const { data, error } = await supabase
    .from("weapons")
    .upsert(rows as any, { onConflict: "name" })
    .select();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    seeded: data?.length ?? 0,
    weapons: (data ?? []).map((w: { name: string; universe: string }) => `${w.universe}: ${w.name}`),
  });
}
