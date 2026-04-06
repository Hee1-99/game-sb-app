"use client";

import { useGameStore } from "@/lib/store/gameStore";
import {
  Plus, Play, Pause, ChevronRight,
  Settings, UserPlus, Trash2, RotateCcw, Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { 
    teams, 
    config, 
    isLoading,
    initialize,
    addTeam, 
    removeTeam, 
    updateTeamName, 
    updateConfig, 
    updateRoundWeight,
    awardPointsToTeams,
    resetScores,
    startGame,
    pauseGame
  } = useGameStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const [isSetupMode, setIsSetupMode] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-10">
        <div className="text-rose-500 animate-pulse text-3xl font-black italic">LOADING...</div>
      </div>
    );
  }

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName("");
    }
  };

  const toggleWinnerSelection = (id: string) => {
    setSelectedTeamIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleAwardAndNext = () => {
    awardPointsToTeams(selectedTeamIds);
    setSelectedTeamIds([]); 
  };

  const currentRoundPoints = config.round_weights[config.current_round - 1] || 0;

  return (
    <div 
      style={{ backgroundColor: '#0b0e14', color: '#fafafa' }}
      className="min-h-screen p-4 md:p-10 font-sans"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header - Simple & Clean */}
        <section 
          style={{ backgroundColor: 'rgba(22, 27, 34, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          className="rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter italic">GAME CONTROLLER</h1>
            <p className="text-slate-400 mt-2 font-medium">Select winners and manage rounds.</p>
          </div>
          <button 
            onClick={() => setIsSetupMode(!isSetupMode)}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-sm tracking-widest transition-all bg-white/5 border border-white/10 hover:bg-white/10"
          >
            {isSetupMode ? <Check size={20} /> : <Settings size={20} />}
            {isSetupMode ? "SAVE" : "SETTINGS"}
          </button>
        </section>

        {isSetupMode ? (
          /* SETUP VIEW */
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-3 text-violet-400">GAME RULES</h2>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">Total Rounds</label>
                  <input 
                    title="Total Rounds"
                    type="number" 
                    defaultValue={config.total_rounds}
                    onBlur={(e) => updateConfig({ total_rounds: parseInt(e.target.value) })}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 focus:border-rose-500 outline-none text-2xl font-black"
                  />
                </div>
                <button 
                  onClick={() => confirm("Reset all data?") && resetScores()}
                  className="w-full py-4 border-2 border-white/10 rounded-2xl text-xs font-black tracking-widest hover:bg-red-500/10 hover:border-red-500/50"
                >
                  <RotateCcw size={16} className="inline mr-2" /> RESET ENTIRE GAME
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-3 text-rose-500">TEAM ROSTER</h2>
              <form onSubmit={handleAddTeam} className="relative">
                <input 
                  title="Team Name"
                  type="text" 
                  placeholder="Enter Team Name..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-8 py-5 focus:border-rose-500 outline-none text-xl font-bold"
                />
                <button type="submit" className="absolute right-3 top-3 bottom-3 bg-rose-500 hover:bg-rose-600 px-6 rounded-2xl">
                  <Plus size={24} strokeWidth={4} />
                </button>
              </form>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                    <input 
                      title="Edit Name"
                      type="text" 
                      value={team.name}
                      onChange={(e) => updateTeamName(team.id, e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-black text-xl"
                    />
                    <button onClick={() => removeTeam(team.id)} className="text-slate-600 hover:text-rose-500 p-2">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* GAMEPLAY VIEW */
          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Round Info Info */}
              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                className="flex-1 rounded-[2.5rem] p-10 flex flex-wrap items-center justify-around gap-12"
              >
                <div className="text-center">
                  <span className="block text-xs text-slate-500 font-black uppercase tracking-widest mb-2">Round</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-7xl font-black text-violet-500 italic leading-none">{config.current_round}</span>
                    <span className="text-slate-700 text-2xl font-black">/ {config.total_rounds}</span>
                  </div>
                </div>
                
                <div className="w-px h-16 bg-white/10 hidden sm:block" />

                <div className="text-center">
                  <span className="block text-xs text-slate-500 font-black uppercase tracking-widest mb-2">Points</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-7xl font-black text-rose-500 italic leading-none">{currentRoundPoints}</span>
                    <span className="text-slate-700 text-xs font-black uppercase">PTS</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {!config.is_active ? (
                    <button onClick={startGame} className="bg-emerald-500 hover:bg-emerald-400 p-8 rounded-3xl shadow-2xl shadow-emerald-500/30 transition-all text-white">
                      <Play size={40} fill="currentColor" />
                    </button>
                  ) : (
                    <button onClick={pauseGame} className="bg-amber-500 hover:bg-amber-400 p-8 rounded-3xl shadow-2xl shadow-amber-500/30 transition-all text-black">
                      <Pause size={40} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>

              {/* Award Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAwardAndNext}
                disabled={!config.is_active || selectedTeamIds.length === 0}
                style={{
                  backgroundColor: config.is_active && selectedTeamIds.length > 0 ? '#f43f5e' : 'rgba(255, 255, 255, 0.05)',
                  color: config.is_active && selectedTeamIds.length > 0 ? '#fff' : 'rgba(255, 255, 255, 0.2)'
                }}
                className="lg:w-80 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black italic tracking-tighter">AWARD POINTS</span>
                  <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Complete Round</span>
              </motion.button>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
              {teams.map((team) => {
                const isSelected = selectedTeamIds.includes(team.id);
                return (
                  <motion.button
                    key={team.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => config.is_active && toggleWinnerSelection(team.id)}
                    disabled={!config.is_active}
                    style={{
                      backgroundColor: isSelected ? '#f43f5e' : 'rgba(22, 27, 34, 0.7)',
                      borderColor: isSelected ? '#fb7185' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff'
                    }}
                    className="relative p-10 rounded-[3rem] border-4 transition-all text-left flex flex-col justify-between h-72 shadow-xl"
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl"
                      >
                        {team.name.charAt(0)}
                      </div>
                      <div className="text-5xl font-black italic tracking-tighter tabular-nums text-white">
                        {team.total_score}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter truncate leading-tight mb-2">
                        {team.name}
                      </h3>
                      <p className="text-[11px] font-black tracking-[0.2em] uppercase opacity-60">
                        {isSelected ? "WINNER SELECTED" : "CLICK TO CHOOSE"}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-8 right-8 bg-white text-rose-500 rounded-full p-2 shadow-2xl">
                        <Check size={20} strokeWidth={5} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
