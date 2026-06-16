import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Progress, Settings } from '../types/progress';

interface ProgressStore extends Progress {
  recordSolve: (levelId: string, stars: number, moves: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  reset: () => void;
}

const defaultSettings: Settings = {
  sound: true,
  haptics: true,
  reduceMotion: false,
  liveCheck: false,
};

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      version: 1,
      solvedLevels: {},
      settings: defaultSettings,
      recordSolve: (levelId, stars, moves) =>
        set((s) => {
          const prev = s.solvedLevels[levelId];
          const bestStars = Math.max(stars, prev?.stars ?? 0);
          const bestMoves = Math.min(moves, prev?.bestMoves ?? Infinity);
          return {
            solvedLevels: {
              ...s.solvedLevels,
              [levelId]: { stars: bestStars, bestMoves, ts: Date.now() },
            },
          };
        }),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      reset: () => set({ solvedLevels: {}, settings: defaultSettings }),
    }),
    { name: 'bz_progress_v1' },
  ),
);

/** A level is unlocked if it's the first in its chapter or the previous one is solved. */
export const isLevelUnlocked = (
  levelIds: string[],
  index: number,
  solved: Record<string, unknown>,
): boolean => index === 0 || levelIds[index - 1] in solved;
