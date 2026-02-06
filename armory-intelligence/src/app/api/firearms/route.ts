/**
 * @file route.ts
 * @description GET /api/firearms - Fetch all firearms with optional filtering
 */

import { NextRequest, NextResponse } from "next/server";

// Skip static generation for this route
export const dynamic = 'force-dynamic';

// Mock firearms data for MVP
const MOCK_FIREARMS = [
  {
    id: "1",
    name: "Glock 19",
    manufacturer: "Glock",
    type: "handgun",
    action: "semi-auto",
    caliber: "9mm",
    capacity: 15,
    weight: 25.06,
    barrelLength: 4.02,
    price: 599,
    imageUrl: "https://images.unsplash.com/photo-1578926314433-8e697ef4e4c9?w=400",
    safetyFeatures: ["Passive safety", "Trigger safety", "Drop safety"],
    description: "Popular 9mm semi-automatic pistol",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Sig Sauer P320",
    manufacturer: "Sig Sauer",
    type: "handgun",
    action: "semi-auto",
    caliber: ".45 ACP",
    capacity: 12,
    weight: 29.3,
    barrelLength: 4.7,
    price: 749,
    imageUrl: "https://images.unsplash.com/photo-1599846814455-e3f0a0c37f7a?w=400",
    safetyFeatures: ["Manual safety", "Trigger safety", "De-cocking lever"],
    description: "Premium service pistol with modular design",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Ruger 10/22",
    manufacturer: "Ruger",
    type: "rifle",
    action: "semi-auto",
    caliber: ".22 LR",
    capacity: 10,
    weight: 37.25,
    barrelLength: 18.5,
    price: 449,
    imageUrl: "https://images.unsplash.com/photo-1599846814229-f77d92036b46?w=400",
    safetyFeatures: ["Manual safety", "Bolt hold-open"],
    description: "Popular .22 rifle for training and plinking",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "AR-15",
    manufacturer: "Bushmaster",
    type: "rifle",
    action: "semi-auto",
    caliber: "5.56 NATO",
    capacity: 30,
    weight: 84.0,
    barrelLength: 16.0,
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1599846813839-74ba7ac71ac3?w=400",
    safetyFeatures: ["Manual safety selector", "Fire control group"],
    description: "Modern tactical rifle platform",
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Mossberg 500",
    manufacturer: "Mossberg",
    type: "shotgun",
    action: "pump",
    caliber: "12 Gauge",
    capacity: 5,
    weight: 125.0,
    barrelLength: 18.5,
    price: 579,
    imageUrl: "https://images.unsplash.com/photo-1599846814229-f77d92036b46?w=400",
    safetyFeatures: ["Cross-bolt safety", "Quiet carry handle"],
    description: "Reliable pump-action shotgun for home defense",
    createdAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
    const calibers = searchParams.get("calibers")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : Infinity;
    const sortBy = searchParams.get("sortBy") || "name";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;
    const search = searchParams.get("search")?.toLowerCase() || "";

    // Filter mock data
    let filtered = MOCK_FIREARMS.filter((firearm) => {
      // Text search
      if (search && !firearm.name.toLowerCase().includes(search) && 
          !firearm.manufacturer.toLowerCase().includes(search) &&
          !firearm.caliber.toLowerCase().includes(search) &&
          !(firearm.description || "").toLowerCase().includes(search)) {
        return false;
      }

      // Type filter
      if (types.length > 0 && !types.includes(firearm.type)) {
        return false;
      }

      // Caliber filter
      if (calibers.length > 0 && !calibers.includes(firearm.caliber)) {
        return false;
      }

      // Price filter
      if ((firearm.price || 0) < minPrice || (firearm.price || 0) > maxPrice) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Paginate
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        limit,
        offset,
        hasMore: offset + limit < filtered.length,
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
