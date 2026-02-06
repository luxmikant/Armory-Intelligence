/**
 * @file [id]/route.ts
 * @description GET /api/firearms/:id - Fetch single firearm by ID
 */

import { NextRequest, NextResponse } from "next/server";

// Skip static generation for this dynamic route
export const dynamic = 'force-dynamic';

// Mock data
const MOCK_FIREARMS: Record<string, any> = {
  "1": {
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
    description: "Popular 9mm semi-automatic pistol. Perfect for beginners.",
    ballistics: [],
    maintenanceGuides: [],
  },
  "2": {
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
    ballistics: [],
    maintenanceGuides: [],
  },
  "3": {
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
    ballistics: [],
    maintenanceGuides: [],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firearmId = params.id;

    if (!firearmId) {
      return NextResponse.json(
        {
          success: false,
          error: "Firearm ID is required",
        },
        { status: 400 }
      );
    }

    const firearm = MOCK_FIREARMS[firearmId];

    if (!firearm) {
      return NextResponse.json(
        {
          success: false,
          error: "Firearm not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: firearm,
    });
  } catch (error) {
    console.error("Error fetching firearm:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch firearm",
      },
      { status: 500 }
    );
  }
}
