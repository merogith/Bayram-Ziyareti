import { useMemo } from 'react';
import { Slot } from './Slot';
import { routeGenogram, type Seg } from '../../engine/genogram';
import type { Assignment, Level, Person, Side, TreeEdge } from '../../types/puzzle';

const COL = 88;
const ROW = 116;
const SLOT = 72;

interface Props {
  level: Level;
  assignment: Assignment;
  perSlot: Record<string, boolean>;
  showCheck: boolean;
  scale: number;
  selectedPersonId?: string | null;
  onSlotTap?: (slotId: string) => void;
}

const edgesOf = (level: Level): TreeEdge[] =>
  level.mode === 'tree' || level.mode === 'scenario' ? level.edges : [];

export function PuzzleBoard({
  level,
  assignment,
  perSlot,
  showCheck,
  scale,
  selectedPersonId,
  onSlotTap,
}: Props) {
  const people = useMemo(() => new Map(level.people.map((p) => [p.id, p])), [level]);

  const geo = useMemo(() => {
    const xs = level.slots.map((s) => s.x);
    const ys = level.slots.map((s) => s.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const width = (Math.max(...xs) - minX) * COL + SLOT;
    const height = (Math.max(...ys) - minY) * ROW + SLOT;
    const pos = (sx: number, sy: number) => ({ left: (sx - minX) * COL, top: (sy - minY) * ROW });
    const center = (id: string) => {
      const s = level.slots.find((x) => x.id === id)!;
      const p = pos(s.x, s.y);
      return { cx: p.left + SLOT / 2, cy: p.top + SLOT / 2 };
    };
    return { width, height, pos, center };
  }, [level]);

  const sideOf = useMemo(() => {
    const m = new Map<string, Side>();
    if (level.mode === 'scenario' && level.sides) {
      level.sides.kiz.forEach((s) => m.set(s, 'kiz'));
      level.sides.damat.forEach((s) => m.set(s, 'damat'));
    }
    return m;
  }, [level]);

  const edges = edgesOf(level);

  const plan = useMemo(
    () => routeGenogram(level.slots, edges, { col: COL, row: ROW, slot: SLOT }),
    [level, edges],
  );

  const line = (s: Seg, cls: string, i: number) => (
    <line key={`${cls}-${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className={cls} />
  );

  return (
    <div
      className="board"
      style={{
        width: geo.width,
        height: geo.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <svg className="board__edges" width={geo.width} height={geo.height} aria-hidden>
        {plan.buses.map((s, i) => line(s, 'edge edge--parent', i))}
        {plan.drops.map((s, i) => line(s, 'edge edge--parent', 100 + i))}
        {plan.childStubs.map((s, i) => line(s, 'edge edge--parent', 200 + i))}
        {plan.marriages.map((s, i) => line(s, 'edge edge--spouse', i))}
      </svg>

      {level.slots.map((slot) => {
        const { left, top } = geo.pos(slot.x, slot.y);
        const occupantId = assignment[slot.id];
        const occupant: Person | undefined = occupantId ? people.get(occupantId) : undefined;
        const fixed: Person | undefined = slot.fixedPersonId ? people.get(slot.fixedPersonId) : undefined;
        const status =
          showCheck && occupant ? (perSlot[slot.id] ? 'ok' : 'bad') : undefined;
        const selecting = !!selectedPersonId;
        const isTarget = selecting && !slot.fixedPersonId && occupantId !== selectedPersonId;
        const picked = !!occupantId && occupantId === selectedPersonId;
        return (
          <div key={slot.id} className="board__slot" style={{ left, top }}>
            <Slot
              slot={slot}
              size={SLOT}
              occupant={occupant}
              fixed={fixed}
              status={status}
              side={sideOf.get(slot.id)}
              isTarget={isTarget}
              picked={picked}
              onTap={onSlotTap ? () => onSlotTap(slot.id) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

export const boardConstants = { COL, ROW, SLOT };

/** Virtual canvas size for a level, used to compute the auto-fit scale. */
export const boardSize = (level: Level) => {
  const xs = level.slots.map((s) => s.x);
  const ys = level.slots.map((s) => s.y);
  return {
    width: (Math.max(...xs) - Math.min(...xs)) * COL + SLOT,
    height: (Math.max(...ys) - Math.min(...ys)) * ROW + SLOT,
  };
};
