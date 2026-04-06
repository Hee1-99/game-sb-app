import Link from "next/link";
import { MoveRight, Monitor, Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0B0E14] overflow-hidden flex flex-col items-center justify-center p-6 text-[#FAFAFA]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 blur-[120px] rounded-full" />

      {/* Hero Header */}
      <div className="relative z-10 text-center mb-16 space-y-4">
        <h2 className="text-rose-500 font-bold tracking-[0.3em] text-sm uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
          Digital Performance Suite
        </h2>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
          MIDNIGHT<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700 underline decoration-rose-500/30 underline-offset-8">ENERGY</span>
        </h1>
        <p className="text-zinc-500 text-lg max-w-md mx-auto font-medium tracking-tight opacity-80">
          High-performance real-time scoreboard & state management for competitive gaming environments.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        {/* Viewer Card */}
        <Link href="/viewer" className="group">
          <div className="relative h-full p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:border-rose-500/50 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Monitor size={120} />
            </div>
            <div className="relative space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:scale-110 transition-transform">
                <Monitor size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Live Viewer</h3>
                <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Public dashboard with real-time score updates and 1st place highlighting.
                </p>
              </div>
              <div className="flex items-center gap-2 text-rose-500 font-bold tracking-tight">
                ENTER STREAM <MoveRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* Admin Card */}
        <Link href="/admin" className="group">
          <div className="relative h-full p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:border-zinc-500/50 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings size={120} />
            </div>
            <div className="relative space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Admin Console</h3>
                <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Secure control room for real-time score editing and game resets.
                </p>
              </div>
              <div className="flex items-center gap-2 text-white font-bold tracking-tight opacity-60 group-hover:opacity-100 transition-all">
                MANAGE STATE <MoveRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

      </div>

      {/* Footer Branding */}
      <div className="mt-20 opacity-30 font-bold tracking-widest text-xs uppercase animate-pulse">
        Powered by Antigravity Orchestration v1.0
      </div>
    </main>
  );
}
