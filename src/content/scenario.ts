import { makeAvatar } from '../types/avatar';
import type { ScenarioLevel } from '../types/puzzle';

/**
 * Kız isteme / düğün (scenario) levels. Reuses the tree machinery plus side
 * predicates (kız tarafı / damat tarafı).
 */

// 1 — Dünürler Karşı Karşıya: kız tarafı / damat tarafı
const scenario01: ScenarioLevel = {
  id: 'scenario-01',
  mode: 'scenario',
  chapterId: 'dugun',
  title: 'Dünürler Karşı Karşıya',
  intro: 'Kız isteme günü! Herkesi doğru tarafa yerleştir: kız tarafı solda, damat tarafı sağda.',
  difficulty: 2,
  slots: [
    { id: 's_k1', x: 0, y: 0, genderHint: 'm', label: 'Kız tarafı' },
    { id: 's_k2', x: 1, y: 0, genderHint: 'f' },
    { id: 's_gelin', x: 0.5, y: 1, genderHint: 'f' },
    { id: 's_d1', x: 3, y: 0, genderHint: 'm', label: 'Damat tarafı' },
    { id: 's_d2', x: 4, y: 0, genderHint: 'f' },
    { id: 's_damat', x: 3.5, y: 1, genderHint: 'm' },
  ],
  edges: [
    { from: 's_k1', to: 's_k2', type: 'spouse' },
    { from: 's_k1', to: 's_gelin', type: 'parent' },
    { from: 's_k2', to: 's_gelin', type: 'parent' },
    { from: 's_d1', to: 's_d2', type: 'spouse' },
    { from: 's_d1', to: 's_damat', type: 'parent' },
    { from: 's_d2', to: 's_damat', type: 'parent' },
    { from: 's_gelin', to: 's_damat', type: 'spouse' },
  ],
  sides: { kiz: ['s_k1', 's_k2', 's_gelin'], damat: ['s_d1', 's_d2', 's_damat'] },
  people: [
    { id: 'aylin', name: 'Aylin', gender: 'f', tags: ['gelin'], avatar: makeAvatar({ gender: 'f' }) },
    { id: 'burak', name: 'Burak', gender: 'm', tags: ['damat'], avatar: makeAvatar({ gender: 'm', beard: true }) },
    { id: 'hasan', name: 'Hasan', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'emine', name: 'Emine', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'kadir', name: 'Kadir', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', beard: true }) },
    { id: 'nurten', name: 'Nurten', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
  ],
  clues: [
    { id: 'c1', text: 'Aylin gelindir, kız tarafındadır.', predicate: { kind: 'side', personId: 'aylin', side: 'kiz' } },
    { id: 'c2', text: 'Burak damattır, damat tarafındadır.', predicate: { kind: 'side', personId: 'burak', side: 'damat' } },
    { id: 'c3', text: 'Hasan, Aylin’in babasıdır.', predicate: { kind: 'relation', a: 'hasan', b: 'aylin', relation: 'baba' } },
    { id: 'c4', text: 'Emine, Hasan’ın eşidir.', predicate: { kind: 'relation', a: 'emine', b: 'hasan', relation: 'esi' } },
    { id: 'c5', text: 'Kadir, Burak’ın babasıdır.', predicate: { kind: 'relation', a: 'kadir', b: 'burak', relation: 'baba' } },
    { id: 'c6', text: 'Nurten, Kadir’in eşidir.', predicate: { kind: 'relation', a: 'nurten', b: 'kadir', relation: 'esi' } },
  ],
  solution: { s_k1: 'hasan', s_k2: 'emine', s_gelin: 'aylin', s_d1: 'kadir', s_d2: 'nurten', s_damat: 'burak' },
};

// 2 — Bacanak Buluşması: iki kız kardeşin eşleri bacanaktır (çocuk anchorı ile)
const scenario02: ScenarioLevel = {
  id: 'scenario-02',
  mode: 'scenario',
  chapterId: 'dugun',
  title: 'Bacanak Buluşması',
  intro: 'Nişanda iki bacanak tanışır: iki kız kardeşin kocaları birbirinin bacanağıdır.',
  difficulty: 3,
  slots: [
    { id: 's_anne', x: 2, y: 0, genderHint: 'f', label: 'Anneanne', fixedPersonId: 'guler' },
    { id: 's_husb1', x: 0, y: 1, genderHint: 'm' },
    { id: 's_sis1', x: 1, y: 1, genderHint: 'f' },
    { id: 's_sis2', x: 3, y: 1, genderHint: 'f' },
    { id: 's_husb2', x: 4, y: 1, genderHint: 'm' },
    { id: 's_child', x: 0.5, y: 2, genderHint: 'f' },
  ],
  edges: [
    { from: 's_anne', to: 's_sis1', type: 'parent' },
    { from: 's_anne', to: 's_sis2', type: 'parent' },
    { from: 's_husb1', to: 's_sis1', type: 'spouse' },
    { from: 's_husb2', to: 's_sis2', type: 'spouse' },
    { from: 's_sis1', to: 's_child', type: 'parent' },
    { from: 's_husb1', to: 's_child', type: 'parent' },
  ],
  people: [
    { id: 'guler', name: 'Güler Anneanne', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'selin', name: 'Selin', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'derya', name: 'Derya', gender: 'f', avatar: makeAvatar({ gender: 'f', glasses: true }) },
    { id: 'onur', name: 'Onur', gender: 'm', avatar: makeAvatar({ gender: 'm', mustache: true }) },
    { id: 'tolga', name: 'Tolga', gender: 'm', avatar: makeAvatar({ gender: 'm', beard: true }) },
    { id: 'ada', name: 'Ada', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Ada, Selin’in kızıdır.', predicate: { kind: 'relation', a: 'ada', b: 'selin', relation: 'kiz' } },
    { id: 'c2', text: 'Selin ile Derya kardeştir.', predicate: { kind: 'relation', a: 'selin', b: 'derya', relation: 'kardes' } },
    { id: 'c3', text: 'Onur, Selin’in eşidir.', predicate: { kind: 'relation', a: 'onur', b: 'selin', relation: 'esi' } },
    { id: 'c4', text: 'Tolga, Onur’un bacanağıdır (baldızının kocası).', predicate: { kind: 'relation', a: 'tolga', b: 'onur', relation: 'bacanak' } },
  ],
  solution: { s_husb1: 'onur', s_sis1: 'selin', s_sis2: 'derya', s_husb2: 'tolga', s_child: 'ada' },
};

export const scenarioLevels: ScenarioLevel[] = [scenario01, scenario02];
