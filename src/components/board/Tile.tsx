import { useDraggable } from '@dnd-kit/core';
import { Avatar } from '../Avatar';
import type { Person } from '../../types/puzzle';

interface Props {
  person: Person;
  size?: number;
  /** Hide the name label (used for compact in-slot rendering). */
  compact?: boolean;
  /** Tap-to-place: highlighted as the currently selected face. */
  selected?: boolean;
  /** Tap-to-place: called on a plain tap (no drag). */
  onSelect?: (personId: string) => void;
}

export function Tile({ person, size = 56, compact = false, selected = false, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: person.id,
    data: { personId: person.id },
  });

  return (
    <button
      ref={setNodeRef}
      className={`tile ${selected ? 'tile--selected' : ''}`}
      style={{ opacity: isDragging ? 0.35 : 1, touchAction: 'none' }}
      aria-label={`${person.name}${selected ? ' (seçili)' : ''} — sürükle veya dokun`}
      onClick={onSelect ? () => onSelect(person.id) : undefined}
      {...listeners}
      {...attributes}
    >
      <Avatar avatar={person.avatar} size={size} name={person.name} />
      {!compact && <span className="tile__name">{person.name}</span>}
    </button>
  );
}
