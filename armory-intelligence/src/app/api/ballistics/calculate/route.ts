/**
 * @file route.ts
 * @description POST /api/ballistics/calculate - Calculate ballistics data
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const BallisticsRequestSchema = z.object({
  firearmId: z.string().optional(),
  bulletWeight: z.number().min(1).max(1000).optional(),
  muzzleVelocity: z.number().min(100).max(5000).optional(),
  ballisticCoefficient: z.number().min(0.01).max(1.0).optional(),
  distance: z.number().min(0).max(2000),
  windSpeed: z.number().default(0),
  windDirection: z.enum(["0", "45", "90", "135", "180", "225", "270", "315"]).optional(),
  temperature: z.number().default(59),
  humidity: z.number().min(0).max(100).default(50),
  barometricPressure: z.number().default(29.92),
});

type BallisticsRequest = z.infer<typeof BallisticsRequestSchema>;

/**
 * Enhanced ballistic calculator using simplified drag model
 * Accounts for bullet weight, muzzle velocity, BC, and environmental factors
 */
function calculateBallistics(params: BallisticsRequest) {
  const { 
    distance, windSpeed, temperature, humidity, barometricPressure,
    bulletWeight: bw, muzzleVelocity: mv, ballisticCoefficient: bc
  } = params;

  const bulletWeight = bw ?? 147;      // grains
  const muzzleVelocity = mv ?? 900;    // fps
  const ballisticCoeff = bc ?? 0.168;   // G1 BC

  const gravity = 386.09; // in/s²

  // Air density correction factor
  const stdTemp = 59; // °F
  const stdPressure = 29.92; // inHg
  const tempFactor = (stdTemp + 459.67) / (temperature + 459.67);
  const pressureFactor = barometricPressure / stdPressure;
  const humidityFactor = 1 - (humidity * 0.0002);
  const airDensityRatio = pressureFactor * tempFactor * humidityFactor;

  // Adjusted BC for air density
  const adjBC = ballisticCoeff / airDensityRatio;

  // Calculate velocity at distance using Siacci method (simplified)
  const retardCoeff = 1 / (adjBC * 1000);
  const velocityAtDist = muzzleVelocity / (1 + retardCoeff * distance);

  // Time of flight (average velocity method)
  const avgVelocity = (muzzleVelocity + velocityAtDist) / 2;
  const distanceFeet = distance * 3; // yards to feet
  const timeOfFlight = distanceFeet / avgVelocity;

  // Bullet drop
  const dropInches = 0.5 * gravity * Math.pow(timeOfFlight, 2);

  // Wind drift calculation
  const windAngle = 90; // degrees, crosswind
  const windComponent = windSpeed * Math.sin((windAngle * Math.PI) / 180);
  const lagTime = timeOfFlight - (distanceFeet / muzzleVelocity);
  const windDriftInches = windComponent * lagTime * 17.6; // 17.6 in/s per mph

  // Kinetic energy (ft-lbs)
  const energyAtMuzzle = (bulletWeight * Math.pow(muzzleVelocity, 2)) / 450240;
  const energyAtDistance = (bulletWeight * Math.pow(velocityAtDist, 2)) / 450240;

  // Velocity retention percentage
  const velocityRetention = (velocityAtDist / muzzleVelocity) * 100;

  return {
    distance,
    dropInches: Math.round(dropInches * 100) / 100,
    windDriftInches: Math.round(Math.abs(windDriftInches) * 100) / 100,
    timeOfFlight: Math.round(timeOfFlight * 1000) / 1000,
    velocityAtDistance: Math.round(velocityAtDist),
    energyAtMuzzle: Math.round(energyAtMuzzle),
    energyAtDistance: Math.round(energyAtDistance),
    velocityRetention: Math.round(velocityRetention),
    bulletWeight,
    muzzleVelocity,
    ballisticCoefficient: ballisticCoeff,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validatedData = BallisticsRequestSchema.parse(body);

    // Calculate ballistics
    const result = calculateBallistics(validatedData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request parameters",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error calculating ballistics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate ballistics",
      },
      { status: 500 }
    );
  }
}

