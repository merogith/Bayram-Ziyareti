import { create } from 'zustand';
import type { Assignment, Level, ValidationResult } from '../types/puzzle';
import { makeContext, type EvalContext } from '../engine/clues';
import { validate } from '../engine/validate';

interface GameState {
  level: Level | null;
  ctx: EvalContext | null;
  assignment: Assignment;
  moves: number;
  result: ValidationResult | null;

  load: (level: Level) => void;
  /** Place a person into a slot (or back to the tray when slotId is null). */
  place: (personId: string, slotId: string | null) => void;
  reset: () => void;
}

export const useGame = create<GameState>((set, get) => ({
  level: null,
  ctx: null,
  assignment: {},
  moves: 0,
  result: null,

  load: (level) => {
    const ctx = makeContext(level);
    set({ level, ctx, assignment: {}, moves: 0, result: validate(level, {}, ctx) });
  },

  place: (personId, slotId) => {
    const { level, ctx, assignment } = get();
    if (!level || !ctx) return;

    const next: Assignment = { ...assignment };

    // Remove this person from wherever they currently sit.
    for (const [sId, pId] of Object.entries(next)) {
      if (pId === personId) delete next[sId];
    }

    if (slotId) {
      // If the target slot is occupied, that person returns to the tray.
      if (next[slotId]) delete next[slotId];
      next[slotId] = personId;
    }

    set({
      assignment: next,
      moves: get().moves + 1,
      result: validate(level, next, ctx),
    });
  },

  reset: () => {
    const { level, ctx } = get();
    if (!level || !ctx) return;
    set({ assignment: {}, moves: 0, result: validate(level, {}, ctx) });
  },
}));
