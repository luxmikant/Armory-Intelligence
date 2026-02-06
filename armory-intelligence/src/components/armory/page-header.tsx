/**
 * @file page-header.tsx
 * @description Shared page header component for all sub-pages
 * Provides consistent navigation with page-specific accent color
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PageHeaderProps {
  /** Current page name displayed as breadcrumb */
  pageName: string;
  /** Tailwind text color class for the page accent */
  accentColor?: string;
}

const navLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/safety", label: "Safety" },
  { href: "/ballistics", label: "Ballistics" },
  { href: "/regulations", label: "Regulations" },
  { href: "/maintenance", label: "Maintenance" },
];

export function PageHeader({ pageName, accentColor = "text-orange-400" }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-xs font-black text-slate-950">AI</span>
              </div>
              <span className="font-bold text-white text-sm hidden sm:block group-hover:text-orange-300 transition-colors">
                Armory Intelligence
              </span>
            </Link>
            <span className="text-slate-700 text-lg font-light">/</span>
            <span className={`${accentColor} font-semibold text-sm`}>{pageName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                  link.label === pageName
                    ? "text-white bg-white/[0.08]"
                    : "text-slate-500 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="ml-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.3)] transition-all"
            >
              AI Chat
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

export default PageHeader;
