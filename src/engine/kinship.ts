import type { Gender, KinshipTerm, TreeEdge, TreeSlot } from '../types/puzzle';

/**
 * Relationship graph derived from the tree topology (slots + edges).
 *
 * The whole point of the game: Turkish kinship terms (elti, bacanak, dünür, amca
 * vs dayı …) are NOT stored on the level. They are *derived* from the parent/spouse
 * edges plus the gender of whoever currently occupies each slot. That is what turns
 * placement into genuine logical deduction.
 */
export interface RelGraph {
  spouseOf: Map<string, Set<string>>;
  parentsOf: Map<string, Set<string>>;
  childrenOf: Map<string, Set<string>>;
}

const add = (m: Map<string, Set<string>>, k: string, v: string) => {
  if (!m.has(k)) m.set(k, new Set());
  m.get(k)!.add(v);
};

export const buildGraph = (slots: TreeSlot[], edges: TreeEdge[]): RelGraph => {
  const g: RelGraph = { spouseOf: new Map(), parentsOf: new Map(), childrenOf: new Map() };
  for (const s of slots) {
    g.spouseOf.set(s.id, new Set());
    g.parentsOf.set(s.id, new Set());
    g.childrenOf.set(s.id, new Set());
  }
  for (const e of edges) {
    if (e.type === 'spouse') {
      add(g.spouseOf, e.from, e.to);
      add(g.spouseOf, e.to, e.from);
    } else {
      add(g.childrenOf, e.from, e.to); // from is parent of to
      add(g.parentsOf, e.to, e.from);
    }
  }
  return g;
};

const get = (m: Map<string, Set<string>>, k: string): Set<string> => m.get(k) ?? new Set();

/** Siblings = slots that share at least one parent (excluding self). */
const siblingsOf = (g: RelGraph, s: string): Set<string> => {
  const out = new Set<string>();
  for (const p of get(g.parentsOf, s)) {
    for (const c of get(g.childrenOf, p)) if (c !== s) out.add(c);
  }
  return out;
};

/** Siblings of b plus siblings of b's parents (i.e. b's own siblings + aunts/uncles). */
const siblingsAndPibs = (g: RelGraph, b: string): Set<string> => {
  const out = new Set(siblingsOf(g, b));
  for (const p of get(g.parentsOf, b)) for (const s of siblingsOf(g, p)) out.add(s);
  return out;
};

/** Slot id -> occupant gender (undefined when the slot is empty). */
export type GenderOf = (slotId: string) => Gender | undefined;

/**
 * Does "a is the <term> of b" hold, given current occupant genders?
 * Returns false when a required structural slot is empty (indeterminate ⇒ not yet satisfied).
 */
export const relationHolds = (
  g: RelGraph,
  genderOf: GenderOf,
  a: string,
  b: string,
  term: KinshipTerm,
): boolean => {
  if (a === b) return false;
  const male = (s: string) => genderOf(s) === 'm';
  const female = (s: string) => genderOf(s) === 'f';
  const spouses = (s: string) => get(g.spouseOf, s);
  const parents = (s: string) => get(g.parentsOf, s);
  const children = (s: string) => get(g.childrenOf, s);
  const sibs = (s: string) => siblingsOf(g, s);
  const has = (set: Set<string>, x: string) => set.has(x);
  const some = (set: Set<string>, fn: (x: string) => boolean) => [...set].some(fn);

  switch (term) {
    case 'esi':
      return has(spouses(b), a);
    case 'anne':
      return female(a) && has(parents(b), a);
    case 'baba':
      return male(a) && has(parents(b), a);
    case 'ogul':
      return male(a) && has(children(b), a);
    case 'kiz':
      return female(a) && has(children(b), a);
    case 'kardes':
      return has(sibs(b), a);
    case 'dede':
      return male(a) && some(parents(b), (p) => has(parents(p), a));
    case 'nine':
      return female(a) && some(parents(b), (p) => has(parents(p), a));
    case 'babaanne':
      // a (female) is the mother of b's father
      return female(a) && some(parents(b), (p) => male(p) && has(parents(p), a));
    case 'anneanne':
      // a (female) is the mother of b's mother
      return female(a) && some(parents(b), (p) => female(p) && has(parents(p), a));
    case 'torun':
      return some(children(b), (c) => has(children(c), a));
    case 'yegen':
      // a is the child of a sibling of b (b is the amca/dayı/hala/teyze)
      return some(sibs(b), (s) => has(children(s), a));
    case 'kuzen':
      // a's parent is a sibling of b's parent
      return some(parents(a), (pa) => some(parents(b), (pb) => has(sibs(pb), pa)));
    case 'amca':
      return male(a) && some(parents(b), (p) => male(p) && has(sibs(p), a));
    case 'dayi':
      return male(a) && some(parents(b), (p) => female(p) && has(sibs(p), a));
    case 'hala':
      return female(a) && some(parents(b), (p) => male(p) && has(sibs(p), a));
    case 'teyze':
      return female(a) && some(parents(b), (p) => female(p) && has(sibs(p), a));
    case 'yenge':
      // a (female) is the spouse of b's sibling, or of b's amca/dayı (aunt/uncle)
      return female(a) && some(siblingsAndPibs(g, b), (s) => has(spouses(s), a));
    case 'eniste':
      // a (male) is the spouse of b's sibling, or of b's hala/teyze
      return male(a) && some(siblingsAndPibs(g, b), (s) => has(spouses(s), a));
    case 'gelin':
      // a (female) is married to a son of b
      return female(a) && some(children(b), (c) => male(c) && has(spouses(c), a));
    case 'damat':
      // a (male) is married to a daughter of b
      return male(a) && some(children(b), (c) => female(c) && has(spouses(c), a));
    case 'kayinvalide':
      return female(a) && some(spouses(b), (sp) => has(parents(sp), a));
    case 'kayinpeder':
      return male(a) && some(spouses(b), (sp) => has(parents(sp), a));
    case 'kayinco':
      // a (male) is a sibling of b's spouse
      return male(a) && some(spouses(b), (sp) => has(sibs(sp), a));
    case 'gorumce':
      // b is female; a (female) is a sister of b's (male) husband
      return (
        female(a) &&
        female(b) &&
        some(spouses(b), (sp) => male(sp) && has(sibs(sp), a))
      );
    case 'baldiz':
      // b is male; a (female) is a sister of b's (female) wife
      return (
        female(a) &&
        male(b) &&
        some(spouses(b), (sp) => female(sp) && has(sibs(sp), a))
      );
    case 'elti':
      // a & b are wives of two (different) brothers
      return (
        female(a) &&
        female(b) &&
        some(spouses(a), (ma) =>
          some(spouses(b), (mb) => ma !== mb && has(sibs(ma), mb)),
        )
      );
    case 'bacanak':
      // a & b are husbands of two (different) sisters
      return (
        male(a) &&
        male(b) &&
        some(spouses(a), (fa) =>
          some(spouses(b), (fb) => fa !== fb && has(sibs(fa), fb)),
        )
      );
    case 'dunur':
      // a is parent of one spouse, b is parent of the other spouse, in some couple
      return [...g.spouseOf.keys()].some((c1) => {
        for (const c2 of spouses(c1)) {
          if (has(parents(c1), a) && has(parents(c2), b) && a !== b) return true;
        }
        return false;
      });
    default:
      return false;
  }
};
