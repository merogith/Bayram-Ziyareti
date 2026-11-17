import { beforeEach, describe, expect, it } from 'vitest';
import { getLevel } from '../../src/content';
import { useGame } from '../../src/store/gameStore';
import { useProgress } from '../../src/store/progressStore';

beforeEach(() => useProgress.getState().reset());
describe('safe puzzle moves and recovery', () => {
  it('rejects fixed and missing targets without removing the selected person', () => {
    const level = getLevel('tree-03')!;
    useGame.getState().load(level);
    const fixed = level.slots.find((s) => s.fixedPersonId)!;
    const [slot, person] = Object.entries(level.solution)[0];
    expect(useGame.getState().place(person, slot)).toBe(true);
    for (const target of [fixed.id, 'missing-slot'])
      expect(useGame.getState().place(person, target)).toBe(false);
    expect(useGame.getState().assignment).toEqual({ [slot]: person });
    expect(useGame.getState().moves).toBe(1);
    expect(useGame.getState().place(fixed.fixedPersonId!, slot)).toBe(false);
    expect(useGame.getState().place('missing-person', slot)).toBe(false);
  });
  it('swaps two occupied positions and returns a displaced person to the tray when placing from it', () => {
    useGame.getState().load(getLevel('tree-01')!);
    useGame.getState().place('ahmet', 's_baba');
    useGame.getState().place('ayse', 's_anne');
    useGame.getState().place('ahmet', 's_anne');
    expect(useGame.getState().assignment).toEqual({ s_baba: 'ayse', s_anne: 'ahmet' });
    useGame.getState().place('mert', 's_anne');
    expect(useGame.getState().assignment).toEqual({ s_baba: 'ayse', s_anne: 'mert' });
    expect(useGame.getState().place('mert', 's_anne')).toBe(false);
    useGame.getState().place('mert', null);
    expect(useGame.getState().assignment).toEqual({ s_baba: 'ayse' });
  });
  it('restores partial work, counts hints, and resets just the current board', () => {
    const level = getLevel('tree-01')!;
    useGame.getState().load(level);
    expect(useGame.getState().hint()).toContain('Ahmet');
    useGame.getState().load(level);
    expect(useGame.getState().hints).toBe(1);
    expect(useGame.getState().assignment.s_baba).toBe('ahmet');
    useProgress.getState().recordSolve('tree-02', 2, 7);
    useGame.getState().reset();
    expect(useGame.getState().assignment).toEqual({});
    expect(useGame.getState().hints).toBe(0);
    expect(useProgress.getState().drafts['tree-01']).toBeUndefined();
    expect(useProgress.getState().solvedLevels['tree-02'].stars).toBe(2);
  });
});
