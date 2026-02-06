"use client";

/**
 * @file ballistics/page.tsx
 * @description Ballistics calculator and trajectory visualization page with embedded AI chat
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BallisticsChart } from "@/components/armory/ballistics-chart";
import { EmbeddedChat } from "@/components/tambo/embedded-chat";
import { PageContextHelper } from "@/components/tambo/page-context-helper";
import { PageHeader } from "@/components/armory/page-header";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { ClientOnly } from "@/components/client-only";
import { 
  Target, 
  Wind, 
  Thermometer, 
  Droplets,
  Calculator,
  Loader2,
  TrendingDown,
  Zap,
  Clock
} from "lucide-react";

interface BallisticsResult {
  distance: number;
  dropInches: number;
  windDriftInches: number;
  timeOfFlight: number;
  velocityAtDistance: number;
  energyAtMuzzle: number;
  energyAtDistance: number;
  velocityRetention: number;
}

// Common ammunition presets
const ammoPresets = [
  { 
    id: "9mm-fmj", 
    name: "9mm 115gr FMJ", 
    caliber: "9mm", 
    bulletWeight: 115,
    muzzleVelocity: 1150,
    ballisticCoefficient: 0.145,
  },
  { 
    id: "9mm-hp", 
    name: "9mm 147gr JHP", 
    caliber: "9mm", 
    bulletWeight: 147,
    muzzleVelocity: 990,
    ballisticCoefficient: 0.168,
  },
  { 
    id: "45acp", 
    name: ".45 ACP 230gr FMJ", 
    caliber: ".45 ACP", 
    bulletWeight: 230,
    muzzleVelocity: 830,
    ballisticCoefficient: 0.195,
  },
  { 
    id: "556nato", 
    name: "5.56 NATO 55gr M193", 
    caliber: "5.56x45mm", 
    bulletWeight: 55,
    muzzleVelocity: 3165,
    ballisticCoefficient: 0.243,
  },
  { 
    id: "308win", 
    name: ".308 Win 168gr Match", 
    caliber: ".308 Win", 
    bulletWeight: 168,
    muzzleVelocity: 2650,
    ballisticCoefficient: 0.462,
  },
  { 
    id: "300blk-sub", 
    name: ".300 BLK 220gr Subsonic", 
    caliber: ".300 BLK", 
    bulletWeight: 220,
    muzzleVelocity: 1010,
    ballisticCoefficient: 0.297,
  },
];

export default function BallisticsPage() {
  const [selectedPreset, setSelectedPreset] = useState(ammoPresets[0]);
  const [distance, setDistance] = useState(100);
  const [windSpeed, setWindSpeed] = useState(0);
  const [temperature, setTemperature] = useState(59);
  const [humidity, setHumidity] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BallisticsResult | null>(null);
  const [trajectoryData, setTrajectoryData] = useState<any[]>([]);

  // Context for AI - knows current ballistics parameters
  const pageContext = useMemo(() => ({
    page: "ballistics",
    selectedAmmo: selectedPreset.name,
    caliber: selectedPreset.caliber,
    bulletWeight: selectedPreset.bulletWeight,
    muzzleVelocity: selectedPreset.muzzleVelocity,
    distance,
    windSpeed,
    temperature,
    hasResult: !!result,
  }), [selectedPreset, distance, windSpeed, temperature, result]);

  // Ballistics-specific AI suggestions
  const ballisticsSuggestions = useMemo(() => [
    {
      id: "ballistics-explain",
      title: "Explain this data",
      detailedSuggestion: `Explain the ballistics data for ${selectedPreset.name} at ${distance} yards`,
      messageId: "explain-query",
    },
    {
      id: "ballistics-compare",
      title: "Compare calibers",
      detailedSuggestion: "Compare 9mm and .45 ACP for self-defense",
      messageId: "compare-query",
    },
    {
      id: "ballistics-calculate",
      title: "Calculate trajectory",
      detailedSuggestion: "Calculate the trajectory for .308 Winchester at 500 yards",
      messageId: "calculate-query",
    },
  ], [selectedPreset, distance]);

  const calculateBallistics = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/ballistics/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletWeight: selectedPreset.bulletWeight,
          muzzleVelocity: selectedPreset.muzzleVelocity,
          ballisticCoefficient: selectedPreset.ballisticCoefficient,
          distance,
          windSpeed,
          temperature,
          humidity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        // Generate trajectory points for chart
        const points = [];
        for (let d = 0; d <= distance; d += Math.max(distance / 20, 10)) {
          const drop = calculateDrop(d);
          points.push({
            distance: d,
            drop: drop,
            velocity: calculateVelocity(d),
          });
        }
        setTrajectoryData(points);
      } else {
        // Use simplified calculation for demo
        performLocalCalculation();
      }
    } catch (err) {
      // Fallback to local calculation
      performLocalCalculation();
    } finally {
      setLoading(false);
    }
  };

  // Simplified local ballistics calculation for demo
  const calculateDrop = (d: number) => {
    const gravity = 386.09; // in/s²
    const velocity = selectedPreset.muzzleVelocity * 12; // ft/s to in/s
    const time = d / (velocity / 36); // time in seconds (velocity in in/s, distance in yards)
    return -0.5 * gravity * time * time;
  };

  const calculateVelocity = (d: number) => {
    const bc = selectedPreset.ballisticCoefficient;
    const decayRate = 1 - (bc * 0.001);
    return selectedPreset.muzzleVelocity * Math.pow(decayRate, d / 100);
  };

  const performLocalCalculation = () => {
    const drop = calculateDrop(distance);
    const velocityAtDist = calculateVelocity(distance);
    const time = distance / (selectedPreset.muzzleVelocity * 3); // simplified
    const windDrift = windSpeed * time * 1.5; // simplified
    const energyMuzzle = (selectedPreset.bulletWeight * Math.pow(selectedPreset.muzzleVelocity, 2)) / 450240;
    const energyAtDist = (selectedPreset.bulletWeight * Math.pow(velocityAtDist, 2)) / 450240;

    setResult({
      distance,
      dropInches: Math.abs(drop),
      windDriftInches: windDrift,
      timeOfFlight: time,
      velocityAtDistance: velocityAtDist,
      energyAtMuzzle: energyMuzzle,
      energyAtDistance: energyAtDist,
      velocityRetention: (velocityAtDist / selectedPreset.muzzleVelocity) * 100,
    });

    // Generate trajectory data
    const points = [];
    for (let d = 0; d <= distance; d += Math.max(distance / 20, 10)) {
      points.push({
        distance: d,
        drop: calculateDrop(d),
        velocity: calculateVelocity(d),
      });
    }
    setTrajectoryData(points);
  };

  return (
    <ClientOnly>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
      >
        <PageContextHelper 
          contextKey="ballisticsPage"
          context={pageContext}
        />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <PageHeader pageName="Ballistics" accentColor="text-purple-400" />

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Ballistics Calculator</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Calculate bullet drop, wind drift, and trajectory for accurate shot placement.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-6">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                Calculator Inputs
              </h2>

              {/* Ammo Preset Selection */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Ammunition</label>
                <select
                  value={selectedPreset.id}
                  onChange={(e) => setSelectedPreset(ammoPresets.find(p => p.id === e.target.value)!)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                >
                  {ammoPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ammo Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/30 rounded-xl">
                <div>
                  <span className="text-xs text-slate-500">Bullet Weight</span>
                  <p className="text-white font-medium">{selectedPreset.bulletWeight} gr</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Muzzle Velocity</span>
                  <p className="text-white font-medium">{selectedPreset.muzzleVelocity} fps</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Caliber</span>
                  <p className="text-white font-medium">{selectedPreset.caliber}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">BC</span>
                  <p className="text-white font-medium">{selectedPreset.ballisticCoefficient}</p>
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Distance
                  </span>
                  <span className="text-white font-medium">{distance} yards</span>
                </label>
                <input
                  type="range"
                  min={25}
                  max={1000}
                  step={25}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Wind Speed */}
              <div>
                <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    Wind Speed
                  </span>
                  <span className="text-white font-medium">{windSpeed} mph</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Temperature
                  </span>
                  <span className="text-white font-medium">{temperature}°F</span>
                </label>
                <input
                  type="range"
                  min={-20}
                  max={120}
                  step={1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Humidity
                  </span>
                  <span className="text-white font-medium">{humidity}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateBallistics}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calculate Trajectory
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {!result && (
              <div className="bg-slate-800/30 rounded-2xl p-12 border border-slate-700 text-center">
                <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl text-slate-400 mb-2">Ready to Calculate</h3>
                <p className="text-slate-500">
                  Adjust parameters and click "Calculate Trajectory" to see results
                </p>
              </div>
            )}

            {result && (
              <>
                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-xl p-5 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <TrendingDown className="w-5 h-5" />
                      <span className="text-sm">Bullet Drop</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {result.dropInches.toFixed(1)}"
                    </p>
                    <p className="text-red-400/70 text-sm mt-1">at {distance} yards</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-950/50 to-cyan-900/30 rounded-xl p-5 border border-cyan-500/20">
                    <div className="flex items-center gap-2 text-cyan-400 mb-2">
                      <Wind className="w-5 h-5" />
                      <span className="text-sm">Wind Drift</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {result.windDriftInches.toFixed(1)}"
                    </p>
                    <p className="text-cyan-400/70 text-sm mt-1">{windSpeed} mph wind</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-xl p-5 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Zap className="w-5 h-5" />
                      <span className="text-sm">Velocity</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {Math.round(result.velocityAtDistance)}
                    </p>
                    <p className="text-purple-400/70 text-sm mt-1">
                      fps ({result.velocityRetention.toFixed(0)}% retained)
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-950/50 to-orange-900/30 rounded-xl p-5 border border-orange-500/20">
                    <div className="flex items-center gap-2 text-orange-400 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm">Time of Flight</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {result.timeOfFlight.toFixed(3)}s
                    </p>
                    <p className="text-orange-400/70 text-sm mt-1">to target</p>
                  </div>
                </div>

                {/* Trajectory Chart */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-white font-semibold text-lg mb-4">Trajectory Curve</h3>
                  {trajectoryData.length > 0 && (
                    <BallisticsChart
                      caliber={selectedPreset.caliber}
                      bulletWeight={selectedPreset.bulletWeight}
                      muzzleVelocity={selectedPreset.muzzleVelocity}
                      zeroDistance={100}
                      showVelocity={true}
                      showEnergy={true}
                      trajectoryData={trajectoryData.map(d => ({
                        distance: d.distance,
                        drop: Math.abs(d.drop),
                        velocity: d.velocity,
                        energy: (selectedPreset.bulletWeight * Math.pow(d.velocity, 2)) / 450240,
                        windDrift: d.distance * windSpeed * 0.015,
                      }))}
                    />
                  )}
                </div>

                {/* Energy Table */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-white font-semibold text-lg mb-4">Energy Comparison</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <p className="text-slate-400 text-sm mb-1">Energy at Muzzle</p>
                      <p className="text-3xl font-bold text-green-400">
                        {Math.round(result.energyAtMuzzle)} ft-lbs
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <p className="text-slate-400 text-sm mb-1">Energy at {distance} yards</p>
                      <p className="text-3xl font-bold text-amber-400">
                        {Math.round(result.energyAtDistance)} ft-lbs
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Energy Retained</span>
                      <span className="text-white font-medium">
                        {((result.energyAtDistance / result.energyAtMuzzle) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all duration-500"
                        style={{
                          width: `${(result.energyAtDistance / result.energyAtMuzzle) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Embedded AI Chat */}
      <EmbeddedChat
        pageName="ballistics"
        suggestions={ballisticsSuggestions}
        pageContext={pageContext}
        title="Ballistics Assistant"
      />
        </div>
      </TamboProvider>
    </ClientOnly>
  );
}
