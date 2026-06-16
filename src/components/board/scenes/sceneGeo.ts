/** Geometry helpers shared by the themed scene layers and PuzzleBoard. */
export interface SceneGeo {
  width: number;
  height: number;
  pos: (x: number, y: number) => { left: number; top: number };
  center: (id: string) => { cx: number; cy: number };
}
