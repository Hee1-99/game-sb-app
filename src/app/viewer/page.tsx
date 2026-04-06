"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import ScoreCard from "@/components/ui/ScoreCard";

export default function ViewerDashboard() {
  const { teams, config, isLoading, initialize } = useGameStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-rose-500 animate-pulse text-2xl font-black italic tracking-tighter">
          SYNCHRONIZING GAME STATE...
        </div>
      </div>
    );
  }

  const sortedTeams = [...teams].sort((a, b) => b.total_score - a.total_score);
  const currentRoundPoints = config.round_weights[config.current_round - 1] || 0;

  return (
    <div 
      style={{ backgroundColor: '#0B0E14', color: '#fafafa' }}
      className="min-h-screen p-6 md:p-12 flex flex-col font-sans overflow-hidden"
    >
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2">
            SCORE<span className="text-rose-500">FLOW</span>
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">Real-time Multiteam Scoreboard</p>
        </div>

        <div className="flex gap-6">
          <div className="glass-card px-8 py-4 flex flex-col items-center border-white/5">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Round</span>
            <span className="text-4xl font-black text-violet-500 italic">
              {config.current_round} <span className="text-slate-700 text-xl not-italic">/ {config.total_rounds}</span>
            </span>
          </div>
          <div className="glass-card px-8 py-4 flex flex-col items-center border-rose-500/20 bg-rose-500/5">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Round Power</span>
            <span className="text-4xl font-black text-rose-500 italic">
              {currentRoundPoints} <span className="text-lg not-italic opacity-50">PTS</span>
            </span>
          </div>
          <div className="glass-card px-8 py-4 flex flex-col items-center border-white/5">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Board Status</span>
            <span className={`text-xl font-black mt-1 ${config.is_active ? 'text-emerald-500' : 'text-amber-500'}`}>
              {config.is_active ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
            {/* Game Status Indicators only (Viewer only) */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
              config.is_active 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              {config.is_active ? 'Live Session' : 'Session Paused'}
            </div>
          </div>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto">
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {sortedTeams.map((team, index) => (
              <ScoreCard
                key={team.id}
                layoutId={team.id}
                name={team.name}
                score={team.total_score}
                rank={index + 1}
                isFirst={index === 0 && team.total_score > 0}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 mt-12 text-center">
        <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          Powered by Supabase Realtime & Midnight Energy Design
        </p>
      </footer>
    </div>
  );
}
