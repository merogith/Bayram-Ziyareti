import { useProgress } from '../store/progressStore';

/** Lazily-created shared AudioContext (created on first user gesture). */
let audioCtx: AudioContext | null = null;
const ctx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
};

const tone = (freq: number, start: number, dur: number, gain = 0.12, type: OscillatorType = 'sine') => {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + start;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
};

const soundOn = () => useProgress.getState().settings.sound;
const hapticsOn = () => useProgress.getState().settings.haptics;

const vibrate = (pattern: number | number[]) => {
  if (hapticsOn() && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

export const sfx = {
  drop() {
    if (soundOn()) tone(330, 0, 0.09, 0.1, 'triangle');
    vibrate(8);
  },
  pick() {
    if (soundOn()) tone(440, 0, 0.05, 0.06, 'sine');
  },
  wrong() {
    if (soundOn()) tone(160, 0, 0.18, 0.1, 'sawtooth');
    vibrate([12, 40, 12]);
  },
  win() {
    if (soundOn()) {
      // little ascending "helal olsun" flourish
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.25, 0.12, 'triangle'));
    }
    vibrate([12, 30, 12, 30, 24]);
  },
};
