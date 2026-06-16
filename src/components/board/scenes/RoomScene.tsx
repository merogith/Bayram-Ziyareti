import type { ScenarioLevel } from '../../../types/puzzle';
import { COL, ROW } from '../constants';
import type { SceneGeo } from './sceneGeo';

interface Props {
  level: ScenarioLevel;
  geo: SceneGeo;
}

const zoneKind = (id: string): string => {
  if (id.includes('kiz')) return 'kiz';
  if (id.includes('damat')) return 'damat';
  return 'salon';
};

/**
 * Kız isteme / düğün — labeled rooms (salon / kız tarafı / damat tarafı) drawn
 * as panels behind the slots, so placement reads as "sort guests into the room".
 */
export function RoomScene({ level, geo }: Props) {
  const zones = level.zones ?? [];
  return (
    <div className="scene" aria-hidden>
      {zones.map((z) => {
        if (!z.rect) return null;
        const { left, top } = geo.pos(z.rect.x, z.rect.y);
        return (
          <div
            key={z.id}
            className={`scene__zone scene__zone--${zoneKind(z.id)}`}
            style={{ left, top, width: z.rect.w * COL, height: z.rect.h * ROW }}
          >
            <span className="scene__zone-label">{z.label}</span>
          </div>
        );
      })}
    </div>
  );
}
