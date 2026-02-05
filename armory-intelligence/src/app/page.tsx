import ScrollShowcase from "@/components/showcase/scroll-showcase";
import { Navigation } from "@/components/showcase/navigation";
import { SmoothScrollProvider } from "@/components/showcase/smooth-scroll-provider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navigation />
      <ScrollShowcase />
      
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-xl">🔫</span>
                </div>
                <span className="font-bold text-white">Armory Intelligence</span>
              </div>
              <p className="text-slate-500 text-sm">
                AI-Powered Firearms Education Platform for Responsible Ownership
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/catalog" className="hover:text-orange-400">Catalog</a></li>
                <li><a href="/safety" className="hover:text-orange-400">Safety Guides</a></li>
                <li><a href="/ballistics" className="hover:text-orange-400">Ballistics</a></li>
                <li><a href="/regulations" className="hover:text-orange-400">Regulations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/chat" className="hover:text-orange-400">AI Assistant</a></li>
                <li><a href="/quiz" className="hover:text-orange-400">Safety Quiz</a></li>
                <li><a href="/maintenance" className="hover:text-orange-400">Maintenance</a></li>
                <li><a href="/history" className="hover:text-orange-400">History</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/privacy" className="hover:text-orange-400">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-orange-400">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-orange-400">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 Armory Intelligence. For educational purposes only.
            </p>
            <p className="text-slate-600 text-xs">
              Always consult local laws and certified instructors for firearms training.
            </p>
          </div>
        </div>
      </footer>
    </SmoothScrollProvider>
  );
}
