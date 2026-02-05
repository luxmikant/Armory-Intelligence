/**
 * @file route.ts
 * @description POST /api/ballistics/calculate - Calculate ballistics data
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const BallisticsRequestSchema = z.object({
  firearmId: z.string(),
  distance: z.number().min(0).max(1000),
  windSpeed: z.number().default(0),
  windDirection: z.enum(["0", "45", "90", "135", "180", "225", "270", "315"]).optional(),
  temperature: z.number().default(59), // Fahrenheit
  humidity: z.number().min(0).max(100).default(50),
  barometricPressure: z.number().default(29.92),
});

type BallisticsRequest = z.infer<typeof BallisticsRequestSchema>;

// Simplified ballistic calculator
function calculateBallistics(params: BallisticsRequest) {
  const { distance, windSpeed, temperature, humidity, barometricPressure } = params;

  // Base trajectory (simplified for demo)
  const muzzleVelocity = 900; // feet per second
  const gravity = 32.174; // ft/s²
  const g = gravity * 12; // convert to in/s²

  // Time of flight
  const timeOfFlight = (distance * 12) / (muzzleVelocity * 12);

  // Drop calculation (vertical distance fallen)
  const dropInches = 0.5 * g * Math.pow(timeOfFlight, 2) / 12;

  // Wind drift (simplified)
  const windDriftInches = windSpeed > 0 ? (windSpeed * timeOfFlight) / 10 : 0;

  // Velocity at distance (simplified velocity loss)
  const velocityRetention = Math.max(0.5, 1 - distance / 1000);
  const velocityAtDistance = muzzleVelocity * velocityRetention;

  // Energy (kinetic energy in foot-pounds)
  const bulletWeight = 147; // grains (9mm typical)
  const bulletMass = bulletWeight / 7000; // convert to pounds
  const energyAtMuzzle = (bulletMass * Math.pow(muzzleVelocity, 2)) / (2 * 32.174);
  const energyAtDistance = (bulletMass * Math.pow(velocityAtDistance, 2)) / (2 * 32.174);

  // Environmental corrections
  const temperatureCorrection = (temperature - 59) * 0.01; // 1% per 10°F
  const humidityCorrection = (humidity - 50) * 0.001; // small effect
  const pressureCorrection = (barometricPressure - 29.92) * 0.05;

  const totalCorrection = temperatureCorrection + humidityCorrection + pressureCorrection;
  const correctedDrop = dropInches * (1 + totalCorrection);

  return {
    distance,
    dropInches: Math.round(correctedDrop * 100) / 100,
    windDriftInches: Math.round(windDriftInches * 100) / 100,
    timeOfFlight: Math.round(timeOfFlight * 1000) / 1000,
    velocityAtDistance: Math.round(velocityAtDistance),
    energyAtMuzzle: Math.round(energyAtMuzzle),
    energyAtDistance: Math.round(energyAtDistance),
    velocityRetention: Math.round(velocityRetention * 100),
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

