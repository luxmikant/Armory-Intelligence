import ScrollShowcase from "@/components/showcase/scroll-showcase-new";
import { Navigation } from "@/components/showcase/navigation";
import { SmoothScrollProvider } from "@/components/showcase/smooth-scroll-provider";
import Image from "next/image";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navigation />
      <ScrollShowcase />
      
      {/* Weapon Comparison Section */}
      <section className="relative bg-[#030305] py-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <span className="text-orange-400 text-sm font-medium">⚡ Featured Matchups</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Epic Weapon <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">Showdowns</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              See how Star Wars weapons stack up against their real-world counterparts
            </p>
          </div>

          {/* Comparison cards grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* E-11 vs M4A1 */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm overflow-hidden hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-6">
                {/* Sci-Fi weapon */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Sci-Fi</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">E-11 Blaster Rifle</h3>
                  <p className="text-slate-500 text-sm mb-4">Imperial Standard</p>
                  <div className="relative h-32 mb-3 flex items-center justify-center">
                    <Image 
                      src="/images/weapons/e11-blaster.jpg" 
                      alt="E-11 Blaster Rifle"
                      width={200}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-cyan-400 to-cyan-500" />
                  </div>
                </div>

                <div className="h-8 flex items-center justify-center">
                  <span className="text-slate-600 font-mono text-sm">VS</span>
                </div>

                {/* Real weapon */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Real</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">M4A1 Carbine</h3>
                  <p className="text-slate-500 text-sm mb-4">Modern Military</p>
                  <div className="relative h-32 mb-3 flex items-center justify-center">
                    <Image 
                      src="/images/weapons/m4a1-carbine.jpg" 
                      alt="M4A1 Carbine"
                      width={200}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-orange-400 to-orange-500" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-slate-400 text-sm italic">
                    &quot;The E-11&apos;s plasma bolts vs kinetic rounds — which delivers more tactical value?&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* DL-44 vs .44 Magnum */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm overflow-hidden hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-6">
                {/* Sci-Fi weapon */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Sci-Fi</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">DL-44 Heavy Blaster</h3>
                  <p className="text-slate-500 text-sm mb-4">Galactic Civil War</p>
                  <div className="relative h-32 mb-3 flex items-center justify-center">
                    <Image 
                      src="/images/weapons/dl44-blaster.jpg" 
                      alt="DL-44 Heavy Blaster"
                      width={200}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[88%] bg-gradient-to-r from-cyan-400 to-cyan-500" />
                  </div>
                </div>

                <div className="h-8 flex items-center justify-center">
                  <span className="text-slate-600 font-mono text-sm">VS</span>
                </div>

                {/* Real weapon */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Real</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">.44 Magnum</h3>
                  <p className="text-slate-500 text-sm mb-4">Classic Revolver</p>
                  <div className="relative h-32 mb-3 flex items-center justify-center">
                    <Image 
                      src="/images/weapons/44-magnum.jpg" 
                      alt=".44 Magnum"
                      width={200}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-orange-400 to-orange-500" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-slate-400 text-sm italic">
                    &quot;Han Solo&apos;s iconic sidearm against the most powerful handgun of its era.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Lightsaber vs Combat Knife */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm overflow-hidden hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-6">
                {/* Sci-Fi weapon */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Sci-Fi</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Lightsaber</h3>
                  <p className="text-slate-500 text-sm mb-4">Jedi Order</p>
                  <div className="relative h-32 mb-3 flex items-center justify-center">
                    <Image 
                      src="/images/weapons/lightsaber.jpg" 
                      alt="Lightsaber"
                      width={200}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-cyan-400 to-cyan-500" />
                  </div>
                </div>

                <div className="h-8 flex items-center justify-center">
                  <span className="text-slate-600 font-mono text-sm">VS</span>
                </div>

                {/* Real weapon */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Real</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Combat Knife</h3>
                  <p className="text-slate-500 text-sm mb-4">Modern CQC</p>
                  <div className="relative h-32 mb-3 flex items-center justify-center">
                    <Image 
                      src="/images/weapons/kabar-knife.jpg" 
                      alt="Combat Knife"
                      width={200}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-orange-400 to-orange-500" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-slate-400 text-sm italic">
                    &quot;The ultimate melee weapon comparison — plasma blade vs tempered steel.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <a 
              href="/catalog" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group"
            >
              <span>Explore Full Arsenal</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
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
