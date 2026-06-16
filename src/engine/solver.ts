import type { Assignment, Level } from '../types/puzzle';
import { allCluesSatisfied, makeContext } from './clues';
import { playableSlots } from './validate';

/**
 * AUTHORING / TEST ONLY — never shipped into gameplay.
 *
 * Brute-forces every way to place people into the playable slots and counts how
 * many satisfy ALL clue predicates. A well-formed level must have exactly one,
 * and it must equal the authored `solution`. The content test suite asserts this
 * for every level, which is what makes "uniquely solvable" a guarantee.
 */
export const findSolutions = (level: Level, cap = 5): Assignment[] => {
  const ctx = makeContext(level);
  const slots = playableSlots(level);
  const people = level.people.map((p) => p.id);
  const results: Assignment[] = [];

  const used = new Set<string>();
  const current: Assignment = {};

  const recurse = (i: number) => {
    if (results.length >= cap) return;
    if (i === slots.length) {
      if (allCluesSatisfied(ctx, current)) results.push({ ...current });
      return;
    }
    const slot = slots[i];
    for (const personId of people) {
      if (used.has(personId)) continue;
      const person = level.people.find((p) => p.id === personId)!;
      // Cheap structural prune: respect gender hints when present.
      if (slot.genderHint && person.gender !== slot.genderHint) continue;
      used.add(personId);
      current[slot.id] = personId;
      recurse(i + 1);
      delete current[slot.id];
      used.delete(personId);
    }
  };

  recurse(0);
  return results;
};

export const countSolutions = (level: Level, cap = 5): number => findSolutions(level, cap).length;
