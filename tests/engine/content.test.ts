import { describe, it, expect } from 'vitest';
import { allLevels } from '../../src/content';
import { findSolutions } from '../../src/engine/solver';
import { validate } from '../../src/engine/validate';
import { playableSlots } from '../../src/engine/validate';

describe('content integrity', () => {
  for (const level of allLevels) {
    describe(`${level.id} — ${level.title}`, () => {
      it('solution covers exactly the playable slots', () => {
        const solKeys = Object.keys(level.solution).sort();
        const playable = playableSlots(level)
          .map((s) => s.id)
          .sort();
        expect(solKeys).toEqual(playable);
      });

      it('is uniquely solvable and the unique solution equals the authored solution', () => {
        const solutions = findSolutions(level, 5);
        expect(solutions.length).toBe(1);
        expect(solutions[0]).toEqual(level.solution);
      });

      it('the authored solution validates as solved with all clues satisfied', () => {
        const result = validate(level, level.solution);
        expect(result.solved).toBe(true);
        expect(Object.values(result.satisfiedClues).every(Boolean)).toBe(true);
      });
    });
  }
});
