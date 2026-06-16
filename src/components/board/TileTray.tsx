import { useDroppable } from '@dnd-kit/core';
import { Tile } from './Tile';
import type { Person } from '../../types/puzzle';

interface Props {
  people: Person[];
}

/** The pool of not-yet-placed faces. Also a drop target to return a tile. */
export function TileTray({ people }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'tray', data: { tray: true } });
  return (
    <div ref={setNodeRef} className={`tray ${isOver ? 'tray--over' : ''}`}>
      {people.length === 0 ? (
        <span className="tray__empty muted">Tüm yüzler yerleşti — kontrol et!</span>
      ) : (
        people.map((p) => <Tile key={p.id} person={p} size={52} />)
      )}
    </div>
  );
}
