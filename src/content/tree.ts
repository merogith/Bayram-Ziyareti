import { makeAvatar } from '../types/avatar';
import type { TreeLevel } from '../types/puzzle';

/**
 * Soyağacı (family-tree) levels. Kinship terms are derived from the edges; the
 * clues name people and their relations, and the player deduces the placement.
 * Every level is verified to be uniquely solvable by tests/engine/content.test.ts.
 */

// 1 — Çekirdek Aile: anne/baba/oğul/kız
const level01: TreeLevel = {
  id: 'tree-01',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Çekirdek Aile',
  intro: 'Her şey küçük bir aileyle başlar. Anne, baba, bir oğul, bir kız.',
  difficulty: 1,
  slots: [
    { id: 's_baba', x: 1, y: 0, genderHint: 'm' },
    { id: 's_anne', x: 2, y: 0, genderHint: 'f' },
    { id: 's_ogul', x: 1, y: 1, genderHint: 'm' },
    { id: 's_kiz', x: 2, y: 1, genderHint: 'f' },
  ],
  edges: [
    { from: 's_baba', to: 's_anne', type: 'spouse' },
    { from: 's_baba', to: 's_ogul', type: 'parent' },
    { from: 's_baba', to: 's_kiz', type: 'parent' },
    { from: 's_anne', to: 's_ogul', type: 'parent' },
    { from: 's_anne', to: 's_kiz', type: 'parent' },
  ],
  people: [
    { id: 'ahmet', name: 'Ahmet', gender: 'm', avatar: makeAvatar({ gender: 'm', mustache: true }) },
    { id: 'ayse', name: 'Ayşe', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'mert', name: 'Mert', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child' }) },
    { id: 'zeynep', name: 'Zeynep', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Ahmet, Mert’in babasıdır.', predicate: { kind: 'relation', a: 'ahmet', b: 'mert', relation: 'baba' } },
    { id: 'c2', text: 'Zeynep, Ayşe’nin kızıdır.', predicate: { kind: 'relation', a: 'zeynep', b: 'ayse', relation: 'kiz' } },
    { id: 'c3', text: 'Ahmet ile Ayşe karı kocadır.', predicate: { kind: 'relation', a: 'ayse', b: 'ahmet', relation: 'esi' } },
  ],
  solution: { s_baba: 'ahmet', s_anne: 'ayse', s_ogul: 'mert', s_kiz: 'zeynep' },
};

// 2 — Dede ile Nine: torun kavramı
const level02: TreeLevel = {
  id: 'tree-02',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Dede ile Nine',
  intro: 'Bayramda ilk el öpülen kapı: dede ile ninenin evi.',
  difficulty: 1,
  slots: [
    { id: 's_dede', x: 1, y: 0, genderHint: 'm' },
    { id: 's_nine', x: 2, y: 0, genderHint: 'f' },
    { id: 's_baba', x: 1, y: 1, genderHint: 'm' },
    { id: 's_anne', x: 2, y: 1, genderHint: 'f' },
    { id: 's_torun', x: 1.5, y: 2, genderHint: 'm' },
  ],
  edges: [
    { from: 's_dede', to: 's_nine', type: 'spouse' },
    { from: 's_dede', to: 's_baba', type: 'parent' },
    { from: 's_nine', to: 's_baba', type: 'parent' },
    { from: 's_baba', to: 's_anne', type: 'spouse' },
    { from: 's_baba', to: 's_torun', type: 'parent' },
    { from: 's_anne', to: 's_torun', type: 'parent' },
  ],
  people: [
    { id: 'osman', name: 'Osman', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'hatice', name: 'Hatice', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'ahmet', name: 'Ahmet', gender: 'm', avatar: makeAvatar({ gender: 'm', mustache: true }) },
    { id: 'ayse', name: 'Ayşe', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'mert', name: 'Mert', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Osman, Mert’in dedesidir.', predicate: { kind: 'relation', a: 'osman', b: 'mert', relation: 'dede' } },
    { id: 'c2', text: 'Hatice, Osman’ın eşidir.', predicate: { kind: 'relation', a: 'hatice', b: 'osman', relation: 'esi' } },
    { id: 'c3', text: 'Ahmet, Mert’in babasıdır.', predicate: { kind: 'relation', a: 'ahmet', b: 'mert', relation: 'baba' } },
    { id: 'c4', text: 'Ayşe, Ahmet’in eşidir.', predicate: { kind: 'relation', a: 'ayse', b: 'ahmet', relation: 'esi' } },
  ],
  solution: { s_dede: 'osman', s_nine: 'hatice', s_baba: 'ahmet', s_anne: 'ayse', s_torun: 'mert' },
};

// 3 — Amca mı Dayı mı?: amca/dayı, hala/teyze ayrımı (fixed dede & anneanne anchorları)
const level03: TreeLevel = {
  id: 'tree-03',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Amca mı Dayı mı?',
  intro: 'Klasik kafa karışıklığı: babanın kardeşi amca, annenin kardeşi dayı!',
  difficulty: 2,
  slots: [
    { id: 's_pdede', x: 0, y: 0, genderHint: 'm', label: 'Dede', fixedPersonId: 'hasan' },
    { id: 's_mnine', x: 3, y: 0, genderHint: 'f', label: 'Anneanne', fixedPersonId: 'fatma' },
    { id: 's_amca', x: -1, y: 1, genderHint: 'm' },
    { id: 's_baba', x: 0.5, y: 1, genderHint: 'm' },
    { id: 's_anne', x: 2, y: 1, genderHint: 'f' },
    { id: 's_teyze', x: 3.5, y: 1, genderHint: 'f' },
    { id: 's_can', x: 1.25, y: 2, genderHint: 'm' },
  ],
  edges: [
    { from: 's_pdede', to: 's_amca', type: 'parent' },
    { from: 's_pdede', to: 's_baba', type: 'parent' },
    { from: 's_mnine', to: 's_anne', type: 'parent' },
    { from: 's_mnine', to: 's_teyze', type: 'parent' },
    { from: 's_baba', to: 's_anne', type: 'spouse' },
    { from: 's_baba', to: 's_can', type: 'parent' },
    { from: 's_anne', to: 's_can', type: 'parent' },
  ],
  people: [
    { id: 'hasan', name: 'Hasan Dede', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'fatma', name: 'Fatma Anneanne', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'kemal', name: 'Kemal', gender: 'm', avatar: makeAvatar({ gender: 'm', beard: true }) },
    { id: 'ahmet', name: 'Ahmet', gender: 'm', avatar: makeAvatar({ gender: 'm', mustache: true }) },
    { id: 'elif', name: 'Elif', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'sevgi', name: 'Sevgi', gender: 'f', avatar: makeAvatar({ gender: 'f', glasses: true }) },
    { id: 'can', name: 'Can', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Ahmet, Can’ın babasıdır.', predicate: { kind: 'relation', a: 'ahmet', b: 'can', relation: 'baba' } },
    { id: 'c2', text: 'Elif, Can’ın annesidir.', predicate: { kind: 'relation', a: 'elif', b: 'can', relation: 'anne' } },
    { id: 'c3', text: 'Kemal, Can’ın amcasıdır (babasının kardeşi).', predicate: { kind: 'relation', a: 'kemal', b: 'can', relation: 'amca' } },
    { id: 'c4', text: 'Sevgi, Can’ın teyzesidir (annesinin kardeşi).', predicate: { kind: 'relation', a: 'sevgi', b: 'can', relation: 'teyze' } },
  ],
  solution: { s_amca: 'kemal', s_baba: 'ahmet', s_anne: 'elif', s_teyze: 'sevgi', s_can: 'can' },
};

// 4 — Gelin Geldi: gelin, kayınço, görümce (fixed kayınvalide & kayınpeder)
const level04: TreeLevel = {
  id: 'tree-04',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Gelin Geldi',
  intro: 'Eve yeni bir gelin geldi. Peki bu kalabalıkta kim kimin nesi olur?',
  difficulty: 3,
  slots: [
    { id: 's_kpeder', x: 1, y: 0, genderHint: 'm', label: 'Kayınpeder', fixedPersonId: 'huseyin' },
    { id: 's_kvalide', x: 2, y: 0, genderHint: 'f', label: 'Kayınvalide', fixedPersonId: 'nuran' },
    { id: 's_kayinco', x: 0, y: 1, genderHint: 'm' },
    { id: 's_gorumce', x: 1, y: 1, genderHint: 'f' },
    { id: 's_oglan', x: 2, y: 1, genderHint: 'm' },
    { id: 's_gelin', x: 3, y: 1, genderHint: 'f' },
  ],
  edges: [
    { from: 's_kpeder', to: 's_kvalide', type: 'spouse' },
    { from: 's_kpeder', to: 's_kayinco', type: 'parent' },
    { from: 's_kpeder', to: 's_gorumce', type: 'parent' },
    { from: 's_kpeder', to: 's_oglan', type: 'parent' },
    { from: 's_kvalide', to: 's_kayinco', type: 'parent' },
    { from: 's_kvalide', to: 's_gorumce', type: 'parent' },
    { from: 's_kvalide', to: 's_oglan', type: 'parent' },
    { from: 's_oglan', to: 's_gelin', type: 'spouse' },
  ],
  people: [
    { id: 'huseyin', name: 'Hüseyin', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'nuran', name: 'Nuran', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'murat', name: 'Murat', gender: 'm', avatar: makeAvatar({ gender: 'm', beard: true }) },
    { id: 'aylin', name: 'Aylin', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'deniz', name: 'Deniz', gender: 'f', avatar: makeAvatar({ gender: 'f', glasses: true }) },
    { id: 'emre', name: 'Emre', gender: 'm', avatar: makeAvatar({ gender: 'm' }) },
  ],
  clues: [
    { id: 'c1', text: 'Aylin, Murat ile evlidir.', predicate: { kind: 'relation', a: 'aylin', b: 'murat', relation: 'esi' } },
    { id: 'c2', text: 'Aylin, Hüseyin’in gelinidir.', predicate: { kind: 'relation', a: 'aylin', b: 'huseyin', relation: 'gelin' } },
    { id: 'c3', text: 'Deniz, Aylin’in görümcesidir (kocasının kız kardeşi).', predicate: { kind: 'relation', a: 'deniz', b: 'aylin', relation: 'gorumce' } },
    { id: 'c4', text: 'Emre, Aylin’in kayıncosudur (kocasının erkek kardeşi).', predicate: { kind: 'relation', a: 'emre', b: 'aylin', relation: 'kayinco' } },
  ],
  solution: { s_kayinco: 'emre', s_gorumce: 'deniz', s_oglan: 'murat', s_gelin: 'aylin' },
};

// 5 — Eltiler Savaşı: elti & bacanak (asimetri için Ali soldaki kardeş olarak sabitlenir)
const level05: TreeLevel = {
  id: 'tree-05',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Eltiler Savaşı',
  intro: 'İki kardeşin eşleri birbirinin eltisidir. Sofrada tatlı bir rekabet başlar!',
  difficulty: 3,
  slots: [
    { id: 's_dede', x: 1.5, y: 0, genderHint: 'm', label: 'Dede', fixedPersonId: 'rasim' },
    { id: 's_nine', x: 2.5, y: 0, genderHint: 'f', label: 'Nine', fixedPersonId: 'samiye' },
    { id: 's_wife1', x: 0, y: 1, genderHint: 'f' },
    { id: 's_brother1', x: 1, y: 1, genderHint: 'm' },
    { id: 's_brother2', x: 3, y: 1, genderHint: 'm' },
    { id: 's_wife2', x: 4, y: 1, genderHint: 'f' },
  ],
  edges: [
    { from: 's_dede', to: 's_nine', type: 'spouse' },
    { from: 's_dede', to: 's_brother1', type: 'parent' },
    { from: 's_dede', to: 's_brother2', type: 'parent' },
    { from: 's_nine', to: 's_brother1', type: 'parent' },
    { from: 's_nine', to: 's_brother2', type: 'parent' },
    { from: 's_brother1', to: 's_wife1', type: 'spouse' },
    { from: 's_brother2', to: 's_wife2', type: 'spouse' },
  ],
  people: [
    { id: 'rasim', name: 'Rasim Dede', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'samiye', name: 'Samiye Nine', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    { id: 'ali', name: 'Ali', gender: 'm', avatar: makeAvatar({ gender: 'm', mustache: true }) },
    { id: 'veli', name: 'Veli', gender: 'm', avatar: makeAvatar({ gender: 'm', beard: true }) },
    { id: 'ayse', name: 'Ayşe', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'fatma', name: 'Fatma', gender: 'f', avatar: makeAvatar({ gender: 'f', glasses: true }) },
  ],
  clues: [
    { id: 'c1', text: 'Ali, soldaki kardeştir.', predicate: { kind: 'isInSlot', personId: 'ali', slotId: 's_brother1' } },
    { id: 'c2', text: 'Ayşe, Ali’nin eşidir.', predicate: { kind: 'relation', a: 'ayse', b: 'ali', relation: 'esi' } },
    { id: 'c3', text: 'Fatma, Ayşe’nin eltisidir (iki kardeşin eşleri).', predicate: { kind: 'relation', a: 'fatma', b: 'ayse', relation: 'elti' } },
    { id: 'c4', text: 'Veli, Ali’nin kardeşidir.', predicate: { kind: 'relation', a: 'veli', b: 'ali', relation: 'kardes' } },
  ],
  solution: { s_wife1: 'ayse', s_brother1: 'ali', s_brother2: 'veli', s_wife2: 'fatma' },
};

export const treeLevels: TreeLevel[] = [level01, level02, level03, level04, level05];
