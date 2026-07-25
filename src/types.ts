export type Point = { x: number; y: number };
export type LineType = 'rounded' | 'square' | 'calligraphy';
export type GridType = string | null;

export interface Path {
  points: Point[];
  type: LineType;
  size: number;
  opacity: number;
}
