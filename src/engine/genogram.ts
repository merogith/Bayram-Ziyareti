import type { TreeEdge, TreeSlot } from '../types/puzzle';
import { buildGraph } from './kinship';

/**
 * Genogram edge router.
 *
 * The old board drew a straight line from every parent to every child, so a
 * couple with two children produced crossing diagonals (the "X" mesh that read
 * as "everyone is related to everyone"). This module instead produces a proper
 * orthogonal genogram: spouses joined by a horizontal marriage bar, a single
 * vertical drop to a horizontal sibling bus, and a short stub down to each child.
 *
 * Pure and DOM-free so it can be unit-tested like kinship.ts.
 *
 * Authoring contract: spouses share a `y` row; children sit on a row strictly
 * below their parents. All current levels comply.
 */

export interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface RoutePlan {
  /** Horizontal bars joining spouse pairs. */
  marriages: Seg[];
  /** Vertical drops from a parents' junction down to the sibling bus. */
  drops: Seg[];
  /** Horizontal sibling buses spanning a set of siblings. */
  buses: Seg[];
  /** Short verticals from the bus down to each child's top edge. */
  childStubs: Seg[];
}

export interface RouteGeometry {
  /** Column / row pitch and slot size, matching the board layout. */
  col: number;
  row: number;
  slot: number;
  /** Vertical gap kept between the sibling bus and the child row. */
  gap?: number;
}

const keyOf = (ids: string[]) => [...ids].sort().join('|');

/**
 * Compute the orthogonal route plan for a set of slots + edges.
 * Coordinates are in the same pixel space the board uses (origin at the
 * top-left of the bounding box of all slots).
 */
export const routeGenogram = (
  slots: TreeSlot[],
  edges: TreeEdge[],
  geo: RouteGeometry,
): RoutePlan => {
  const { col, row, slot } = geo;
  const gap = geo.gap ?? 16;
  const byId = new Map(slots.map((s) => [s.id, s]));
  const xs = slots.map((s) => s.x);
  const ys = slots.map((s) => s.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  const left = (id: string) => (byId.get(id)!.x - minX) * col;
  const top = (id: string) => (byId.get(id)!.y - minY) * row;
  const cx = (id: string) => left(id) + slot / 2;
  const cy = (id: string) => top(id) + slot / 2;
  const bottom = (id: string) => top(id) + slot;

  const g = buildGraph(slots, edges);
  const plan: RoutePlan = { marriages: [], drops: [], buses: [], childStubs: [] };

  // 1) Marriage bars for every spouse couple (drawn once per unordered pair).
  const seenCouple = new Set<string>();
  for (const [a, partners] of g.spouseOf) {
    for (const b of partners) {
      const k = keyOf([a, b]);
      if (seenCouple.has(k)) continue;
      seenCouple.add(k);
      const y = (cy(a) + cy(b)) / 2;
      plan.marriages.push({ x1: cx(a), y1: y, x2: cx(b), y2: y });
    }
  }

  // 2) Group children by their exact set of parents (a sibling set).
  const groups = new Map<string, { parents: string[]; children: string[] }>();
  for (const s of slots) {
    const parents = [...(g.parentsOf.get(s.id) ?? [])];
    if (parents.length === 0) continue;
    const k = s.busGroup ?? keyOf(parents);
    if (!groups.has(k)) groups.set(k, { parents, children: [] });
    groups.get(k)!.children.push(s.id);
  }

  // 3) For each sibling set: junction -> drop -> bus -> stubs.
  for (const { parents, children } of groups.values()) {
    if (children.length === 0) continue;

    // Junction: midpoint of the marriage bar for a couple, else the lone parent's bottom.
    let jx: number;
    let jy: number;
    const isCouple = parents.length === 2 && (g.spouseOf.get(parents[0])?.has(parents[1]) ?? false);
    if (isCouple) {
      jx = (cx(parents[0]) + cx(parents[1])) / 2;
      jy = (cy(parents[0]) + cy(parents[1])) / 2;
    } else if (parents.length === 1) {
      jx = cx(parents[0]);
      jy = bottom(parents[0]);
    } else {
      // Multiple non-spouse parents (unusual): use the centroid above the children.
      jx = parents.reduce((acc, p) => acc + cx(p), 0) / parents.length;
      jy = Math.max(...parents.map(bottom));
    }

    const busY = Math.min(...children.map(top)) - gap;
    plan.drops.push({ x1: jx, y1: jy, x2: jx, y2: busY });

    const busXs = [jx, ...children.map(cx)];
    const minBusX = Math.min(...busXs);
    const maxBusX = Math.max(...busXs);
    if (maxBusX - minBusX > 0.5) {
      plan.buses.push({ x1: minBusX, y1: busY, x2: maxBusX, y2: busY });
    }

    for (const c of children) {
      plan.childStubs.push({ x1: cx(c), y1: busY, x2: cx(c), y2: top(c) });
    }
  }

  return plan;
};
