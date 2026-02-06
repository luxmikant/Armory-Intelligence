/**
 * @file route.ts
 * @description GET /api/firearms - Fetch all firearms with optional filtering
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Skip static generation for this route (requires database at runtime)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const types = searchParams.get("types")?.split(",") || [];
    const calibers = searchParams.get("calibers")?.split(",") || [];
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const sortBy = searchParams.get("sortBy") || "name";
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 50;
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 0;
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: any = {};

    // Text search across name, manufacturer, caliber, description
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { manufacturer: { contains: search } },
        { caliber: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (types.length > 0 && types[0] !== "") {
      where.type = { in: types };
    }

    if (calibers.length > 0 && calibers[0] !== "") {
      where.caliber = { in: calibers };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build order by
    let orderBy: any = { name: "asc" };
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popularity":
        orderBy = { popularity: "desc" };
        break;
      case "name":
      default:
        orderBy = { name: "asc" };
    }

    // Fetch firearms
    const firearms = await prisma.firearm.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        manufacturer: true,
        type: true,
        action: true,
        caliber: true,
        capacity: true,
        weight: true,
        barrelLength: true,
        price: true,
        imageUrl: true,
        safetyFeatures: true,
        description: true,
        createdAt: true,
      },
    });

    // Get total count
    const total = await prisma.firearm.count({ where });

    return NextResponse.json({
      success: true,
      data: firearms,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching firearms:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch firearms",
      },
      { status: 500 }
    );
  }
}
