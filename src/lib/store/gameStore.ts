import { create } from 'zustand';
import { supabase } from '../supabase/client';

export interface Team {
  id: string;
  name: string;
  total_score: number;
}

export interface GameConfig {
  id?: string;
  current_round: number;
  total_rounds: number;
  round_weights: number[];
  is_active: boolean;
}

interface GameState {
  teams: Team[];
  config: GameConfig;
  isLoading: boolean;
  
  // Initialization & Sync
  initialize: () => Promise<void>;
  
  // Setup Actions
  addTeam: (name: string) => Promise<void>;
  removeTeam: (id: string) => Promise<void>;
  updateTeamName: (id: string, name: string) => Promise<void>;
  updateConfig: (newConfig: Partial<GameConfig>) => Promise<void>;
  updateRoundWeight: (roundIndex: number, points: number) => Promise<void>;
  resetScores: () => Promise<void>;
  
  // Gameplay Actions
  awardPointsToTeams: (teamIds: string[]) => Promise<void>;
  updateTeamScore: (teamId: string, amount: number) => Promise<void>;
  startGame: () => Promise<void>;
  pauseGame: () => Promise<void>;
}

let hasInitializedRealtime = false;
let mutationDepth = 0;
let hasPendingRealtimeSync = false;
let syncRequestVersion = 0;
let appliedSyncVersion = 0;
let awardPointsQueue: Promise<void> = Promise.resolve();

async function fetchLatestSnapshot() {
  const [{ data: configData, error: configError }, { data: teamsData, error: teamsError }] = await Promise.all([
    supabase.from('game_config').select('*').single(),
    supabase.from('teams').select('*').order('created_at', { ascending: true }),
  ]);

  if (configError) throw configError;
  if (teamsError) throw teamsError;

  return {
    config: configData,
    teams: teamsData ?? [],
  };
}

async function syncSnapshot(
  set: (partial: Partial<GameState>) => void,
  options?: { deferDuringMutation?: boolean }
) {
  const requestVersion = ++syncRequestVersion;
  const snapshot = await fetchLatestSnapshot();

  if (requestVersion < appliedSyncVersion) {
    return;
  }

  if (mutationDepth > 0 && options?.deferDuringMutation !== false) {
    hasPendingRealtimeSync = true;
    return;
  }

  appliedSyncVersion = requestVersion;
  set(snapshot);
}

function beginMutation() {
  mutationDepth += 1;
}

async function endMutation(set: (partial: Partial<GameState>) => void) {
  mutationDepth = Math.max(0, mutationDepth - 1);

  if (mutationDepth === 0 && hasPendingRealtimeSync) {
    hasPendingRealtimeSync = false;
    await syncSnapshot(set, { deferDuringMutation: false });
  }
}

async function updateTeamScoreWithRetry(teamId: string, amount: number, initialScore?: number) {
  let expectedScore = initialScore;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (expectedScore === undefined) {
      const { data, error } = await supabase
        .from('teams')
        .select('total_score')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      expectedScore = data.total_score;
    }

    if (expectedScore === undefined) {
      throw new Error(`Missing current score for team ${teamId}.`);
    }

    const nextScore = Math.max(0, expectedScore + amount);
    const { data, error } = await supabase
      .from('teams')
      .update({ total_score: nextScore })
      .eq('id', teamId)
      .eq('total_score', expectedScore)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (data) return nextScore;

    expectedScore = undefined;
  }

  throw new Error(`Failed to update score for team ${teamId} after retries.`);
}

