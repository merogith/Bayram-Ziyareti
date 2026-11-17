import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Avatar } from '../Avatar';
import type { Person, Side, TreeSlot } from '../../types/puzzle';

interface Props {
  slot: TreeSlot;
  size: number;
  number: number;
  occupant?: Person;
  fixed?: Person;
  status?: 'ok' | 'bad';
  side?: Side;
  selectedId: string | null;
  onChoose: (slotId: string) => void;
}
export function Slot({
  slot,
  size,
  number,
  occupant,
  fixed,
  status,
  side,
  selectedId,
  onChoose,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id, disabled: !!fixed });
  const drag = useDraggable({
    id: occupant?.id ?? `empty-${slot.id}`,
    disabled: !occupant || !!fixed,
  });
  const person = fixed ?? occupant;
  const label = slot.label ?? `${number}. kutu`;
  const cls = [
    'slot',
    isOver ? 'slot--over' : '',
    status ? `slot--${status}` : '',
    side ? `slot--side-${side}` : '',
    fixed ? 'slot--fixed' : '',
    occupant?.id === selectedId ? 'slot--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const contents = (
    <>
      {person ? (
        <>
          <Avatar avatar={person.avatar} size={size * 0.68} name={person.name} />
          <span className="slot__name">{person.name}</span>
        </>
      ) : (
        <span>{number}</span>
      )}
      <span className="slot__label">
        {label}
        {fixed ? ' 📌' : ''}
      </span>
      {status && (
        <span className="slot__status" aria-hidden>
          {status === 'ok' ? '✓' : '×'}
        </span>
      )}
    </>
  );
  return (
    <div ref={setNodeRef} className={cls} style={{ width: size, height: size }} data-slot={slot.id}>
      {fixed ? (
        <div className="slot__target" aria-label={`${label} — ${fixed.name}, sabit`}>
          {contents}
        </div>
      ) : (
        <button
          ref={drag.setNodeRef}
          className="slot__target"
          {...drag.attributes}
          {...drag.listeners}
          aria-disabled={false}
          aria-roledescription={occupant ? 'draggable' : undefined}
          aria-label={`${label} — ${occupant?.name ?? 'boş'}`}
          aria-pressed={!!occupant && occupant.id === selectedId}
          onClick={() => onChoose(slot.id)}
        >
          {contents}
        </button>
      )}
    </div>
  );
}
