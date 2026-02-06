/**
 * @file scroll-showcase.tsx
 * @description Immersive scroll-driven homepage with cinematic storytelling sections
 * Professional-grade animations, glass-morphism, and visual effects
 */

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
} from "lucide-react";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950" />
        <motion.div
          className="absolute inset-0"
          style={{ y }}
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </motion.div>
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/5 blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-red-500/5 blur-[96px] animate-pulse delay-500" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto px-6"
        style={{ opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          Powered by Tambo Generative UI
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
        >
          <span className="block">Armory</span>
          <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            Intelligence
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered firearms education platform where intelligent components
          adapt to your questions. Ask anything — the UI responds.
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
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300 flex items-center gap-3"
          >
            <MessageSquare className="w-5 h-5" />
            Talk to the AI
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="px-8 py-4 bg-white/5 text-white font-semibold rounded-2xl text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            Explore Catalog
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "10+", label: "AI Components" },
            { value: "50+", label: "Safety Rules" },
            { value: "50", label: "US States" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-6 h-6 text-slate-600" />
      </motion.div>
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
    },
    {
      icon: Brain,
      title: "AI Decides the UI",
      description:
        "Tambo's Generative UI engine selects the perfect component to render your answer — cards, charts, comparisons, checklists.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Interactive Response",
      description:
        "Get rich, interactive components — not just text. Compare firearms, visualize trajectories, track safety checklists.",
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI That Builds the{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Interface
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Unlike traditional apps, Armory Intelligence uses Tambo&apos;s Generative UI
            to dynamically render the right component for every question.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-60px)] h-px bg-gradient-to-r from-slate-700 to-transparent" />
              )}

              <div className="relative bg-white/[0.03] rounded-3xl p-8 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:bg-white/[0.05] group-hover:shadow-[0_0_60px_rgba(251,146,60,0.05)]">
                {/* Step number */}
                <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                  {i + 1}
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
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

/* ─────────────────────── Feature Showcase ─────────────────────── */
function FeatureShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Crosshair,
      title: "Smart Catalog",
      description:
        "Browse firearms with AI-powered search. Ask questions and get instant card-based results with full specifications.",
      href: "/catalog",
      gradient: "from-orange-500/10 to-amber-500/10",
      borderColor: "hover:border-orange-500/30",
      iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
      image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&q=80",
    },
    {
      icon: Shield,
      title: "Safety Education",
      description:
        "Interactive checklists, the four fundamental rules, and AI-guided safety scenarios to build responsible habits.",
      href: "/safety",
      gradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "hover:border-green-500/30",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80",
    },
    {
      icon: Target,
      title: "Ballistics Calculator",
      description:
        "Advanced trajectory visualization with real-time charts. Compare calibers, calculate drop, and understand physics.",
      href: "/ballistics",
      gradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "hover:border-blue-500/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1609912268664-7a0e96422517?w=600&q=80",
    },
    {
      icon: Scale,
      title: "State Regulations",
      description:
        "Look up firearms laws for all 50 US states. CCW reciprocity, restrictions, and requirements at a glance.",
      href: "/regulations",
      gradient: "from-purple-500/10 to-violet-500/10",
      borderColor: "hover:border-purple-500/30",
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-500",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    },
    {
      icon: Wrench,
      title: "Maintenance Guides",
      description:
        "Step-by-step cleaning and maintenance procedures with safety warnings and progress tracking.",
      href: "/maintenance",
      gradient: "from-yellow-500/10 to-amber-500/10",
      borderColor: "hover:border-yellow-500/30",
      iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description:
        "Full-featured chat powered by Tambo. Ask anything — the AI renders interactive components as answers.",
      href: "/chat",
      gradient: "from-rose-500/10 to-pink-500/10",
      borderColor: "hover:border-rose-500/30",
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    },
  ];

  return (
    <section ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest mb-4 block">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Every Page is{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              AI-Enhanced
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Each section has an embedded AI assistant that understands your context
            and generates the right UI components on the fly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={feature.href} className="block group h-full">
                <div
                  className={`relative h-full rounded-3xl bg-gradient-to-br ${feature.gradient} border border-white/[0.06] ${feature.borderColor} p-8 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:-translate-y-1`}
                >
                  {/* Background image */}
                  <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
                    <img
                      src={feature.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
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

/* ─────────────────────── Tambo Showcase ─────────────────────── */
function TamboShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tamboFeatures = [
    {
      title: "Generative UI Components",
      description: "AI selects from 10+ custom React components to render the perfect answer. Firearms cards, comparison tables, ballistics charts, safety checklists, and more.",
      icon: Sparkles,
    },
    {
      title: "Context-Aware Pages",
      description: "Every page sends real-time context to the AI — what you're viewing, your filters, your progress — so responses are always relevant.",
      icon: BookOpen,
    },
    {
      title: "Interactive Tools",
      description: "The AI doesn't just show data — it provides tools. Search firearms, calculate ballistics, look up state laws, all through natural language.",
      icon: Zap,
    },
    {
      title: "Embedded Chat Everywhere",
      description: "Each page has its own AI assistant with page-specific suggestions, ensuring help is always one click away.",
      icon: MessageSquare,
    },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest mb-4 block">
            Built With Tambo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Force of{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Generative UI
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tambo&apos;s SDK powers every interaction — dynamically choosing which
            React components to render based on your conversation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tamboFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative group"
            >
              <div className="relative bg-white/[0.02] rounded-2xl p-8 border border-white/[0.06] hover:border-orange-500/20 transition-all duration-500 hover:bg-white/[0.04]">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-orange-400" />
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

        {/* Demo prompt showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-slate-500 text-sm font-medium">
                AI Chat
              </span>
            </div>
            <div className="p-8 space-y-6">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-orange-500/20 border border-orange-500/20 rounded-2xl rounded-tr-sm px-5 py-3 max-w-sm">
                  <p className="text-white text-sm">
                    Compare the Glock 19 and Sig P320 for concealed carry
                  </p>
                </div>
              </div>
              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-4 max-w-md">
                  <div className="flex items-center gap-2 text-orange-400 text-xs font-medium mb-3">
                    <Sparkles className="w-3 h-3" />
                    Rendering ComparisonTable...
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <div className="font-bold text-white mb-1">Glock 19</div>
                        <div className="text-slate-400">9mm · 15+1 · 1.5 lbs</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <div className="font-bold text-white mb-1">Sig P320</div>
                        <div className="text-slate-400">9mm · 15+1 · 1.6 lbs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── Social Proof / Tech Stack ─────────────────────── */
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
    <section ref={ref} className="relative py-24">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-slate-500 font-medium text-sm uppercase tracking-widest">
            Built With
          </span>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
          {stack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-white text-sm font-semibold">
                  {tech.name}
                </div>
                <div className="text-slate-500 text-xs">{tech.desc}</div>
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
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              Ready to explore?
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Experience AI-Powered
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Firearms Education
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Ask a question, and watch the interface come alive. Every component
              is generated by AI to give you exactly what you need.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-2xl text-lg hover:shadow-[0_0_60px_rgba(251,146,60,0.3)] transition-all duration-300 flex items-center gap-3"
              >
                <MessageSquare className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/safety"
                className="px-10 py-5 bg-white/5 text-white font-semibold rounded-2xl text-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
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
      <HowItWorksSection />
      <FeatureShowcase />
      <TamboShowcaseSection />
      <TechStackSection />
      <CTASection />
    </div>
  );
}
