import { useState } from 'react';
import type { ClueCard } from '../../types/puzzle';
import { tr } from '../../i18n/tr';

interface Props {
  clues: ClueCard[];
  satisfied: Record<string, boolean>;
}

export function CluePanel({ clues, satisfied }: Props) {
  const [open, setOpen] = useState(true);
  const done = clues.filter((c) => satisfied[c.id]).length;

  return (
    <section className={`cluepanel ${open ? 'cluepanel--open' : ''}`}>
      <button
        className="cluepanel__handle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>
          📜 {tr.clues}{' '}
          <span className="cluepanel__count">
            {done}/{clues.length}
          </span>
        </span>
        <span className="cluepanel__chevron">{open ? '▾' : '▴'}</span>
      </button>
      {open && (
        <ul className="cluepanel__list">
          {clues.map((c) => (
            <li key={c.id} className={`clue ${satisfied[c.id] ? 'clue--done' : ''}`}>
              <span className="clue__check" aria-hidden>
                {satisfied[c.id] ? '✓' : '•'}
              </span>
              <span className="clue__text">{c.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
