import { useDraggable } from '@dnd-kit/core';
import { Avatar } from '../Avatar';
import type { Person } from '../../types/puzzle';

interface Props {
  person: Person;
  size?: number;
  /** Hide the name label (used for compact in-slot rendering). */
  compact?: boolean;
}

export function Tile({ person, size = 56, compact = false }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: person.id,
    data: { personId: person.id },
  });

  return (
    <button
      ref={setNodeRef}
      className="tile"
      style={{ opacity: isDragging ? 0.35 : 1, touchAction: 'none' }}
      aria-label={`${person.name} — sürükle`}
      {...listeners}
      {...attributes}
    >
      <Avatar avatar={person.avatar} size={size} name={person.name} />
      {!compact && <span className="tile__name">{person.name}</span>}
    </button>
  );
}
