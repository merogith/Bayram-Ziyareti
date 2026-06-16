import { describe, it, expect } from 'vitest';
import { routeGenogram } from '../../src/engine/genogram';
import type { TreeEdge, TreeSlot } from '../../src/types/puzzle';

const GEO = { col: 88, row: 116, slot: 72 };

describe('genogram router', () => {
  it('routes a nuclear family as one marriage bar, one drop, one bus, two stubs', () => {
    const slots: TreeSlot[] = [
      { id: 'baba', x: 1, y: 0 },
      { id: 'anne', x: 2, y: 0 },
      { id: 'ogul', x: 1, y: 1 },
      { id: 'kiz', x: 2, y: 1 },
    ];
    const edges: TreeEdge[] = [
      { from: 'baba', to: 'anne', type: 'spouse' },
      { from: 'baba', to: 'ogul', type: 'parent' },
      { from: 'baba', to: 'kiz', type: 'parent' },
      { from: 'anne', to: 'ogul', type: 'parent' },
      { from: 'anne', to: 'kiz', type: 'parent' },
    ];
    const plan = routeGenogram(slots, edges, GEO);
    expect(plan.marriages).toHaveLength(1);
    expect(plan.drops).toHaveLength(1);
    expect(plan.buses).toHaveLength(1);
    expect(plan.childStubs).toHaveLength(2);
    // No diagonal segments — every routed line is horizontal or vertical.
    const all = [...plan.marriages, ...plan.drops, ...plan.buses, ...plan.childStubs];
    for (const s of all) expect(s.x1 === s.x2 || s.y1 === s.y2).toBe(true);
  });

  it('drops a single child as a continuous vertical (no zero-width bus)', () => {
    const slots: TreeSlot[] = [
      { id: 'baba', x: 1, y: 0 },
      { id: 'anne', x: 2, y: 0 },
      { id: 'kid', x: 1.5, y: 1 },
    ];
    const edges: TreeEdge[] = [
      { from: 'baba', to: 'anne', type: 'spouse' },
      { from: 'baba', to: 'kid', type: 'parent' },
      { from: 'anne', to: 'kid', type: 'parent' },
    ];
    const plan = routeGenogram(slots, edges, GEO);
    expect(plan.marriages).toHaveLength(1);
    expect(plan.drops).toHaveLength(1);
    expect(plan.buses).toHaveLength(0); // child sits under the marriage midpoint
    expect(plan.childStubs).toHaveLength(1);
  });

  it('handles single-parent lineage with an L-drop (no spouse bar)', () => {
    const slots: TreeSlot[] = [
      { id: 'nine', x: 0, y: 0 },
      { id: 'baba', x: 0.5, y: 1 },
    ];
    const edges: TreeEdge[] = [{ from: 'nine', to: 'baba', type: 'parent' }];
    const plan = routeGenogram(slots, edges, GEO);
    expect(plan.marriages).toHaveLength(0);
    expect(plan.drops).toHaveLength(1);
    expect(plan.childStubs).toHaveLength(1);
  });
});
