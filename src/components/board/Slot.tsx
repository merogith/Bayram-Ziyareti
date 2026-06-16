import { useDroppable } from '@dnd-kit/core';
import { Tile } from './Tile';
import type { Person, Side, TreeSlot } from '../../types/puzzle';

interface Props {
  slot: TreeSlot;
  size: number;
  occupant?: Person;
  fixed?: Person;
  /** 'ok' | 'bad' | undefined — correctness ring when checking. */
  status?: 'ok' | 'bad';
  side?: Side;
  /** Tap-to-place: a face is selected and this slot is a valid drop target. */
  isTarget?: boolean;
  /** Tap-to-place: this slot's occupant is the currently selected face. */
  picked?: boolean;
  /** Tap-to-place: called when the slot is tapped. */
  onTap?: () => void;
}

export function Slot({ slot, size, occupant, fixed, status, side, isTarget, picked, onTap }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id, data: { slotId: slot.id } });
  const person = occupant ?? fixed;

  const cls = [
    'slot',
    isOver ? 'slot--over' : '',
    status ? `slot--${status}` : '',
    side ? `slot--side-${side}` : '',
    fixed ? 'slot--fixed' : '',
    isTarget ? 'slot--target' : '',
    picked ? 'slot--picked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setNodeRef}
      className={cls}
      style={{ width: size, height: size }}
      aria-label={slot.label ? `${slot.label} kutusu` : 'akrabalık kutusu'}
      onClick={fixed ? undefined : onTap}
    >
      {person ? (
        fixed ? (
          <div className="slot__fixed-person">
            <Tile person={person} size={size * 0.82} compact />
            <span className="slot__name">{person.name}</span>
          </div>
        ) : (
          <>
            <Tile person={person} size={size * 0.82} compact />
            <span className="slot__name">{person.name}</span>
          </>
        )
      ) : (
        slot.label && <span className="slot__label">{slot.label}</span>
      )}
      {person && slot.label && <span className="slot__label slot__label--mini">{slot.label}</span>}
    </div>
  );
}
