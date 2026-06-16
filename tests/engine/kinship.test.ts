import { describe, it, expect } from 'vitest';
import { buildGraph, relationHolds } from '../../src/engine/kinship';
import type { Gender, TreeEdge, TreeSlot } from '../../src/types/puzzle';

// A reference family used across kinship assertions:
//   GF─GM            (s_gf male, s_gm female)
//   ├ A (m) ─ Aw (f)   A & B are brothers; Aw, Bw their wives (eltiler)
//   │  └ C (m)         child of A & Aw
//   └ B (m) ─ Bw (f)
const slots: TreeSlot[] = [
  { id: 's_gf', x: 0, y: 0 },
  { id: 's_gm', x: 1, y: 0 },
  { id: 's_a', x: 0, y: 1 },
  { id: 's_aw', x: -1, y: 1 },
  { id: 's_b', x: 2, y: 1 },
  { id: 's_bw', x: 3, y: 1 },
  { id: 's_c', x: 0, y: 2 },
  { id: 's_d', x: 2, y: 2 }, // child of B & Bw -> C's cousin
];
const edges: TreeEdge[] = [
  { from: 's_gf', to: 's_gm', type: 'spouse' },
  { from: 's_gf', to: 's_a', type: 'parent' },
  { from: 's_gm', to: 's_a', type: 'parent' },
  { from: 's_gf', to: 's_b', type: 'parent' },
  { from: 's_gm', to: 's_b', type: 'parent' },
  { from: 's_a', to: 's_aw', type: 'spouse' },
  { from: 's_b', to: 's_bw', type: 'spouse' },
  { from: 's_a', to: 's_c', type: 'parent' },
  { from: 's_aw', to: 's_c', type: 'parent' },
  { from: 's_b', to: 's_d', type: 'parent' },
  { from: 's_bw', to: 's_d', type: 'parent' },
];
const gender: Record<string, Gender> = {
  s_gf: 'm',
  s_gm: 'f',
  s_a: 'm',
  s_aw: 'f',
  s_b: 'm',
  s_bw: 'f',
  s_c: 'm',
  s_d: 'f',
};
const g = buildGraph(slots, edges);
const genderOf = (s: string) => gender[s];
const rel = (a: string, b: string, t: Parameters<typeof relationHolds>[4]) =>
  relationHolds(g, genderOf, a, b, t);

describe('kinship derivation', () => {
  it('handles core relations', () => {
    expect(rel('s_gf', 's_a', 'baba')).toBe(true);
    expect(rel('s_gm', 's_a', 'anne')).toBe(true);
    expect(rel('s_a', 's_b', 'kardes')).toBe(true);
    expect(rel('s_gf', 's_c', 'dede')).toBe(true);
    expect(rel('s_gm', 's_c', 'nine')).toBe(true);
    expect(rel('s_c', 's_gf', 'torun')).toBe(true);
  });

  it('derives elti and bacanak', () => {
    // Aw and Bw are wives of two brothers -> eltiler
    expect(rel('s_aw', 's_bw', 'elti')).toBe(true);
    expect(rel('s_bw', 's_aw', 'elti')).toBe(true);
    // husbands of two sisters would be bacanak; here A,B aren't married to sisters
    expect(rel('s_a', 's_b', 'bacanak')).toBe(false);
  });

  it('derives in-law terms from the child viewpoint', () => {
    // B is C's amca (father's brother), Bw is C's yenge
    expect(rel('s_b', 's_c', 'amca')).toBe(true);
    expect(rel('s_bw', 's_c', 'yenge')).toBe(true);
    // Aw is C's mother (anne), not yenge
    expect(rel('s_aw', 's_c', 'amca')).toBe(false);
  });

  it('distinguishes babaanne from anneanne by side', () => {
    // GM is the mother of A (C's father) -> C's babaanne, not anneanne
    expect(rel('s_gm', 's_c', 'babaanne')).toBe(true);
    expect(rel('s_gm', 's_c', 'anneanne')).toBe(false);
    // generic nine still holds for any grandmother
    expect(rel('s_gm', 's_c', 'nine')).toBe(true);
  });

  it('derives yeğen and kuzen', () => {
    // C is the child of A; relative to A's brother B, C is a yeğen
    expect(rel('s_c', 's_b', 'yegen')).toBe(true);
    // C and D are children of two brothers (A, B) -> kuzen
    expect(rel('s_c', 's_d', 'kuzen')).toBe(true);
    expect(rel('s_d', 's_c', 'kuzen')).toBe(true);
    // siblings are not cousins
    expect(rel('s_a', 's_b', 'kuzen')).toBe(false);
  });

  it('returns false when a structural slot is empty (indeterminate)', () => {
    const partial = (s: string) => (s === 's_b' ? undefined : gender[s]);
    expect(relationHolds(g, partial, 's_b', 's_c', 'amca')).toBe(false);
  });
});
