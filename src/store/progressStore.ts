import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Assignment } from '../types/puzzle';
import type { Progress, Settings } from '../types/progress';

export interface Draft {
  assignment: Assignment;
  moves: number;
  hints: number;
}
interface ProgressStore extends Progress {
  drafts: Record<string, Draft>;
  hasSeenInstructions: boolean;
  acknowledgeInstructions: () => void;
  saveDraft: (levelId: string, draft: Draft) => void;
  clearDraft: (levelId: string) => void;
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
export const progressStorageAvailable = (() => {
  try {
    localStorage.setItem('bz_storage_check', '1');
    localStorage.removeItem('bz_storage_check');
    return true;
  } catch {
    return false;
  }
})();
// Blocked storage must never prevent someone from playing. Zustand keeps the
// active state in memory; this adapter quietly falls back to that session.
const storage = createJSONStorage(() => ({
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* session only */
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* session only */
    }
  },
}));

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      version: 1,
      solvedLevels: {},
      drafts: {},
      settings: defaultSettings,
      hasSeenInstructions: false,
      acknowledgeInstructions: () => set({ hasSeenInstructions: true }),
      saveDraft: (levelId, draft) => set((s) => ({ drafts: { ...s.drafts, [levelId]: draft } })),
      clearDraft: (levelId) =>
        set((s) => {
          const drafts = { ...s.drafts };
          delete drafts[levelId];
          return { drafts };
        }),
      recordSolve: (levelId, stars, moves) =>
        set((s) => {
          const prev = s.solvedLevels[levelId];
          const drafts = { ...s.drafts };
          delete drafts[levelId];
          return {
            drafts,
            solvedLevels: {
              ...s.solvedLevels,
              [levelId]: {
                stars: Math.max(stars, prev?.stars ?? 0),
                bestMoves: Math.min(moves, prev?.bestMoves ?? Infinity),
                ts: Date.now(),
              },
            },
          };
        }),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      reset: () =>
        set({
          solvedLevels: {},
          drafts: {},
          settings: defaultSettings,
          hasSeenInstructions: false,
        }),
    }),
    { name: 'bz_progress_v1', storage },
  ),
);

export const isLevelUnlocked = (
  levelIds: string[],
  index: number,
  solved: Record<string, unknown>,
): boolean => index === 0 || levelIds[index - 1] in solved;
