import { makeAvatar } from '../types/avatar';
import type { SeatingLevel } from '../types/puzzle';

/**
 * Sofra düzeni (seating) levels. The board is a row of seats (seatOrder, left→right).
 * Placement is constrained by isInSlot / seatedLeftOf; moreSenior clues are
 * informational (age facts) that help the player read the cultural rules.
 */

// 1 — Başköşe Kimin?: en yaşlı başköşeye
const seating01: SeatingLevel = {
  id: 'seating-01',
  mode: 'seating',
  chapterId: 'sofra',
  title: 'Başköşe Kimin?',
  intro: 'Bayram sofrasında başköşe en yaşlının hakkıdır. Sofrayı kıdeme göre diz!',
  difficulty: 1,
  slots: [
    { id: 's1', x: 0, y: 0, label: 'Başköşe' },
    { id: 's2', x: 1, y: 0 },
    { id: 's3', x: 2, y: 0 },
    { id: 's4', x: 3, y: 0 },
  ],
  seatOrder: ['s1', 's2', 's3', 's4'],
  people: [
    { id: 'dede', name: 'Dede', gender: 'm', age: 80, avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'baba', name: 'Baba', gender: 'm', age: 50, avatar: makeAvatar({ gender: 'm', mustache: true }) },
    { id: 'anne', name: 'Anne', gender: 'f', age: 47, avatar: makeAvatar({ gender: 'f' }) },
    { id: 'torun', name: 'Torun', gender: 'm', age: 14, avatar: makeAvatar({ gender: 'm', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Dede başköşeye oturur (en yaşlı odur).', predicate: { kind: 'isInSlot', personId: 'dede', slotId: 's1' } },
    { id: 'c2', text: 'Baba, Anne’nin solunda oturur.', predicate: { kind: 'seatedLeftOf', a: 'baba', b: 'anne' } },
    { id: 'c3', text: 'Anne, Torun’un solunda oturur.', predicate: { kind: 'seatedLeftOf', a: 'anne', b: 'torun' } },
    { id: 'c4', text: 'Dede, Baba’dan yaşlıdır.', predicate: { kind: 'moreSenior', a: 'dede', b: 'baba' } },
  ],
  solution: { s1: 'dede', s2: 'baba', s3: 'anne', s4: 'torun' },
};

// 2 — El Öpme Sırası: kıdem sırasıyla
const seating02: SeatingLevel = {
  id: 'seating-02',
  mode: 'seating',
  chapterId: 'sofra',
  title: 'El Öpme Sırası',
  intro: 'Bayramda el öpme sırası en büyükten başlar. Sırayı doğru kur!',
  difficulty: 2,
  slots: [
    { id: 'p1', x: 0, y: 0, label: '1.' },
    { id: 'p2', x: 1, y: 0, label: '2.' },
    { id: 'p3', x: 2, y: 0, label: '3.' },
    { id: 'p4', x: 3, y: 0, label: '4.' },
  ],
  seatOrder: ['p1', 'p2', 'p3', 'p4'],
  people: [
    { id: 'amca', name: 'Amca', gender: 'm', age: 62, avatar: makeAvatar({ gender: 'm', ageBand: 'old', beard: true }) },
    { id: 'hala', name: 'Hala', gender: 'f', age: 58, avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'yegen1', name: 'Büyük Yeğen', gender: 'm', age: 22, avatar: makeAvatar({ gender: 'm' }) },
    { id: 'yegen2', name: 'Küçük Yeğen', gender: 'f', age: 17, avatar: makeAvatar({ gender: 'f', ageBand: 'young' }) },
  ],
  clues: [
    { id: 'c1', text: 'Sıra en yaşlıdan başlar: Amca birinci olur.', predicate: { kind: 'isInSlot', personId: 'amca', slotId: 'p1' } },
    { id: 'c2', text: 'Amca, Hala’dan önce gelir.', predicate: { kind: 'seatedLeftOf', a: 'amca', b: 'hala' } },
    { id: 'c3', text: 'Hala, Büyük Yeğen’den önce gelir.', predicate: { kind: 'seatedLeftOf', a: 'hala', b: 'yegen1' } },
    { id: 'c4', text: 'Büyük Yeğen, Küçük Yeğen’den önce gelir.', predicate: { kind: 'seatedLeftOf', a: 'yegen1', b: 'yegen2' } },
  ],
  solution: { p1: 'amca', p2: 'hala', p3: 'yegen1', p4: 'yegen2' },
};

export const seatingLevels: SeatingLevel[] = [seating01, seating02];
