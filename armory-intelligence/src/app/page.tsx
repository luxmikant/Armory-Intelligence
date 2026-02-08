import ScrollShowcase from "@/components/showcase/scroll-showcase-new";
import { Navigation } from "@/components/showcase/navigation";
import { SmoothScrollProvider } from "@/components/showcase/smooth-scroll-provider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navigation />
      <ScrollShowcase />
      
      {/* Footer */}
      <footer className="relative bg-[#030305] border-t border-white/[0.04]">
        {/* Gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <span className="text-lg font-black text-white">AN</span>
                </div>
                <div>
                  <span className="font-bold text-white text-lg block leading-tight">Arsenal Nexus</span>
                  <span className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Sci-Fi × Real World</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                Where the Galaxy Far, Far Away meets modern military engineering.
                Compare Star Wars blasters to real-world firearms — powered by Tambo AI.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 w-fit">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-xs font-medium">Tambo AI</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
                  <span className="text-orange-400 text-xs font-medium">⚡ Real-time</span>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/catalog" className="hover:text-orange-400 transition-colors">Weapon Catalog</a></li>
                <li><a href="/safety" className="hover:text-orange-400 transition-colors">Safety Guides</a></li>
                <li><a href="/ballistics" className="hover:text-orange-400 transition-colors">Ballistics Lab</a></li>
                <li><a href="/regulations" className="hover:text-orange-400 transition-colors">Regulations</a></li>
                <li><a href="/maintenance" className="hover:text-orange-400 transition-colors">Maintenance</a></li>
              </ul>
            </div>
            
            {/* AI */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">AI Features</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/chat" className="hover:text-cyan-400 transition-colors">⚡ AI Chat &amp; Showdowns</a></li>
                <li><a href="/interactables" className="hover:text-cyan-400 transition-colors">Interactable Demo</a></li>
                <li><span className="text-slate-600">Hologram Cards</span></li>
                <li><span className="text-slate-600">Weapon Showdowns</span></li>
                <li><span className="text-slate-600">Tactical Briefings</span></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><span className="text-slate-600">Educational Only</span></li>
                <li><span className="text-slate-600">Not Legal Advice</span></li>
                <li><span className="text-slate-600">Consult Local Laws</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2026 Arsenal Nexus. For educational purposes only.
            </p>
            <p className="text-slate-700 text-xs">
              Star Wars is a trademark of Lucasfilm Ltd. This is an educational/demo project.
            </p>
          </div>
        </div>
      </footer>
    </SmoothScrollProvider>
  );
}
