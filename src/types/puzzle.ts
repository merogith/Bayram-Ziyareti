import type { AvatarDescriptor, Gender } from './avatar';

export type Mode = 'tree' | 'seating' | 'scenario';

/** Turkish kinship terms used by the puzzles. Derived from tree structure, never stored raw. */
export type KinshipTerm =
  | 'esi' // spouse
  | 'anne'
  | 'baba'
  | 'ogul'
  | 'kiz'
  | 'kardes'
  | 'dede'
  | 'nine'
  | 'torun'
  | 'amca' // father's brother
  | 'dayi' // mother's brother
  | 'hala' // father's sister
  | 'teyze' // mother's sister
  | 'yenge' // wife of one's brother/uncle
  | 'eniste' // husband of one's sister/aunt
  | 'gelin' // son's wife
  | 'damat' // daughter's husband
  | 'kayinvalide' // mother-in-law
  | 'kayinpeder' // father-in-law
  | 'kayinco' // wife's/husband's brother (kayınbirader)
  | 'gorumce' // husband's sister
  | 'baldiz' // wife's sister
  | 'elti' // wives of two brothers, to each other
  | 'bacanak' // husbands of two sisters, to each other
  | 'dunur'; // the two sets of parents-in-law, to each other

export type Side = 'kiz' | 'damat';

export interface Person {
  id: string;
  name: string;
  avatar: AvatarDescriptor;
  gender: Gender;
  /** Ground-truth age; drives seniority / el öpme ordering in seating puzzles. */
  age?: number;
  /** Free-form flags, e.g. 'gelin', 'damat', 'kiz-tarafi'. */
  tags?: string[];
}

/** Machine-checkable form of a clue. The validator never parses Turkish text. */
export type Predicate =
  | { kind: 'isInSlot'; personId: string; slotId: string }
  | { kind: 'notInSlot'; personId: string; slotId: string }
  /** Person `a` is the `relation` of person `b` (e.g. a is the `elti` of b). */
  | { kind: 'relation'; a: string; b: string; relation: KinshipTerm }
  | { kind: 'attr'; slotId: string; attr: 'gender' | 'tag'; value: string }
  /** Person `a` is seated to the left of person `b` (by seatOrder index). */
  | { kind: 'seatedLeftOf'; a: string; b: string }
  /** Person `a` is older than person `b` (age fact; informational). */
  | { kind: 'moreSenior'; a: string; b: string }
  /** Person `a` kisses the hand before person `b` (ceremonial, age fact). */
  | { kind: 'kissesHandBefore'; a: string; b: string }
  /** Persons `a` and `b` belong to the same family side. */
  | { kind: 'sameSide'; a: string; b: string }
  /** Person `personId` belongs to the given family side. */
  | { kind: 'side'; personId: string; side: Side };

export interface ClueCard {
  id: string;
  /** Turkish, with warm humour. */
  text: string;
  predicate: Predicate;
}

export type EdgeType = 'spouse' | 'parent'; // parent: from is parent of to

export interface TreeSlot {
  id: string;
  x: number;
  y: number;
  /** A slot that is pre-filled and not draggable (an anchor for deduction). */
  fixedPersonId?: string;
  genderHint?: Gender;
  /** Optional human label shown faintly in the slot, e.g. 'başköşe'. */
  label?: string;
}

export interface TreeEdge {
  from: string;
  to: string;
  type: EdgeType;
}

interface LevelBase {
  id: string;
  mode: Mode;
  chapterId: string;
  title: string;
  intro?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  people: Person[];
  clues: ClueCard[];
  /** Slot id -> person id. The single correct arrangement. */
  solution: Record<string, string>;
}

export interface TreeLevel extends LevelBase {
  mode: 'tree';
  slots: TreeSlot[];
  edges: TreeEdge[];
}

export interface SeatingLevel extends LevelBase {
  mode: 'seating';
  slots: TreeSlot[];
  /** Canonical left→right ordering of seat ids, used by seatedLeftOf / ordering clues. */
  seatOrder: string[];
}

export interface ScenarioLevel extends LevelBase {
  mode: 'scenario';
  slots: TreeSlot[];
  edges: TreeEdge[];
  /** Solution sides: which slot belongs to which family side. */
  sides?: { kiz: string[]; damat: string[] };
}

export type Level = TreeLevel | SeatingLevel | ScenarioLevel;

/** A player's current placement of people into slots. */
export type Assignment = Record<string, string>; // slotId -> personId

export interface ValidationResult {
  solved: boolean;
  perSlot: Record<string, boolean>;
  satisfiedClues: Record<string, boolean>;
}

export interface Chapter {
  id: string;
  mode: Mode;
  title: string;
  emoji: string;
  blurb: string;
  levelIds: string[];
}
