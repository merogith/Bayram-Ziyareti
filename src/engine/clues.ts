import type { Assignment, Level, Person, Predicate, Side } from '../types/puzzle';
import { buildGraph, relationHolds, type RelGraph } from './kinship';

/** Pre-computed, reusable context for evaluating a level's predicates. */
export interface EvalContext {
  level: Level;
  people: Map<string, Person>;
  graph: RelGraph | null; // tree + scenario only
  seatIndex: Map<string, number>; // seating only
  sideOf: Map<string, Side>; // scenario only: slotId -> side
}

export const makeContext = (level: Level): EvalContext => {
  const people = new Map(level.people.map((p) => [p.id, p]));

  let graph: RelGraph | null = null;
  if (level.mode === 'tree' || level.mode === 'scenario') {
    graph = buildGraph(level.slots, level.edges);
  }

  const seatIndex = new Map<string, number>();
  if (level.mode === 'seating') {
    level.seatOrder.forEach((slotId, i) => seatIndex.set(slotId, i));
  }

  const sideOf = new Map<string, Side>();
  if (level.mode === 'scenario' && level.sides) {
    level.sides.kiz.forEach((s) => sideOf.set(s, 'kiz'));
    level.sides.damat.forEach((s) => sideOf.set(s, 'damat'));
  }

  return { level, people, graph, seatIndex, sideOf };
};

/** Reverse map: person id -> slot id, including fixed slots. */
const placeOf = (ctx: EvalContext, assignment: Assignment) => {
  const m = new Map<string, string>();
  for (const [slotId, personId] of Object.entries(assignment)) m.set(personId, slotId);
  for (const s of ctx.level.slots) if (s.fixedPersonId) m.set(s.fixedPersonId, s.id);
  return m;
};

/**
 * Evaluate a single predicate against an assignment.
 * Unresolved references (a person not yet placed) evaluate to false, so the
 * satisfied-clues checklist only lights up when the deduction is actually made.
 */
export const evalPredicate = (
  ctx: EvalContext,
  assignment: Assignment,
  p: Predicate,
  place = placeOf(ctx, assignment),
): boolean => {
  const slotOf = (personId: string) => place.get(personId);
  const occupant = (slotId: string): string | undefined => {
    if (assignment[slotId]) return assignment[slotId];
    const s = ctx.level.slots.find((x) => x.id === slotId);
    return s?.fixedPersonId;
  };
  const genderOf = (slotId: string) => {
    const personId = occupant(slotId);
    return personId ? ctx.people.get(personId)?.gender : undefined;
  };
  const ageOf = (personId: string) => ctx.people.get(personId)?.age;

  switch (p.kind) {
    case 'isInSlot':
      return slotOf(p.personId) === p.slotId;
    case 'notInSlot':
      return slotOf(p.personId) !== undefined && slotOf(p.personId) !== p.slotId;
    case 'relation': {
      if (!ctx.graph) return false;
      const sa = slotOf(p.a);
      const sb = slotOf(p.b);
      if (!sa || !sb) return false;
      return relationHolds(ctx.graph, genderOf, sa, sb, p.relation);
    }
    case 'attr': {
      const personId = occupant(p.slotId);
      if (!personId) return false;
      const person = ctx.people.get(personId);
      if (!person) return false;
      if (p.attr === 'gender') return person.gender === p.value;
      return (person.tags ?? []).includes(p.value);
    }
    case 'seatedLeftOf': {
      const sa = slotOf(p.a);
      const sb = slotOf(p.b);
      if (!sa || !sb) return false;
      const ia = ctx.seatIndex.get(sa);
      const ib = ctx.seatIndex.get(sb);
      if (ia === undefined || ib === undefined) return false;
      return ia < ib;
    }
    case 'moreSenior':
    case 'kissesHandBefore': {
      const aa = ageOf(p.a);
      const ab = ageOf(p.b);
      if (aa === undefined || ab === undefined) return false;
      return aa > ab;
    }
    case 'sameSide': {
      const sa = slotOf(p.a);
      const sb = slotOf(p.b);
      if (!sa || !sb) return false;
      const za = ctx.sideOf.get(sa);
      const zb = ctx.sideOf.get(sb);
      return za !== undefined && za === zb;
    }
    case 'side': {
      const s = slotOf(p.personId);
      if (!s) return false;
      return ctx.sideOf.get(s) === p.side;
    }
    default:
      return false;
  }
};

export const allCluesSatisfied = (ctx: EvalContext, assignment: Assignment): boolean => {
  const place = placeOf(ctx, assignment);
  return ctx.level.clues.every((c) => evalPredicate(ctx, assignment, c.predicate, place));
};

export const satisfiedClueMap = (
  ctx: EvalContext,
  assignment: Assignment,
): Record<string, boolean> => {
  const place = placeOf(ctx, assignment);
  const out: Record<string, boolean> = {};
  for (const c of ctx.level.clues) out[c.id] = evalPredicate(ctx, assignment, c.predicate, place);
  return out;
};
