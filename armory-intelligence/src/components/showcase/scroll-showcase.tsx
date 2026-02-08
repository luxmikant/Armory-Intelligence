/**
 * @file scroll-showcase.tsx
 * @description MetaMask-inspired immersive landing page with bold sections,
 * product showcases, glassmorphism, and cinematic scroll animations.
 */

"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Crosshair,
  Scale,
  Wrench,
  MessageSquare,
  ChevronDown,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
  Globe,
  Lock,
  Eye,
  Layers,
  Search,
  BarChart3,
} from "lucide-react";


/* ─────────────────────── Animated Counter ─────────────────────── */
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


/* ─────────────────────── Hero Section ─────────────────────── */
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
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(251,146,60,0.12),_transparent_70%)]" />
        <motion.div className="absolute inset-0" style={{ y }}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </motion.div>
        {/* Glow orbs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.04] blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
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
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-10 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Tambo Generative UI</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </motion.div>

        {/* Main heading — MetaMask-style bold, stacked */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-8"
        >
          <span className="block">Your Home in</span>
          <span className="block mt-2 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            Firearms Ed
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          The AI-powered education platform where intelligent components
          adapt to your questions. Ask anything — the UI builds itself.
        </motion.p>

        {/* CTA Buttons — MetaMask-style bold rounded buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/chat"
            className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold rounded-full text-lg hover:shadow-[0_0_50px_rgba(251,146,60,0.35)] transition-all duration-500 flex items-center gap-3 hover:scale-[1.02]"
          >
            <MessageSquare className="w-5 h-5" />
            Talk to the AI
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="px-10 py-4 bg-white/[0.06] text-white font-semibold rounded-full text-lg border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-500 backdrop-blur-sm hover:scale-[1.02]"
          >
            Explore Catalog
          </Link>
        </motion.div>

        {/* Stats bar — MetaMask-style inline stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 flex items-center justify-center gap-12 md:gap-20"
        >
          {[
            { value: 10, suffix: "+", label: "AI Components" },
            { value: 50, suffix: "+", label: "Safety Rules" },
            { value: 50, suffix: "", label: "US States" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-1.5 font-medium uppercase tracking-wider">
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


/* ─────────────────────── Product Showcase (MetaMask "Everything Wallet" style) ─────────────────────── */
function ProductShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState(0);

  const showcaseItems = [
    {
      tab: "AI Chat",
      title: "Ask. Learn. Interact.",
      subtitle: "Full-featured AI assistant that builds the interface as you talk. Get comparison tables, ballistics charts, safety checklists — all rendered dynamically.",
      features: ["Natural language queries", "Dynamic UI generation", "Context-aware responses"],
      gradient: "from-orange-500 to-amber-400",
      icon: MessageSquare,
      mockContent: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl rounded-tr-sm px-5 py-3 max-w-[280px]">
              <p className="text-white text-sm">Compare the Glock 19 and Sig P320 for concealed carry</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white/[0.06] border border-white/[0.1] rounded-2xl rounded-tl-sm px-5 py-4 max-w-[320px]">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-medium mb-3">
                <Sparkles className="w-3 h-3" />
                Rendering ComparisonTable...
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-white/[0.06]">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-orange-500/10">
                    <div className="font-bold text-white mb-1">Glock 19</div>
                    <div className="text-slate-400">9mm &middot; 15+1</div>
                    <div className="text-orange-400 text-[10px] mt-1">$549</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-orange-500/10">
                    <div className="font-bold text-white mb-1">Sig P320</div>
                    <div className="text-slate-400">9mm &middot; 15+1</div>
                    <div className="text-orange-400 text-[10px] mt-1">$579</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      tab: "Catalog",
      title: "Smart Catalog Search",
      subtitle: "Browse and filter firearms with AI-powered search. Detailed specs, safety features, and instant card-based results.",
      features: ["Instant search", "Detailed spec cards", "Category filtering"],
      gradient: "from-blue-500 to-cyan-400",
      icon: Search,
      mockContent: (
        <div className="space-y-3">
          {[
            { name: "Glock 19 Gen5", type: "Handgun", cal: "9mm", price: "$549" },
            { name: "Sig P320 Compact", type: "Handgun", cal: "9mm", price: "$579" },
            { name: "S&W M&P15 Sport II", type: "Rifle", cal: "5.56 NATO", price: "$749" },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40 border border-white/[0.06] hover:border-orange-500/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-semibold">{item.name}</div>
                <div className="text-slate-500 text-xs">{item.type} &middot; {item.cal}</div>
              </div>
              <div className="text-orange-400 text-sm font-bold">{item.price}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      tab: "Ballistics",
      title: "Trajectory Visualization",
      subtitle: "Advanced ballistics calculator with real-time charts. Visualize bullet drop, wind drift, and energy retention.",
      features: ["Real-time calculations", "Interactive charts", "Multi-caliber comparison"],
      gradient: "from-purple-500 to-violet-400",
      icon: BarChart3,
      mockContent: (
        <div className="space-y-4">
          <div className="h-32 flex items-end gap-1 px-4">
            {[85, 78, 68, 55, 42, 35, 28, 22, 18, 15].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${h}%` } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-purple-500/80 to-violet-400/40"
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 px-4">
            <span>0 yds</span><span>250</span><span>500</span><span>750</span><span>1000 yds</span>
          </div>
          <div className="grid grid-cols-3 gap-2 px-4">
            {[
              { label: "Velocity", val: "2,750 fps" },
              { label: "Drop", val: "-4.2 in" },
              { label: "Energy", val: "1,280 ft-lb" },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-slate-800/50 border border-white/[0.05]">
                <div className="text-[10px] text-slate-500">{s.label}</div>
                <div className="text-white text-xs font-bold">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section ref={ref} className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">
            The Everything Platform
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6">
            All your tools.{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              One AI.
            </span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {showcaseItems.map((item, i) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === i
                  ? "bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/20"
                  : "bg-white/[0.05] text-slate-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
              }`}
            >
              {item.tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Info */}
              <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${showcaseItems[activeTab].gradient} flex items-center justify-center shadow-lg`}>
                  {(() => { const Icon = showcaseItems[activeTab].icon; return <Icon className="w-7 h-7 text-white" />; })()}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  {showcaseItems[activeTab].title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {showcaseItems[activeTab].subtitle}
                </p>
                <ul className="space-y-3">
                  {showcaseItems[activeTab].features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={activeTab === 0 ? "/chat" : activeTab === 1 ? "/catalog" : "/ballistics"}
                  className="inline-flex items-center gap-2 text-orange-400 font-semibold text-sm hover:gap-3 transition-all group"
                >
                  Try it now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right: Mock UI */}
              <div className="relative">
                <div className="rounded-3xl bg-slate-900/80 border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-xl">
                  {/* Window Chrome */}
                  <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-lg bg-slate-800/80 text-slate-500 text-[11px] font-mono">
                        armory-intelligence.ai
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6 min-h-[300px]">
                    {showcaseItems[activeTab].mockContent}
                  </div>
                </div>
                {/* Glow effect */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${showcaseItems[activeTab].gradient} opacity-[0.03] rounded-3xl blur-2xl -z-10`} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}


/* ─────────────────────── How It Works ─────────────────────── */
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: MessageSquare,
      title: "Ask a Question",
      description:
        "Type naturally — ask about any firearm, safety rule, ballistic calculation, or state regulation.",
      color: "from-blue-500 to-cyan-500",
      step: "01",
    },
    {
      icon: Brain,
      title: "AI Decides the UI",
      description:
        "Tambo's Generative UI engine picks the perfect component — cards, charts, comparisons, checklists.",
      color: "from-purple-500 to-pink-500",
      step: "02",
    },
    {
      icon: Zap,
      title: "Interactive Response",
      description:
        "Get rich, interactive components — not just text. Compare firearms, visualize trajectories, track checklists.",
      color: "from-orange-500 to-amber-500",
      step: "03",
    },
  ];

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0c0a14] to-slate-950" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            AI That Builds the{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Interface
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Unlike traditional apps, Armory Intelligence dynamically renders the
            right component for every question using Generative UI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              <div className="relative bg-white/[0.02] rounded-3xl p-8 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:bg-white/[0.04] h-full">
                {/* Step number */}
                <div className="text-[64px] font-black text-white/[0.03] absolute top-4 right-6 leading-none select-none">
                  {step.step}
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────── Feature Cards (MetaMask grid style) ─────────────────────── */
function FeatureGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: Crosshair,
      title: "Smart Catalog",
      description: "Browse firearms with AI-powered search. Instant card-based results with full specifications.",
      href: "/catalog",
      color: "from-orange-500 to-amber-400",
    },
    {
      icon: Shield,
      title: "Safety Education",
      description: "Interactive checklists, the four fundamental rules, and AI-guided safety scenarios.",
      href: "/safety",
      color: "from-emerald-500 to-green-400",
    },
    {
      icon: Target,
      title: "Ballistics Calculator",
      description: "Advanced trajectory visualization with real-time charts. Compare calibers and calculate drop.",
      href: "/ballistics",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Scale,
      title: "State Regulations",
      description: "Look up firearms laws for all 50 US states. CCW reciprocity and requirements at a glance.",
      href: "/regulations",
      color: "from-purple-500 to-violet-400",
    },
    {
      icon: Wrench,
      title: "Maintenance Guides",
      description: "Step-by-step cleaning and maintenance with safety warnings and progress tracking.",
      href: "/maintenance",
      color: "from-yellow-500 to-amber-400",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Full-featured chat powered by Tambo. Ask anything — the AI renders interactive components.",
      href: "/chat",
      color: "from-rose-500 to-pink-400",
    },
  ];

  return (
    <section ref={ref} className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">
            Features
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Every Page is{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              AI-Enhanced
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Each section has an embedded AI assistant that understands your context
            and generates the right UI components on the fly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={feature.href} className="block group h-full">
                <div className="relative h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 transition-all duration-500 overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────── Tambo / Generative UI Showcase ─────────────────────── */
function TamboShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tamboFeatures = [
    {
      title: "Generative UI Components",
      description: "AI selects from 10+ custom React components to render the perfect answer — cards, tables, charts, and more.",
      icon: Layers,
    },
    {
      title: "Context-Aware Pages",
      description: "Every page sends real-time context to the AI so responses are always relevant to what you're viewing.",
      icon: Eye,
    },
    {
      title: "Interactive Tools",
      description: "The AI provides tools — search firearms, calculate ballistics, check state laws — all through natural language.",
      icon: Zap,
    },
    {
      title: "Embedded Chat Everywhere",
      description: "Each page has its own AI assistant with page-specific suggestions. Help is always one click away.",
      icon: MessageSquare,
    },
  ];

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a0a14] to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-orange-500/[0.02] blur-[150px]" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">
            Built With Tambo
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            The Power of{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Generative UI
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {tamboFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="relative bg-white/[0.02] rounded-2xl p-7 border border-white/[0.06] hover:border-orange-500/20 transition-all duration-500 hover:bg-white/[0.04] h-full">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/10">
                    <feature.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────── Security / Trust Section ─────────────────────── */
function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">
              Education First
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Safety &{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Responsibility
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Built to educate, not to sell. Every feature is designed to promote
              safe handling, proper storage, and legal compliance.
            </p>
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Safety-first content with verified rules" },
                { icon: Lock, text: "Educational use only — not legal advice" },
                { icon: Globe, text: "50-state regulation coverage" },
                { icon: BookOpen, text: "Step-by-step guides and checklists" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-white/[0.08] p-8 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Safety First</div>
                  <div className="text-slate-500 text-xs">Educational Platform</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Treat every firearm as loaded",
                  "Never point at anything you don't intend to destroy",
                  "Keep finger off trigger until ready",
                  "Know your target and what's beyond",
                ].map((rule, i) => (
                  <motion.div
                    key={rule}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/[0.04]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-slate-300 text-xs">{rule}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-6 bg-orange-500/[0.03] rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────── Tech Stack ─────────────────────── */
function TechStackSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stack = [
    { name: "Tambo SDK", desc: "Generative UI Engine" },
    { name: "Next.js 15", desc: "React Framework" },
    { name: "Prisma", desc: "Database ORM" },
    { name: "Framer Motion", desc: "Animations" },
    { name: "Recharts", desc: "Visualization" },
    { name: "Tailwind CSS 4", desc: "Styling" },
  ];

  return (
    <section ref={ref} className="relative py-20">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <span className="text-slate-500 font-medium text-xs uppercase tracking-[0.25em]">
            Built With
          </span>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {stack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">{tech.name}</span>
                <span className="text-slate-600 text-xs">{tech.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────── CTA Section ─────────────────────── */
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,_rgba(251,146,60,0.08),_transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-10">
              <Star className="w-4 h-4" />
              Ready to explore?
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[0.95]">
              Experience AI-Powered
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Firearms Education
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-light">
              Ask a question and watch the interface come alive. Every component
              is generated by AI to give you exactly what you need.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="group px-12 py-5 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold rounded-full text-lg hover:shadow-[0_0_60px_rgba(251,146,60,0.35)] transition-all duration-500 flex items-center gap-3 hover:scale-[1.02]"
              >
                <MessageSquare className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/safety"
                className="px-12 py-5 bg-white/[0.06] text-white font-semibold rounded-full text-lg border border-white/[0.1] hover:bg-white/[0.1] transition-all duration-500 hover:scale-[1.02]"
              >
                Safety First
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ─────────────────────── Main Export ─────────────────────── */
export default function ScrollShowcase() {
  return (
    <div className="bg-slate-950 text-white">
      <HeroSection />
      <ProductShowcase />
      <HowItWorksSection />
      <FeatureGrid />
      <TamboShowcaseSection />
      <TrustSection />
      <TechStackSection />
      <CTASection />
    </div>
  );
}
