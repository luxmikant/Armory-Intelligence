/**
 * @file [id]/route.ts
 * @description GET /api/firearms/:id - Fetch single firearm by ID
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    const firearm = await prisma.firearm.findUnique({
      where: { id: firearmId },
      include: {
        ballistics: true,
        maintenanceGuides: true,
      },
    });

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
