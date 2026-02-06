import ScrollShowcase from "@/components/showcase/scroll-showcase";
import { Navigation } from "@/components/showcase/navigation";
import { SmoothScrollProvider } from "@/components/showcase/smooth-scroll-provider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navigation />
      <ScrollShowcase />
      
      {/* Footer */}
      <footer className="relative bg-slate-950 border-t border-white/[0.06]">
        {/* Gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <span className="text-lg font-black text-slate-950">AI</span>
                </div>
                <span className="font-bold text-white text-lg">Armory Intelligence</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                AI-Powered Firearms Education Platform for Responsible Ownership.
                Built with Tambo Generative UI SDK.
              </p>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-400 text-xs font-medium">Powered by Tambo</span>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Features</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/catalog" className="hover:text-orange-400 transition-colors">Catalog</a></li>
                <li><a href="/safety" className="hover:text-orange-400 transition-colors">Safety Guides</a></li>
                <li><a href="/ballistics" className="hover:text-orange-400 transition-colors">Ballistics</a></li>
                <li><a href="/regulations" className="hover:text-orange-400 transition-colors">Regulations</a></li>
                <li><a href="/maintenance" className="hover:text-orange-400 transition-colors">Maintenance</a></li>
              </ul>
            </div>
            
            {/* AI */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">AI Features</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/chat" className="hover:text-orange-400 transition-colors">AI Assistant</a></li>
                <li><a href="/interactables" className="hover:text-orange-400 transition-colors">Interactables</a></li>
                <li><span className="text-slate-600">Generative UI</span></li>
                <li><span className="text-slate-600">Context-Aware Chat</span></li>
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
          
          <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2025 Armory Intelligence. For educational purposes only.
            </p>
            <p className="text-slate-700 text-xs">
              Always consult local laws and certified instructors for firearms training.
            </p>
          </div>
        </div>
      </footer>
    </SmoothScrollProvider>
  );
}
