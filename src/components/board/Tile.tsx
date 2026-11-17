import { useDraggable } from '@dnd-kit/core';
import { Avatar } from '../Avatar';
import type { Person } from '../../types/puzzle';

interface Props {
  person: Person;
  size?: number;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}
export function Tile({ person, size = 56, compact = false, selected = false, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: person.id });
  return (
    <button
      ref={setNodeRef}
      className={`tile ${selected ? 'tile--selected' : ''}`}
      style={{ opacity: isDragging ? 0.35 : 1 }}
      {...listeners}
      {...attributes}
      aria-label={`${person.name} — seç veya sürükle`}
      aria-pressed={selected}
      data-person={person.id}
      onClick={onSelect}
    >
      <Avatar avatar={person.avatar} size={size} name={person.name} />
      {!compact && <span className="tile__name">{person.name}</span>}
    </button>
  );
}