export const useGameStore = create<GameState>((set, get) => ({
  teams: [],
  config: { 
    current_round: 1, 
    total_rounds: 10, 
    round_weights: Array(10).fill(10),
    is_active: false 
  },
  isLoading: true,

  initialize: async () => {
    try {
      await syncSnapshot(set, { deferDuringMutation: false });
    } finally {
      set({ isLoading: false });
    }

    if (hasInitializedRealtime) {
      return;
    }

    hasInitializedRealtime = true;

    supabase
      .channel('game_db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, async () => {
        await syncSnapshot(set);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_config' }, async () => {
        await syncSnapshot(set);
      })
      .subscribe();
  },

  addTeam: async (name) => {
    // Optimistic insert NOT recommended for teams due to UUID generation, 
    // but the Realtime subscription will handle it quickly.
    await supabase.from('teams').insert([{ name, total_score: 0 }]);
  },

  removeTeam: async (id) => {
    // Optimistic update
    set((state) => ({ teams: state.teams.filter(t => t.id !== id) }));
    await supabase.from('teams').delete().eq('id', id);
  },

  updateTeamName: async (id, name) => {
    // Optimistic update
    set((state) => ({
      teams: state.teams.map(t => t.id === id ? { ...t, name } : t)
    }));
    await supabase.from('teams').update({ name }).eq('id', id);
  },

  updateConfig: async (newConfig) => {
    const { config } = get();
    const updatedConfig = { ...config, ...newConfig };

    // Handle round_weights array resizing
    if (newConfig.total_rounds && newConfig.total_rounds !== config.total_rounds) {
      const diff = newConfig.total_rounds - config.round_weights.length;
      if (diff > 0) {
        updatedConfig.round_weights = [...config.round_weights, ...Array(diff).fill(10)];
      } else if (diff < 0) {
        updatedConfig.round_weights = config.round_weights.slice(0, newConfig.total_rounds);
      }
    }

    // Optimistic update
    set({ config: updatedConfig });
    
    // DB Update
    const { id, ...payload } = updatedConfig;
    const { error } = await supabase.from('game_config').update(payload).eq('id', config.id);
    if (error) console.error("Update Config Error:", error);
  },

  updateRoundWeight: async (index, pts) => {
    const { config } = get();
    const newWeights = [...config.round_weights];
    newWeights[index] = pts;
    
    // Optimistic update
    set({ config: { ...config, round_weights: newWeights } });
    
    const { error } = await supabase.from('game_config').update({ round_weights: newWeights }).eq('id', config.id);
    if (error) console.error("Update Weight Error:", error);
  },

  resetScores: async () => {
    const { config, teams } = get();
    // Optimistic update
    set({
      teams: teams.map(t => ({ ...t, total_score: 0 })),
      config: { ...config, current_round: 1, is_active: false }
    });

    beginMutation();

    try {
      await supabase.from('teams').update({ total_score: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('game_config').update({ current_round: 1, is_active: false }).eq('id', config.id);
      await syncSnapshot(set, { deferDuringMutation: false });
    } finally {
      await endMutation(set);
    }
  },

  awardPointsToTeams: async (teamIds) => {
    const runAward = async () => {
      const { config, teams } = get();
      const uniqueTeamIds = [...new Set(teamIds)];

      if (uniqueTeamIds.length === 0) return;

      const currentWeight = config.round_weights[config.current_round - 1] || 0;
      const nextRound = Math.min(config.total_rounds + 1, config.current_round + 1);

      // Optimistic UI update for the local controller.
      set({
        teams: teams.map(t =>
          uniqueTeamIds.includes(t.id) ? { ...t, total_score: t.total_score + currentWeight } : t
        ),
        config: { ...config, current_round: nextRound }
      });

      beginMutation();

      try {
        await Promise.all(
          uniqueTeamIds.map(async (id) => {
            const team = teams.find(t => t.id === id);
            if (!team) return;

            await updateTeamScoreWithRetry(id, currentWeight, team.total_score);

            const { error: scoreLogError } = await supabase.from('score_logs').insert([{
              team_id: id,
              round_number: config.current_round,
              points_awarded: currentWeight
            }]);

            if (scoreLogError) throw scoreLogError;
          })
        );

        const { data: updatedConfig, error: configError } = await supabase
          .from('game_config')
          .update({ current_round: nextRound })
          .eq('id', config.id)
          .eq('current_round', config.current_round)
          .select('id')
          .maybeSingle();

        if (configError) throw configError;
        if (!updatedConfig) {
          throw new Error('Round update conflict detected while awarding points.');
        }

        await syncSnapshot(set, { deferDuringMutation: false });
      } catch (error) {
        console.error('Award Points Error:', error);
        await syncSnapshot(set, { deferDuringMutation: false });
      } finally {
        await endMutation(set);
      }
    };

    awardPointsQueue = awardPointsQueue.then(runAward, runAward);
    return awardPointsQueue;
  },

  updateTeamScore: async (teamId, amount) => {
    const team = get().teams.find(t => t.id === teamId);
    if (team) {
      // Optimistic update
      set((state) => ({
        teams: state.teams.map(t => t.id === teamId ? { ...t, total_score: Math.max(0, t.total_score + amount) } : t)
      }));
      await updateTeamScoreWithRetry(teamId, amount, team.total_score);
    }
  },

  startGame: async () => {
    const { config } = get();
    set({ config: { ...config, is_active: true } });
    await supabase.from('game_config').update({ is_active: true }).eq('id', config.id);
  },

  pauseGame: async () => {
    const { config } = get();
    set({ config: { ...config, is_active: false } });
    await supabase.from('game_config').update({ is_active: false }).eq('id', config.id);
  },
}));
