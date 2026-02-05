/**
 * @file [state]/route.ts
 * @description GET /api/regulations/:state - Fetch regulations for a specific state
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { state: string } }
) {
  try {
    const stateCode = params.state.toUpperCase();

    if (!stateCode || stateCode.length !== 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid state code. Use two-letter state code (e.g., CA, TX)",
        },
        { status: 400 }
      );
    }

    // Fetch regulations for the state
    const regulations = await prisma.legalRegulation.findMany({
      where: {
        state: stateCode,
      },
    });

    // Fetch CCW reciprocity info if applicable
    const ccwInfo = await prisma.cCWReciprocity.findFirst({
      where: {
        homeStateCode: stateCode,
      },
    });

    if (regulations.length === 0 && !ccwInfo) {
      return NextResponse.json(
        {
          success: false,
          error: `No regulations found for state: ${stateCode}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        state: stateCode,
        regulations,
        ccwReciprocity: ccwInfo || null,
      },
    });
  } catch (error) {
    console.error("Error fetching regulations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch regulations",
      },
      { status: 500 }
    );
  }
}
