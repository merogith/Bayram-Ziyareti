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
    { id: 's_k1', x: 0, y: 0, genderHint: 'm' },
    { id: 's_k2', x: 1, y: 0, genderHint: 'f' },
    { id: 's_gelin', x: 0.5, y: 1, genderHint: 'f' },
    { id: 's_d1', x: 3, y: 0, genderHint: 'm' },
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
  zones: [
    { id: 'kiz', label: 'Kız Tarafı', side: 'kiz', rect: { x: -0.3, y: -0.35, w: 1.9, h: 2.25 } },
    { id: 'damat', label: 'Damat Tarafı', side: 'damat', rect: { x: 2.7, y: -0.35, w: 1.9, h: 2.25 } },
  ],
  slotZone: {
    s_k1: 'kiz',
    s_k2: 'kiz',
    s_gelin: 'kiz',
    s_d1: 'damat',
    s_d2: 'damat',
    s_damat: 'damat',
  },
  people: [
    { id: 'aylin', name: 'Aylin', gender: 'f', tags: ['gelin'], avatar: makeAvatar({ gender: 'f', bgColor: '#f6d9e6' }) },
    { id: 'burak', name: 'Burak', gender: 'm', tags: ['damat'], avatar: makeAvatar({ gender: 'm', bgColor: '#cfe0f2' }) },
    // İki dünür baba (Hasan/Kadir) ve iki dünür anne (Emine/Nurten): ayırt edilemez.
    { id: 'hasan', name: 'Hasan', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true, bgColor: '#efe2cf' }) },
    { id: 'emine', name: 'Emine', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true, bgColor: '#f1e3d2' }) },
    { id: 'kadir', name: 'Kadir', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true, bgColor: '#e9ddd0' }) },
    { id: 'nurten', name: 'Nurten', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true, bgColor: '#e8ded2' }) },
  ],
  clues: [
    { id: 'c1', text: 'Aylin gelindir, kız tarafındadır.', predicate: { kind: 'side', personId: 'aylin', side: 'kiz' } },
    { id: 'c2', text: 'Burak ile Aylin evlenecek; karşı taraflardalar.', predicate: { kind: 'differentSide', a: 'burak', b: 'aylin' } },
    { id: 'c3', text: 'Hasan, Aylin’in babasıdır.', predicate: { kind: 'relation', a: 'hasan', b: 'aylin', relation: 'baba' } },
    { id: 'c4', text: 'Emine, Hasan’ın eşidir.', predicate: { kind: 'relation', a: 'emine', b: 'hasan', relation: 'esi' } },
    { id: 'c5', text: 'Kadir, Nurten’in eşidir; ikisi damadın anne babasıdır.', predicate: { kind: 'relation', a: 'kadir', b: 'nurten', relation: 'esi' } },
    { id: 'c6', text: 'Nurten, Burak’ın annesidir.', predicate: { kind: 'relation', a: 'nurten', b: 'burak', relation: 'anne' } },
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
  zones: [{ id: 'salon', label: 'Salon', rect: { x: -0.35, y: -0.35, w: 4.9, h: 3.2 } }],
  slotZone: {
    s_husb1: 'salon',
    s_sis1: 'salon',
    s_sis2: 'salon',
    s_husb2: 'salon',
    s_child: 'salon',
  },
  people: [
    { id: 'guler', name: 'Güler Anneanne', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    // İki kız kardeş (Selin/Derya) ve iki bacanak (Onur/Tolga): ayırt edilemez yüzler.
    { id: 'selin', name: 'Selin', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#f3e0e9' }) },
    { id: 'derya', name: 'Derya', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#e7eede' }) },
    { id: 'onur', name: 'Onur', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#dce7f0' }) },
    { id: 'tolga', name: 'Tolga', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#e6ddf0' }) },
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

// 3 — Dünürler Tanışıyor: iki taraf + dünür ilişkisi; yüzler ayırt edilemez
const scenario03: ScenarioLevel = {
  id: 'scenario-03',
  mode: 'scenario',
  chapterId: 'dugun',
  title: 'Dünürler Tanışıyor',
  intro: 'Kız isteme sofrası kuruldu. Dünürler karşı karşıya — kim hangi tarafta, çöz bakalım!',
  difficulty: 4,
  slots: [
    { id: 's_k1', x: 0, y: 0, genderHint: 'm' },
    { id: 's_k2', x: 1, y: 0, genderHint: 'f' },
    { id: 's_gelin', x: 0.5, y: 1, genderHint: 'f' },
    { id: 's_d1', x: 3, y: 0, genderHint: 'm' },
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
  zones: [
    { id: 'kiz', label: 'Kız Tarafı', side: 'kiz', rect: { x: -0.3, y: -0.35, w: 1.9, h: 2.25 } },
    { id: 'damat', label: 'Damat Tarafı', side: 'damat', rect: { x: 2.7, y: -0.35, w: 1.9, h: 2.25 } },
  ],
  slotZone: {
    s_k1: 'kiz',
    s_k2: 'kiz',
    s_gelin: 'kiz',
    s_d1: 'damat',
    s_d2: 'damat',
    s_damat: 'damat',
  },
  people: [
    { id: 'lale', name: 'Lale', gender: 'f', tags: ['gelin'], avatar: makeAvatar({ gender: 'f', bgColor: '#f6d9e6' }) },
    { id: 'mert', name: 'Mert', gender: 'm', tags: ['damat'], avatar: makeAvatar({ gender: 'm', bgColor: '#cfe0f2' }) },
    { id: 'riza', name: 'Rıza', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true, bgColor: '#efe2cf' }) },
    { id: 'sevim', name: 'Sevim', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true, bgColor: '#f1e3d2' }) },
    { id: 'vedat', name: 'Vedat', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true, bgColor: '#e9ddd0' }) },
    { id: 'nurcan', name: 'Nurcan', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true, bgColor: '#e8ded2' }) },
  ],
  clues: [
    { id: 'c1', text: 'Lale gelindir, kız tarafındadır.', predicate: { kind: 'side', personId: 'lale', side: 'kiz' } },
    { id: 'c2', text: 'Mert ile Lale evlenecek; karşı taraflardalar.', predicate: { kind: 'differentSide', a: 'mert', b: 'lale' } },
    { id: 'c3', text: 'Rıza, Lale’nin babasıdır.', predicate: { kind: 'relation', a: 'riza', b: 'lale', relation: 'baba' } },
    { id: 'c4', text: 'Rıza ile Vedat dünürdür (çiftin iki babası).', predicate: { kind: 'relation', a: 'riza', b: 'vedat', relation: 'dunur' } },
    { id: 'c5', text: 'Sevim, Lale’nin annesidir.', predicate: { kind: 'relation', a: 'sevim', b: 'lale', relation: 'anne' } },
    { id: 'c6', text: 'Nurcan, Mert’in annesidir.', predicate: { kind: 'relation', a: 'nurcan', b: 'mert', relation: 'anne' } },
  ],
  solution: {
    s_k1: 'riza',
    s_k2: 'sevim',
    s_gelin: 'lale',
    s_d1: 'vedat',
    s_d2: 'nurcan',
    s_damat: 'mert',
  },
};

export const scenarioLevels: ScenarioLevel[] = [scenario01, scenario02, scenario03];
