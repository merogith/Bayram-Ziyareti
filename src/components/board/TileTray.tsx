import { useDroppable } from '@dnd-kit/core';
import { Tile } from './Tile';
import type { Person } from '../../types/puzzle';
interface Props {
  people: Person[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReturn: () => void;
  canReturn: boolean;
}
export function TileTray({ people, selectedId, onSelect, onReturn, canReturn }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'tray' });
  return (
    <>
      <div
        ref={setNodeRef}
        className={`tray ${isOver ? 'tray--over' : ''}`}
        aria-label="Yerleştirilecek kişiler"
      >
        {people.length === 0 ? (
          <span className="tray__empty muted">Tüm yüzler yerleşti. İpuçlarını kontrol et!</span>
        ) : (
          people.map((p) => (
            <Tile
              key={p.id}
              person={p}
              size={52}
              selected={selectedId === p.id}
              onSelect={() => onSelect(p.id)}
            />
          ))
        )}
      </div>
      {canReturn && (
        <button className="btn btn--ghost game__check" onClick={onReturn}>
          Seçili kişiyi geri al
        </button>
      )}
    </>
  );
}
