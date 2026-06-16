import { describe, it, expect } from 'vitest';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GameScreen } from '../../src/components/board/GameScreen';
import { useGame } from '../../src/store/gameStore';
import { getLevel } from '../../src/content';

const renderLevel = (levelId: string) =>
  render(
    <MemoryRouter initialEntries={[`/play/${levelId}`]}>
      <Routes>
        <Route path="/play/:levelId" element={<GameScreen />} />
      </Routes>
    </MemoryRouter>,
  );

describe('GameScreen integration', () => {
  it('shows the win overlay once a level is solved', () => {
    renderLevel('tree-01');
    const level = getLevel('tree-01')!;

    // Drive the store to the authored solution (drag-drop is exercised manually).
    act(() => {
      for (const [slotId, personId] of Object.entries(level.solution)) {
        useGame.getState().place(personId, slotId);
      }
    });

    expect(screen.getByText('Helal olsun!')).toBeInTheDocument();
  });

  it('does not win on an incorrect arrangement', () => {
    renderLevel('tree-02');
    const level = getLevel('tree-02')!;
    const wrong = Object.entries(level.solution);

    act(() => {
      // Swap the first two people into each other's slots.
      useGame.getState().place(wrong[1][1], wrong[0][0]);
      useGame.getState().place(wrong[0][1], wrong[1][0]);
    });

    expect(screen.queryByText('Helal olsun!')).not.toBeInTheDocument();
  });
});
