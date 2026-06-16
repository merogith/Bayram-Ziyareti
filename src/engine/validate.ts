import type { Assignment, Level, ValidationResult } from '../types/puzzle';
import { makeContext, satisfiedClueMap, type EvalContext } from './clues';

/** Slots the player actually has to fill (everything except fixed anchors). */
export const playableSlots = (level: Level) => level.slots.filter((s) => !s.fixedPersonId);

/**
 * Validate an assignment. "solved" is an exact match against the authored
 * solution (robust — a player can never stumble into an alternate fill), while
 * `satisfiedClues` drives the live clue checklist. Puzzles are guaranteed to be
 * uniquely solvable by the authoring-time solver (see solver.ts + tests).
 */
export const validate = (
  level: Level,
  assignment: Assignment,
  ctx: EvalContext = makeContext(level),
): ValidationResult => {
  const perSlot: Record<string, boolean> = {};
  let solved = true;
  for (const [slotId, personId] of Object.entries(level.solution)) {
    const ok = assignment[slotId] === personId;
    perSlot[slotId] = ok;
    if (!ok) solved = false;
  }
  return { solved, perSlot, satisfiedClues: satisfiedClueMap(ctx, assignment) };
};
