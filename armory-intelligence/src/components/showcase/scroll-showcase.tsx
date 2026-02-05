/**
 * @file scroll-showcase.tsx
 * @description Apple-style scroll-driven showcase component with storytelling animations
 */

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

// Parallax wrapper component
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

interface FirearmShowcaseProps {
  id: string;
  name: string;
  manufacturer: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  imageUrl?: string;
  accentColor: string;
  reverse?: boolean;
}

function FirearmShowcaseSection({
  id,
  name,
  manufacturer,
  tagline,
  description,
  specs,
  imageUrl,
  accentColor,
  reverse = false,
}: FirearmShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useParallax(scrollYProgress, 100);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [reverse ? 100 : -100, 0, 0, reverse ? -100 : 100]
  );

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${reverse ? "70%" : "30%"} 50%, ${accentColor}40, transparent 70%)`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-12">
        <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}>
          {/* Image/Visual */}
          <motion.div
            style={{ y, scale, opacity }}
            className="flex-1 relative"
          >
            <div className="relative aspect-[4/3] max-w-2xl mx-auto">
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-3xl opacity-30 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              
              {/* Image container */}
              <motion.div
                className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-12">
                    <span className="text-[120px] opacity-30">🔫</span>
                  </div>
                )}
                
                {/* Floating specs */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap">
                  {specs.slice(0, 3).map((spec, i) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg"
                    >
                      <span className="text-xs text-slate-400">{spec.label}</span>
                      <span className="ml-2 text-sm font-bold text-white">{spec.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            style={{ x, opacity }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-sm font-medium tracking-widest uppercase mb-2"
              style={{ color: accentColor }}
            >
              {manufacturer}
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              {name}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-400 mb-6"
            >
              {tagline}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 max-w-lg mx-auto lg:mx-0 mb-8"
            >
              {description}
            </motion.p>

            {/* Specs grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
            >
              {specs.map((spec, i) => (
                <div key={spec.label} className="text-left">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{spec.label}</p>
                  <p className="text-lg font-semibold text-white">{spec.value}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-3 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: accentColor,
                color: "#0f172a",
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Hero Section
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.15), transparent 50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
            AI-Powered Firearms Education
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
        >
          Armory
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-8"
        >
          Discover. Learn. Master.
          <br />
          <span className="text-slate-500">
            The future of firearms education is here.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-orange-500 text-slate-900 font-semibold rounded-full hover:bg-orange-400 transition-colors"
          >
            Start Learning
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
          >
            Explore Catalog
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-orange-500 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Category Section with horizontal scroll
function CategorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const categories = [
    { name: "Handguns", icon: "🔫", count: 15, color: "#f97316" },
    { name: "Rifles", icon: "🎯", count: 18, color: "#22c55e" },
    { name: "Shotguns", icon: "💥", count: 12, color: "#3b82f6" },
    { name: "Historical", icon: "📜", count: 8, color: "#a855f7" },
    { name: "Tactical", icon: "⚔️", count: 10, color: "#ef4444" },
    { name: "Competition", icon: "🏆", count: 7, color: "#eab308" },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          Explore Our Collection
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-center mt-4"
        >
          From classic designs to modern innovations
        </motion.p>
      </div>

      <motion.div style={{ x }} className="flex gap-6 pl-[10%]">
        {[...categories, ...categories].map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -10 }}
            className="flex-shrink-0 w-72 h-80 rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${cat.color}20, transparent)`,
              border: `1px solid ${cat.color}30`,
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 100%, ${cat.color}30, transparent 70%)`,
              }}
            />
            <span className="text-6xl block mb-4">{cat.icon}</span>
            <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
            <p className="text-slate-400">{cat.count} Firearms</p>
            <div
              className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${cat.color}30` }}
            >
              <span style={{ color: cat.color }}>→</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: "500+", label: "Firearms Cataloged", icon: "🔫" },
    { value: "50", label: "States Covered", icon: "🗺️" },
    { value: "100+", label: "Safety Guides", icon: "📋" },
    { value: "24/7", label: "AI Assistance", icon: "🤖" },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <span className="text-4xl block mb-4">{stat.icon}</span>
              <motion.span
                className="text-4xl md:text-5xl font-bold text-white block"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: i * 0.1 }}
              >
                {stat.value}
              </motion.span>
              <span className="text-slate-400 mt-2 block">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: "AI Safety Coach",
      description: "Personalized safety training with real-time guidance and scenario-based learning.",
      icon: "🛡️",
      color: "#22c55e",
    },
    {
      title: "Ballistics Simulator",
      description: "Calculate trajectories, compare calibers, and visualize bullet performance.",
      icon: "📊",
      color: "#3b82f6",
    },
    {
      title: "Legal Navigator",
      description: "Stay compliant with up-to-date regulations for all 50 states.",
      icon: "⚖️",
      color: "#a855f7",
    },
    {
      title: "Maintenance Workshop",
      description: "Step-by-step guides for cleaning, assembly, and troubleshooting.",
      icon: "🔧",
      color: "#f97316",
    },
  ];

  return (
    <section className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need for responsible firearms education
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 0% 0%, ${feature.color}20, transparent 50%)`,
                }}
              />
              <div className="relative z-10">
                <span
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-6"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  {feature.icon}
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of responsible gun owners who trust Armory Intelligence
            for their education needs.
          </p>
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-5 bg-orange-500 text-slate-900 font-bold text-lg rounded-full hover:bg-orange-400 transition-colors"
          >
            Start Learning Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// Main Showcase Component
export function ScrollShowcase() {
  const firearms = [
    {
      id: "glock-19",
      name: "Glock 19 Gen5",
      manufacturer: "Glock",
      tagline: "The Perfect Balance",
      description: "The world's most trusted compact pistol. Engineered for reliability, designed for everyday carry. The Glock 19 has become the gold standard for law enforcement and civilian use worldwide.",
      specs: [
        { label: "Caliber", value: "9mm" },
        { label: "Capacity", value: "15+1" },
        { label: "Weight", value: "1.5 lbs" },
        { label: "Barrel", value: '4.02"' },
      ],
      accentColor: "#f97316",
    },
    {
      id: "sig-p320",
      name: "SIG P320",
      manufacturer: "Sig Sauer",
      tagline: "Modular. Military. Proven.",
      description: "Winner of the U.S. Military's Modular Handgun System competition. The P320's revolutionary serialized trigger group allows unprecedented customization and versatility.",
      specs: [
        { label: "Caliber", value: "9mm" },
        { label: "Capacity", value: "17+1" },
        { label: "Weight", value: "1.6 lbs" },
        { label: "Barrel", value: '3.9"' },
      ],
      accentColor: "#22c55e",
    },
    {
      id: "ar-15",
      name: "M&P15 Sport II",
      manufacturer: "Smith & Wesson",
      tagline: "America's Rifle",
      description: "The AR-15 platform perfected for the modern shooter. Whether for sport, competition, or home defense, the M&P15 delivers uncompromising performance at an accessible price point.",
      specs: [
        { label: "Caliber", value: "5.56 NATO" },
        { label: "Capacity", value: "30+1" },
        { label: "Weight", value: "6.5 lbs" },
        { label: "Barrel", value: '16"' },
      ],
      accentColor: "#3b82f6",
    },
    {
      id: "mossberg-500",
      name: "Mossberg 500",
      manufacturer: "Mossberg",
      tagline: "60 Years of Trust",
      description: "The shotgun that defined home defense. With over 12 million sold, the Mossberg 500's pump-action reliability has protected families and served military units for six decades.",
      specs: [
        { label: "Gauge", value: "12 GA" },
        { label: "Capacity", value: "6+1" },
        { label: "Weight", value: "7.5 lbs" },
        { label: "Barrel", value: '18.5"' },
      ],
      accentColor: "#a855f7",
    },
  ];

  return (
    <div className="bg-slate-950 text-white">
      <HeroSection />
      <CategorySection />
      
      {firearms.map((firearm, i) => (
        <FirearmShowcaseSection
          key={firearm.id}
          {...firearm}
          reverse={i % 2 === 1}
        />
      ))}

      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}

export default ScrollShowcase;
