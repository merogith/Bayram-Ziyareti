import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GameScreen } from '../../src/components/board/GameScreen';
import { useProgress } from '../../src/store/progressStore';

const renderLevel = (levelId: string) =>
  render(
    <MemoryRouter initialEntries={[`/play/${levelId}`]}>
      <Routes>
        <Route path="/play/:levelId" element={<GameScreen />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useProgress.getState().reset();
  useProgress.getState().acknowledgeInstructions();
});
describe('GameScreen selection controls', () => {
  it('finishes a puzzle through the visible person and slot buttons', async () => {
    const user = userEvent.setup();
    renderLevel('tree-01');
    for (const [name, number] of [
      ['Ahmet', 1],
      ['Ayşe', 2],
      ['Mert', 3],
      ['Zeynep', 4],
    ] as const) {
      await user.click(screen.getByRole('button', { name: `${name} — seç veya sürükle` }));
      await user.click(screen.getByRole('button', { name: `${number}. kutu — boş` }));
    }
    expect(screen.getByRole('dialog', { name: 'Helal olsun!' })).toBeInTheDocument();
    expect(useProgress.getState().solvedLevels['tree-01'].stars).toBe(3);
  });
  it('does not win on an incorrect arrangement and shows check feedback', async () => {
    const user = userEvent.setup();
    renderLevel('tree-01');
    await user.click(screen.getByRole('button', { name: 'Ayşe — seç veya sürükle' }));
    await user.click(screen.getByRole('button', { name: '1. kutu — boş' }));
    await user.click(screen.getByRole('button', { name: /^Kontrol et$/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/✓ doğru, × yanlış/)).toBeInTheDocument();
  });
});
