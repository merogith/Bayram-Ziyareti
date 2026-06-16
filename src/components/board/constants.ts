import type { Level } from '../../types/puzzle';

/** Board layout pitch and slot size (shared by PuzzleBoard and the scene layers). */
export const COL = 88;
export const ROW = 116;
export const SLOT = 72;

export const boardConstants = { COL, ROW, SLOT };

/** Virtual canvas size for a level, used to compute the auto-fit scale. */
export const boardSize = (level: Level) => {
  const xs = level.slots.map((s) => s.x);
  const ys = level.slots.map((s) => s.y);
  return {
    width: (Math.max(...xs) - Math.min(...xs)) * COL + SLOT,
    height: (Math.max(...ys) - Math.min(...ys)) * ROW + SLOT,
  };
};
