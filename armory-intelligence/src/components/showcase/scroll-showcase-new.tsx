/**
 * @file scroll-showcase.tsx
 * @description Arsenal Nexus - Cinematic Landing Page
 * 
 * Design: Deep space + military hangar aesthetic
 * - Near-black/deep navy base
 * - Gunmetal gray panels
 * - Orange/amber: Real weapons (heat, power)
 * - Cyan/electric blue: Star Wars (holograms, energy)
 * - Minimal, premium, tactical, serious
 */

"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Crosshair,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
  BarChart3,
  Layers,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

// ============================================
// ANIMATED COUNTER
// ============================================
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030305]"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Base dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-[#08090d] to-[#0c0e14]" />
        
        {/* Subtle grid */}
        <motion.div className="absolute inset-0 bg-grid-pattern opacity-40" style={{ y }} />
        
        {/* Gradient orbs */}
        <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full bg-orange-500/[0.03] blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-cyan-400/[0.03] blur-[120px]" />
        
        {/* Starfield */}
        <div className="absolute inset-0 bg-starfield opacity-60" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-6xl mx-auto px-6"
        style={{ opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12141c] border border-white/[0.06] text-slate-400 text-sm font-medium mb-10"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-semibold">Sci-Fi</span>
          </div>
          <span className="text-slate-600">×</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-orange-400 font-semibold">Real World</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 ml-1" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-8"
        >
          <span className="block text-slate-200">The Elite</span>
          <span className="block mt-2">
            <span className="text-gradient-real">Arsenal</span>
            {" "}
            <span className="text-gradient-scifi">Nexus</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Compare Star Wars blasters to real-world firearms.
          AI-powered analysis, holographic displays, and tactical briefings —
          built with <span className="text-cyan-400">Tambo</span> Generative UI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/chat"
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-xl text-lg hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all duration-500 flex items-center gap-3"
          >
            <MessageSquare className="w-5 h-5" />
            Enter the Armory
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="px-8 py-4 bg-[#12141c] text-slate-200 font-semibold rounded-xl text-lg border border-white/[0.08] hover:border-cyan-400/30 hover:bg-[#181a24] transition-all duration-300"
          >
            Explore Catalog
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 flex items-center justify-center gap-12 md:gap-16"
        >
          {[
            { value: 19, suffix: "", label: "Weapons", accent: "orange" },
            { value: 10, suffix: "+", label: "AI Components", accent: "cyan" },
            { value: 3, suffix: "", label: "Universes", accent: "orange" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-black tracking-tight ${
                stat.accent === "cyan" ? "text-cyan-400" : "text-orange-400"
              }`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <ChevronDown className="w-5 h-5 text-slate-600" />
      </motion.div>
    </section>
  );
}

// ============================================
// WEAPON COMPARISON SHOWCASE
// ============================================
function ComparisonShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const comparisons = [
    {
      scifi: { name: "E-11 Blaster Rifle", era: "Imperial Standard", stat: 75 },
      real: { name: "M4A1 Carbine", era: "Modern Military", stat: 82 },
      analysis: "The E-11's plasma bolts vs kinetic rounds — which delivers more tactical value?"
    },
    {
      scifi: { name: "DL-44 Heavy Blaster", era: "Galactic Civil War", stat: 85 },
      real: { name: ".44 Magnum", era: "Classic Revolver", stat: 78 },
      analysis: "Han Solo's iconic sidearm against the most powerful handgun of its era."
    },
    {
      scifi: { name: "Lightsaber", era: "Jedi Order", stat: 100 },
      real: { name: "Combat Knife", era: "Modern CQC", stat: 45 },
      analysis: "The ultimate melee weapon comparison — plasma blade vs tempered steel."
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-[#08090d]">
      {/* Border gradient top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-semibold text-xs uppercase tracking-[0.25em] mb-4 block">
            Cross-Universe Analysis
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            <span className="text-gradient-scifi">Sci-Fi</span>
            {" vs "}
            <span className="text-gradient-real">Reality</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Compare Star Wars weapons to their real-world equivalents with AI-powered analysis.
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {comparisons.map((comp, i) => (
            <motion.div
              key={comp.scifi.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group card-gunmetal rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Sci-Fi side */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Sci-Fi</span>
                </div>
                <h3 className="text-white font-bold text-lg">{comp.scifi.name}</h3>
                <p className="text-slate-500 text-sm">{comp.scifi.era}</p>
                {/* Stat bar */}
                <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${comp.scifi.stat}%` } : {}}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>

              {/* VS divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-slate-600 text-xs font-bold">VS</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Real side */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Real</span>
                </div>
                <h3 className="text-white font-bold text-lg">{comp.real.name}</h3>
                <p className="text-slate-500 text-sm">{comp.real.era}</p>
                {/* Stat bar */}
                <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${comp.real.stat}%` } : {}}
                    transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                  />
                </div>
              </div>

              {/* Analysis */}
              <p className="text-slate-500 text-sm italic mt-4 pt-4 border-t border-white/[0.04]">
                "{comp.analysis}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#12141c] text-cyan-400 font-semibold rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Try AI Showdowns
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: MessageSquare,
      title: "AI Chat",
      description: "Ask anything about weapons. The UI builds itself with holographic cards, showdowns, and briefings.",
      accent: "cyan",
      link: "/chat",
    },
    {
      icon: Crosshair,
      title: "Catalog",
      description: "Browse 19+ weapons from both universes. Filter by category, search by name, compare stats.",
      accent: "orange",
      link: "/catalog",
    },
    {
      icon: Shield,
      title: "Safety Guides",
      description: "Interactive checklists for storage, cleaning, and range safety. AI-generated protocols.",
      accent: "cyan",
      link: "/safety",
    },
    {
      icon: BarChart3,
      title: "Ballistics Lab",
      description: "Visualize bullet trajectories, energy transfer, and wind drift. Real physics calculations.",
      accent: "orange",
      link: "/ballistics",
    },
    {
      icon: BookOpen,
      title: "Regulations",
      description: "State-by-state firearms laws, CCW reciprocity, and compliance guides.",
      accent: "cyan",
      link: "/regulations",
    },
    {
      icon: Layers,
      title: "Maintenance",
      description: "Step-by-step cleaning and maintenance guides with progress tracking.",
      accent: "orange",
      link: "/maintenance",
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-[#0c0e14]">
      {/* Border gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-orange-400 font-semibold text-xs uppercase tracking-[0.25em] mb-4 block">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Your Complete <span className="text-gradient-real">Armory</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Six AI-powered modules for education, comparison, and tactical analysis.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={feature.link}
                className={`block card-gunmetal rounded-xl p-6 h-full hover:scale-[1.02] transition-all duration-300 ${
                  feature.accent === "cyan" 
                    ? "hover:border-cyan-400/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)]" 
                    : "hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.05)]"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  feature.accent === "cyan" 
                    ? "bg-cyan-400/10 text-cyan-400" 
                    : "bg-orange-500/10 text-orange-400"
                }`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TAMBO AI SECTION
// ============================================
function TamboSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 bg-[#08090d]">
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/[0.02] blur-[200px]" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Powered by Tambo
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-8">
            <span className="text-gradient-scifi">Generative UI</span>
            <br />
            <span className="text-slate-400 text-2xl md:text-3xl font-semibold">that adapts to your questions</span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Ask about weapons, and the AI builds custom components in real-time.
            Holographic cards, showdown comparisons, tactical briefings — all generated dynamically.
          </p>

          {/* Demo preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-gunmetal rounded-2xl p-6 text-left max-w-xl mx-auto"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl rounded-tl-sm px-4 py-3">
                <p className="text-slate-300 text-sm">Compare the E-11 Blaster to the M4A1</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Rendering WeaponShowdown component...
                </div>
                <div className="bg-[#12141c] rounded-xl p-4 border border-cyan-400/10 animate-border-glow-scifi">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-cyan-400 text-xs font-semibold mb-1">E-11 BLASTER</div>
                      <div className="h-1 bg-cyan-400/30 rounded-full" />
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 text-xs font-semibold mb-1">M4A1 CARBINE</div>
                      <div className="h-1 bg-orange-400/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10"
          >
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-bold rounded-xl text-lg hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5" />
              Try the AI Chat
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// DISCLAIMER SECTION
// ============================================
function DisclaimerSection() {
  return (
    <section className="relative py-16 bg-[#0c0e14]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-amber-500 mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Disclaimer</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            This is an educational and entertainment project. Star Wars is a trademark of Lucasfilm Ltd.
            All real firearm specifications are for educational purposes only. Always consult local laws
            and certified professionals for firearms safety and regulations.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export default function ScrollShowcase() {
  return (
    <div className="bg-[#030305]">
      <HeroSection />
      <ComparisonShowcase />
      <FeaturesSection />
      <TamboSection />
      <DisclaimerSection />
    </div>
  );
}
