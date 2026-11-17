import { create } from 'zustand';
import type { Assignment, Level, ValidationResult } from '../types/puzzle';
import { makeContext, type EvalContext } from '../engine/clues';
import { validate } from '../engine/validate';
import { useProgress } from './progressStore';

interface GameState {
  level: Level | null;
  ctx: EvalContext | null;
  assignment: Assignment;
  moves: number;
  hints: number;
  result: ValidationResult | null;
  load: (level: Level) => void;
  /** Invalid/fixed targets leave the board untouched. Occupied slots swap. */
  place: (personId: string, slotId: string | null) => boolean;
  hint: () => string | null;
  reset: () => void;
}

export const useGame = create<GameState>((set, get) => ({
  level: null,
  ctx: null,
  assignment: {},
  moves: 0,
  hints: 0,
  result: null,
  load: (level) => {
    const ctx = makeContext(level);
    const draft = useProgress.getState().drafts[level.id];
    const assignment: Assignment = {};
    const used = new Set<string>();
    // Accept only valid, movable people and slots from saved drafts.
    for (const [slotId, personId] of Object.entries(draft?.assignment ?? {})) {
      if (
        level.slots.some((s) => s.id === slotId && !s.fixedPersonId) &&
        level.people.some((p) => p.id === personId) &&
        !level.slots.some((s) => s.fixedPersonId === personId) &&
        !used.has(personId)
      ) {
        assignment[slotId] = personId;
        used.add(personId);
      }
    }
    set({
      level,
      ctx,
      assignment,
      moves: draft?.moves ?? 0,
      hints: draft?.hints ?? 0,
      result: validate(level, assignment, ctx),
    });
  },
  place: (personId, slotId) => {
    const { level, ctx, assignment, moves, hints } = get();
    if (
      !level ||
      !ctx ||
      !level.people.some((p) => p.id === personId) ||
      level.slots.some((s) => s.fixedPersonId === personId)
    )
      return false;
    if (slotId !== null && !level.slots.some((s) => s.id === slotId && !s.fixedPersonId))
      return false;
    const previous = Object.keys(assignment).find((s) => assignment[s] === personId);
    if (previous === slotId || (!previous && slotId === null)) return false;
    const next = { ...assignment };
    const displaced = slotId ? next[slotId] : undefined;
    if (previous) delete next[previous];
    if (slotId) next[slotId] = personId;
    if (displaced && previous) next[previous] = displaced;
    const draft = { assignment: next, moves: moves + 1, hints };
    set({ ...draft, result: validate(level, next, ctx) });
    useProgress.getState().saveDraft(level.id, draft);
    return true;
  },
  hint: () => {
    const { level, assignment } = get();
    if (!level) return null;
    const entry = Object.entries(level.solution).find(
      ([slot, person]) => assignment[slot] !== person,
    );
    if (!entry) return null;
    const [slotId, personId] = entry;
    const hints = get().hints + 1;
    set({ hints });
    get().place(personId, slotId);
    const slot = level.slots.find((s) => s.id === slotId)!;
    const name = level.people.find((p) => p.id === personId)!.name;
    return `${name}, ${slot.label ?? `${level.slots.indexOf(slot) + 1}. kutu`} konumuna yerleştirildi. Yardım kullanımı yıldızı etkiler.`;
  },
  reset: () => {
    const { level, ctx } = get();
    if (!level || !ctx) return;
    set({ assignment: {}, moves: 0, hints: 0, result: validate(level, {}, ctx) });
    useProgress.getState().clearDraft(level.id);
  },
}));
