import type { SeatingLevel } from '../../../types/puzzle';
import { SLOT } from '../constants';
import type { SceneGeo } from './sceneGeo';

interface Props {
  level: SeatingLevel;
  geo: SceneGeo;
}

/**
 * Bayram sofrası — a long table drawn behind the row of seats, with a runner
 * down the middle and a "Başköşe" pennant over the head seat (seatOrder[0]).
 */
export function TableScene({ level, geo }: Props) {
  const positions = level.slots.map((s) => geo.pos(s.x, s.y));
  const left = Math.min(...positions.map((p) => p.left)) - 16;
  const right = Math.max(...positions.map((p) => p.left)) + SLOT + 16;
  const top = Math.min(...positions.map((p) => p.top)) - 12;
  const bottom = Math.max(...positions.map((p) => p.top)) + SLOT + 22;

  const headId = level.seatOrder[0];
  const head = headId ? geo.center(headId) : null;

  return (
    <div className="scene scene--table" aria-hidden>
      <div
        className="scene__table"
        style={{ left, top, width: right - left, height: bottom - top }}
      >
        <div className="scene__runner" />
      </div>
      {head && (
        <span className="scene__baskose" style={{ left: head.cx, top: top }}>
          Başköşe
        </span>
      )}
    </div>
  );
}
