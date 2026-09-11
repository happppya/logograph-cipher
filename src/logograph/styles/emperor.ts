import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const FRAME = { leftWall: 1, rightWall: 2, ceiling: 4, floor: 8, pillars: 16 } as const;
const CROWN = { slab: 1, colonnade: 2, belfry: 4, leftWingWall: 8, rightWingWall: 16 } as const;
const HEART = { chamber: 1, band: 2, columns: 4, core: 8, couplers: 16 } as const;
const ROOTS = { taproot: 1, leftFoot: 2, rightFoot: 4, foundation: 8, stabilizers: 16 } as const;

/**
 * Emperor: architecture. Horizontal and vertical strokes only — not one diagonal or curve —
 * and the heaviest weights of the four styles, so it reads as a built structure.
 * Zones: frame on the 15-85 square, crown y 18-36, heart y 36-66 (its couplers reach x 10-90),
 * roots y 62-90. The bands meet on purpose — the heart's columns tie the crown to the roots.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [frame, crown, heart, roots] = input;

  const frameParts: string[] = [];
  if (frame & FRAME.leftWall) frameParts.push('M 15 15 L 15 85 ');
  if (frame & FRAME.rightWall) frameParts.push('M 85 15 L 85 85 ');
  if (frame & FRAME.ceiling) frameParts.push('M 15 15 L 85 15 ');
  if (frame & FRAME.floor) frameParts.push('M 15 85 L 85 85 ');
  if (frame & FRAME.pillars) frameParts.push('M 20 20 L 20 80 M 80 20 L 80 80 ');
  if (frame === 0) frameParts.push('M 22 15 L 78 15 M 22 85 L 78 85 ');

  const crownParts: string[] = [];
  if (crown & CROWN.slab) crownParts.push('M 22 24 L 78 24 M 22 32 L 78 32 ');
  if (crown & CROWN.colonnade) crownParts.push('M 34 18 L 34 36 M 42 18 L 42 36 M 58 18 L 58 36 M 66 18 L 66 36 ');
  if (crown & CROWN.belfry) crownParts.push('M 44 18 L 56 18 L 56 36 L 44 36 Z M 44 27 L 56 27 M 50 18 L 50 36 ');
  if (crown & CROWN.leftWingWall) crownParts.push('M 22 18 L 22 36 M 22 18 L 32 18 M 22 27 L 32 27 M 22 36 L 32 36 ');
  if (crown & CROWN.rightWingWall) crownParts.push('M 78 18 L 78 36 M 78 18 L 68 18 M 78 27 L 68 27 M 78 36 L 68 36 ');

  const heartParts: string[] = [];
  if (heart & HEART.chamber) heartParts.push('M 26 40 L 74 40 L 74 62 L 26 62 Z ');
  if (heart & HEART.band) heartParts.push('M 26 48 L 74 48 M 26 54 L 74 54 ');
  if (heart & HEART.columns) heartParts.push('M 42 36 L 42 66 M 58 36 L 58 66 M 42 51 L 58 51 ');
  if (heart & HEART.core) heartParts.push('M 34 44 L 66 44 L 66 58 L 34 58 Z ');
  if (heart & HEART.couplers) heartParts.push('M 10 44 L 26 44 M 74 44 L 90 44 M 10 58 L 26 58 M 74 58 L 90 58 ');

  const rootParts: string[] = [];
  if (roots & ROOTS.taproot) rootParts.push('M 44 62 L 44 90 M 56 62 L 56 90 M 44 76 L 56 76 ');
  if (roots & ROOTS.leftFoot) rootParts.push('M 44 76 L 24 76 L 24 88 M 24 82 L 34 82 M 34 76 L 34 88 ');
  if (roots & ROOTS.rightFoot) rootParts.push('M 56 76 L 76 76 L 76 88 M 76 82 L 66 82 M 66 76 L 66 88 ');
  if (roots & ROOTS.foundation) rootParts.push('M 18 88 L 82 88 M 26 82 L 74 82 ');
  if (roots & ROOTS.stabilizers) rootParts.push('M 22 68 L 30 68 L 30 84 M 78 68 L 70 68 L 70 84 ');

  return [
    { d: frameParts.join(''), className: 'text-emerald-500', strokeWidth: 3.5 },
    { d: crownParts.join(''), className: 'text-emerald-400', strokeWidth: 3 },
    { d: heartParts.join(''), className: 'text-emerald-300', strokeWidth: 2.75 },
    { d: rootParts.join(''), className: 'text-emerald-600', strokeWidth: 3.5 },
  ];
};

export const EMPEROR_STYLE: GlyphStyle = {
  name: 'Emperor',
  radicals: ['Frame (Chassis)', 'Crown (Roof)', 'Heart (Core)', 'Roots (Appendages)'],
  build,
};
