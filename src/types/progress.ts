export interface LevelRecord {
  stars: number; // 1..3
  bestMoves?: number;
  ts: number;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  reduceMotion: boolean;
  /** Show red/green correctness rings live, instead of only on "Kontrol et". */
  liveCheck: boolean;
}

export interface Progress {
  version: 1;
  solvedLevels: Record<string, LevelRecord>;
  settings: Settings;
}
