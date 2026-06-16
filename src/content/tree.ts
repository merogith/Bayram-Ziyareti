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
    // Kemal & Ahmet look alike (both adult men) — you must use the clues, not the face.
    { id: 'kemal', name: 'Kemal', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#dCe7f0' }) },
    { id: 'ahmet', name: 'Ahmet', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#e6ddf0' }) },
    // Elif & Sevgi likewise.
    { id: 'elif', name: 'Elif', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#f3e0e9' }) },
    { id: 'sevgi', name: 'Sevgi', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#e7eede' }) },
    { id: 'can', name: 'Can', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Ahmet, Can’ın babasıdır.', predicate: { kind: 'relation', a: 'ahmet', b: 'can', relation: 'baba' } },
    { id: 'c2', text: 'Kemal ile Ahmet kardeştir.', predicate: { kind: 'relation', a: 'kemal', b: 'ahmet', relation: 'kardes' } },
    { id: 'c3', text: 'Sevgi, Can’ın teyzesidir (annesinin kardeşi).', predicate: { kind: 'relation', a: 'sevgi', b: 'can', relation: 'teyze' } },
    { id: 'c4', text: 'Elif ile Sevgi kardeştir.', predicate: { kind: 'relation', a: 'elif', b: 'sevgi', relation: 'kardes' } },
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
    // Murat & Emre look alike; Aylin & Deniz look alike — disambiguate by the clues.
    { id: 'murat', name: 'Murat', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#dce7f0' }) },
    { id: 'aylin', name: 'Aylin', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#f3e0e9' }) },
    { id: 'deniz', name: 'Deniz', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#e7eede' }) },
    { id: 'emre', name: 'Emre', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#e6ddf0' }) },
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
    // The two brothers (and the two wives) are look-alikes; the elti chain is the only way in.
    { id: 'ali', name: 'Ali', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#dce7f0' }) },
    { id: 'veli', name: 'Veli', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#e6ddf0' }) },
    { id: 'ayse', name: 'Ayşe', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#f3e0e9' }) },
    { id: 'fatma', name: 'Fatma', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#e7eede' }) },
  ],
  clues: [
    { id: 'c1', text: 'Ali, soldaki kardeştir.', predicate: { kind: 'isInSlot', personId: 'ali', slotId: 's_brother1' } },
    { id: 'c2', text: 'Ayşe, Ali’nin eşidir.', predicate: { kind: 'relation', a: 'ayse', b: 'ali', relation: 'esi' } },
    { id: 'c3', text: 'Fatma, Ayşe’nin eltisidir (iki kardeşin eşleri).', predicate: { kind: 'relation', a: 'fatma', b: 'ayse', relation: 'elti' } },
    { id: 'c4', text: 'Veli, Ali’nin kardeşidir.', predicate: { kind: 'relation', a: 'veli', b: 'ali', relation: 'kardes' } },
  ],
  solution: { s_wife1: 'ayse', s_brother1: 'ali', s_brother2: 'veli', s_wife2: 'fatma' },
};

// 6 — Babaanne mi Anneanne mi?: babanın annesi babaanne, annenin annesi anneanne
const level06: TreeLevel = {
  id: 'tree-06',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Babaanne mi Anneanne mi?',
  intro: 'İki nine, iki kucak: babanın annesi babaanne, annenin annesi anneannedir.',
  difficulty: 2,
  slots: [
    { id: 's_babaanne', x: 0, y: 0, genderHint: 'f', label: 'Babaanne' },
    { id: 's_anneanne', x: 3, y: 0, genderHint: 'f', label: 'Anneanne' },
    { id: 's_baba', x: 0.5, y: 1, genderHint: 'm' },
    { id: 's_anne', x: 2.5, y: 1, genderHint: 'f' },
    { id: 's_can', x: 1.5, y: 2, genderHint: 'm' },
  ],
  edges: [
    { from: 's_babaanne', to: 's_baba', type: 'parent' },
    { from: 's_anneanne', to: 's_anne', type: 'parent' },
    { from: 's_baba', to: 's_anne', type: 'spouse' },
    { from: 's_baba', to: 's_can', type: 'parent' },
    { from: 's_anne', to: 's_can', type: 'parent' },
  ],
  people: [
    // The two ninas are look-alikes — only the chain (whose mother?) tells them apart.
    { id: 'hanife', name: 'Hanife', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true, bgColor: '#efe2cf' }) },
    { id: 'sultan', name: 'Sultan', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true, bgColor: '#e9ddd0' }) },
    { id: 'ahmet', name: 'Ahmet', gender: 'm', avatar: makeAvatar({ gender: 'm' }) },
    { id: 'elif', name: 'Elif', gender: 'f', avatar: makeAvatar({ gender: 'f' }) },
    { id: 'can', name: 'Can', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Ahmet, Can’ın babasıdır.', predicate: { kind: 'relation', a: 'ahmet', b: 'can', relation: 'baba' } },
    { id: 'c2', text: 'Elif, Can’ın annesidir.', predicate: { kind: 'relation', a: 'elif', b: 'can', relation: 'anne' } },
    { id: 'c3', text: 'Hanife, Ahmet’in annesidir. (Babanın annesi → babaanne!)', predicate: { kind: 'relation', a: 'hanife', b: 'ahmet', relation: 'anne' } },
    { id: 'c4', text: 'Sultan, Elif’in annesidir. (Annenin annesi → anneanne!)', predicate: { kind: 'relation', a: 'sultan', b: 'elif', relation: 'anne' } },
  ],
  solution: { s_babaanne: 'hanife', s_anneanne: 'sultan', s_baba: 'ahmet', s_anne: 'elif', s_can: 'can' },
};

// 7 — Kuzenler Bir Arada: 3 kuşak, birbirine benzeyen kuzenler; kardeş + kuzen zinciri
const level07: TreeLevel = {
  id: 'tree-07',
  mode: 'tree',
  chapterId: 'soyagaci',
  title: 'Kuzenler Bir Arada',
  intro: 'İki kardeşin çocukları birbirinin kuzeni. Yüzler birbirine benziyor — ipuçlarını zincirle!',
  difficulty: 4,
  slots: [
    { id: 's_dede', x: 1, y: 0, genderHint: 'm', label: 'Dede', fixedPersonId: 'hasan' },
    { id: 's_nine', x: 2, y: 0, genderHint: 'f', label: 'Nine', fixedPersonId: 'ayla' },
    { id: 's_amca', x: 0, y: 1, genderHint: 'm' },
    { id: 's_yenge', x: 1, y: 1, genderHint: 'f' },
    { id: 's_baba', x: 2.5, y: 1, genderHint: 'm' },
    { id: 's_anne', x: 3.5, y: 1, genderHint: 'f' },
    { id: 's_efe', x: 0.5, y: 2, genderHint: 'm' },
    { id: 's_can', x: 2.2, y: 2, genderHint: 'm' },
    { id: 's_zeynep', x: 3.3, y: 2, genderHint: 'f' },
  ],
  edges: [
    { from: 's_dede', to: 's_nine', type: 'spouse' },
    { from: 's_dede', to: 's_amca', type: 'parent' },
    { from: 's_dede', to: 's_baba', type: 'parent' },
    { from: 's_nine', to: 's_amca', type: 'parent' },
    { from: 's_nine', to: 's_baba', type: 'parent' },
    { from: 's_amca', to: 's_yenge', type: 'spouse' },
    { from: 's_baba', to: 's_anne', type: 'spouse' },
    { from: 's_amca', to: 's_efe', type: 'parent' },
    { from: 's_yenge', to: 's_efe', type: 'parent' },
    { from: 's_baba', to: 's_can', type: 'parent' },
    { from: 's_anne', to: 's_can', type: 'parent' },
    { from: 's_baba', to: 's_zeynep', type: 'parent' },
    { from: 's_anne', to: 's_zeynep', type: 'parent' },
  ],
  people: [
    { id: 'hasan', name: 'Hasan Dede', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'old', mustache: true }) },
    { id: 'ayla', name: 'Ayla Nine', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'old', headscarf: true }) },
    // İki kardeş baba/amca: ayırt edilemez yüzler.
    { id: 'kemal', name: 'Kemal', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#dce7f0' }) },
    { id: 'ahmet', name: 'Ahmet', gender: 'm', avatar: makeAvatar({ gender: 'm', bgColor: '#e6ddf0' }) },
    // İki gelin (yenge/anne): ayırt edilemez yüzler.
    { id: 'sila', name: 'Sıla', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#f3e0e9' }) },
    { id: 'elif', name: 'Elif', gender: 'f', avatar: makeAvatar({ gender: 'f', bgColor: '#e7eede' }) },
    // İki kuzen: ayırt edilemez yüzler.
    { id: 'efe', name: 'Efe', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child', bgColor: '#cfe6f2' }) },
    { id: 'can', name: 'Can', gender: 'm', avatar: makeAvatar({ gender: 'm', ageBand: 'child', bgColor: '#d7eef0' }) },
    { id: 'zeynep', name: 'Zeynep', gender: 'f', avatar: makeAvatar({ gender: 'f', ageBand: 'child' }) },
  ],
  clues: [
    { id: 'c1', text: 'Zeynep ile Can kardeştir.', predicate: { kind: 'relation', a: 'zeynep', b: 'can', relation: 'kardes' } },
    { id: 'c2', text: 'Efe, Can’ın kuzenidir (babalarının kardeş olduğu çocuk).', predicate: { kind: 'relation', a: 'efe', b: 'can', relation: 'kuzen' } },
    { id: 'c3', text: 'Ahmet, Can’ın babasıdır.', predicate: { kind: 'relation', a: 'ahmet', b: 'can', relation: 'baba' } },
    { id: 'c4', text: 'Elif, Zeynep’in annesidir.', predicate: { kind: 'relation', a: 'elif', b: 'zeynep', relation: 'anne' } },
    { id: 'c5', text: 'Sıla, Kemal’in eşidir.', predicate: { kind: 'relation', a: 'sila', b: 'kemal', relation: 'esi' } },
  ],
  solution: {
    s_amca: 'kemal',
    s_yenge: 'sila',
    s_baba: 'ahmet',
    s_anne: 'elif',
    s_efe: 'efe',
    s_can: 'can',
    s_zeynep: 'zeynep',
  },
};

export const treeLevels: TreeLevel[] = [level01, level02, level03, level06, level04, level05, level07];
