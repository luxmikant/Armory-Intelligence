"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { ClientOnly } from "@/components/client-only";
import Link from "next/link";
import { useState } from "react";

type ThemeMode = "empire" | "rebellion" | "tactical";

const themeConfig: Record<ThemeMode, { label: string; icon: string; accent: string; glow: string; badge: string }> = {
  empire: {
    label: "Empire",
    icon: "⚡",
    accent: "from-red-500 to-red-600",
    glow: "shadow-red-500/20",
    badge: "bg-red-500/10 border-red-500/20 text-red-400",
  },
  rebellion: {
    label: "Rebellion",
    icon: "✦",
    accent: "from-orange-500 to-amber-400",
    glow: "shadow-orange-500/20",
    badge: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  },
  tactical: {
    label: "Tactical",
    icon: "◆",
    accent: "from-green-500 to-emerald-400",
    glow: "shadow-green-500/20",
    badge: "bg-green-500/10 border-green-500/20 text-green-400",
  },
};

/**
 * Chat page with full Tambo AI interface.
 * Arsenal Nexus — Star Wars × Modern Military
 */
export default function Home() {
  const mcpServers = useMcpServers();
  const [theme, setTheme] = useState<ThemeMode>("rebellion");
  const t = themeConfig[theme];

  const cycleTheme = () => {
    const modes: ThemeMode[] = ["empire", "rebellion", "tactical"];
    const next = modes[(modes.indexOf(theme) + 1) % modes.length];
    setTheme(next);
  };

  return (
    <ClientOnly>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        mcpServers={mcpServers}
      >
        <div className="h-screen flex flex-col bg-[#0a0a12]">
          {/* Slim header with theme-aware gradient */}
          <header className="relative flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl flex-shrink-0">
            {/* Top gradient line */}
            <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-40`}
              style={{ color: theme === "empire" ? "#ef4444" : theme === "tactical" ? "#22c55e" : "#f97316" }}
            />
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.accent} flex items-center justify-center shadow-lg ${t.glow}`}>
                <span className="text-sm font-black text-white drop-shadow-md">AN</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm group-hover:text-orange-300 transition-colors leading-tight">
                  Arsenal Nexus
                </span>
                <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] leading-tight">
                  Sci-Fi × Real World
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {/* Nav links */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { href: "/catalog", label: "Catalog" },
                  { href: "/safety", label: "Safety" },
                  { href: "/ballistics", label: "Ballistics" },
                  { href: "/regulations", label: "Regulations" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-500 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Theme switcher */}
              <button
                onClick={cycleTheme}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${t.badge}`}
                title="Switch theme"
              >
                <span className="text-sm">{t.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
              </button>

              {/* AI status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 text-[10px] font-medium">Tambo AI</span>
              </div>
            </div>
          </header>

          {/* Chat area */}
          <div className="flex-1 overflow-hidden">
            <MessageThreadFull />
          </div>
        </div>
      </TamboProvider>
    </ClientOnly>
  );
}
