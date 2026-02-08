/**
 * @file api/weapons/route.ts
 * @description API route for Arsenal Nexus weapons queries
 * 
 * GET /api/weapons?universe=star-wars&category=rifle&search=E-11&sort=damage_rating&limit=10
 */

import { NextRequest, NextResponse } from "next/server";
import { getWeapons, type WeaponFilters } from "@/lib/weapons-service";
import type { WeaponUniverse, WeaponCategory } from "@/lib/database.types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: WeaponFilters = {};
  
  const universe = searchParams.get("universe");
  if (universe === "real" || universe === "star-wars") {
    filters.universe = universe as WeaponUniverse;
  }
  
  const category = searchParams.get("category");
  if (category) {
    filters.category = category as WeaponCategory;
  }
  
  const search = searchParams.get("search");
  if (search) filters.search = search;
  
  const sortBy = searchParams.get("sort");
  if (sortBy === "damage_rating" || sortBy === "coolness_factor" || sortBy === "tactical_score" || sortBy === "community_rating" || sortBy === "name") {
    filters.sortBy = sortBy;
  }
  
  const limit = searchParams.get("limit");
  if (limit) filters.limit = parseInt(limit, 10);

  filters.sortOrder = "desc";

  const weapons = await getWeapons(filters);

  return NextResponse.json({
    success: true,
    count: weapons.length,
    weapons,
  });
}
