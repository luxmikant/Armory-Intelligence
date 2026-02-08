"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { ClientOnly } from "@/components/client-only";
import Link from "next/link";

/**
 * Chat page with full Tambo AI interface.
 * This is the crown jewel — full Generative UI chat experience.
 */
export default function Home() {
  const mcpServers = useMcpServers();

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
          {/* Slim header with gradient accent */}
          <header className="relative flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl flex-shrink-0">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-xs font-black text-slate-950">AI</span>
              </div>
              <span className="font-bold text-white text-sm group-hover:text-orange-300 transition-colors">
                Armory Intelligence
              </span>
            </Link>

            <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-400 text-[10px] font-medium">Tambo AI</span>
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
