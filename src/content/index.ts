import type { Chapter, Level, Mode } from '../types/puzzle';
import { treeLevels } from './tree';
import { seatingLevels } from './seating';
import { scenarioLevels } from './scenario';

export const allLevels: Level[] = [...treeLevels, ...seatingLevels, ...scenarioLevels];

const levelById = new Map(allLevels.map((l) => [l.id, l]));

export const getLevel = (id: string): Level | undefined => levelById.get(id);

export const chapters: Chapter[] = [
  {
    id: 'soyagaci',
    mode: 'tree',
    title: 'Soyağacı',
    emoji: '🌳',
    blurb: 'Eltiler, bacanaklar, dünürler… Akrabalığı yerli yerine koy.',
    levelIds: treeLevels.map((l) => l.id),
  },
  {
    id: 'sofra',
    mode: 'seating',
    title: 'Bayram Sofrası',
    emoji: '🍽️',
    blurb: 'Başköşe kimin? El öpme sırası nasıl? Sofrayı kıdeme göre diz.',
    levelIds: seatingLevels.map((l) => l.id),
  },
  {
    id: 'dugun',
    mode: 'scenario',
    title: 'Kız İsteme & Düğün',
    emoji: '💍',
    blurb: 'Dünürler, bacanaklar, iki taraf. Düğün telaşında kim kimin nesi?',
    levelIds: scenarioLevels.map((l) => l.id),
  },
];

export const chapterById = new Map(chapters.map((c) => [c.id, c]));

export const chaptersByMode = (mode: Mode) => chapters.filter((c) => c.mode === mode);
