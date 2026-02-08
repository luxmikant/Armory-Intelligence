/**
 * @file [state]/route.ts
 * @description GET /api/regulations/:state - Fetch regulations for a specific state
 */

import { NextRequest, NextResponse } from "next/server";

// Skip static generation for this dynamic route
export const dynamic = 'force-dynamic';

// Mock state regulations
const MOCK_REGULATIONS: Record<string, any> = {
  CA: {
    state: "CA",
    permitRequired: true,
    permitType: "Carry License (May-Issue)",
    openCarry: "prohibited",
    concealedCarry: "may-issue",
    waitingPeriod: 10,
    backgroundCheck: true,
    registrationRequired: true,
    assaultWeaponBan: true,
    magazineCapacityLimit: 10,
    redFlagLaw: true,
    reciprocalStates: [],
    disclaimer: "California has some of the strictest firearm regulations in the US",
  },
  TX: {
    state: "TX",
    permitRequired: true,
    permitType: "License to Carry",
    openCarry: "allowed",
    concealedCarry: "shall-issue",
    waitingPeriod: 0,
    backgroundCheck: true,
    registrationRequired: false,
    assaultWeaponBan: false,
    magazineCapacityLimit: null,
    redFlagLaw: false,
    reciprocalStates: ["AK", "AZ", "AR", "CO", "DE", "FL", "GA", "ID", "IN", "IA", "KS", "KY", "LA", "ME", "MS", "MO", "MT", "NE", "NV", "NH", "NM", "NC", "ND", "OH", "OK", "PA", "SC", "SD", "TN", "UT", "VT", "VA", "WA", "WV", "WI", "WY"],
    disclaimer: "Texas has shall-issue concealed carry licensing",
  },
  FL: {
    state: "FL",
    permitRequired: true,
    permitType: "License to Carry",
    openCarry: "restricted",
    concealedCarry: "shall-issue",
    waitingPeriod: 3,
    backgroundCheck: true,
    registrationRequired: false,
    assaultWeaponBan: false,
    magazineCapacityLimit: null,
    redFlagLaw: true,
    reciprocalStates: ["Most states"],
    disclaimer: "Florida recognizes concealed carry permits and has reciprocity with many states",
  },
  NY: {
    state: "NY",
    permitRequired: true,
    permitType: "Carry License (May-Issue)",
    openCarry: "prohibited",
    concealedCarry: "may-issue",
    waitingPeriod: 0,
    backgroundCheck: true,
    registrationRequired: true,
    assaultWeaponBan: true,
    magazineCapacityLimit: 10,
    redFlagLaw: true,
    reciprocalStates: [],
    disclaimer: "New York has strict gun regulations, particularly in NYC",
  },
};

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

    const regulations = MOCK_REGULATIONS[stateCode];

    if (!regulations) {
      // Return generic regulation for unmapped states
      return NextResponse.json({
        success: true,
        data: {
          state: stateCode,
          permitRequired: true,
          permitType: "Check state website",
          openCarry: "Check state website",
          concealedCarry: "Check state website",
          waitingPeriod: null,
          backgroundCheck: true,
          registrationRequired: null,
          assaultWeaponBan: null,
          magazineCapacityLimit: null,
          redFlagLaw: null,
          reciprocalStates: [],
          disclaimer: "Regulations not fully documented. Please verify with your state's official resources.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: regulations,
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
