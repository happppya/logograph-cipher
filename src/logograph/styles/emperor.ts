import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const FRAME = { leftWall: 1, rightWall: 2, ceiling: 4, floor: 8, pillars: 16 } as const;
const CROWN = { bar: 1, roof: 2, kingpin: 4, leftSlope: 8, rightSlope: 16 } as const;
const HEART = { chamber: 1, divider: 2, conduit: 4, cross: 8, couplers: 16 } as const;
const ROOTS = { taproot: 1, leftLeg: 2, rightLeg: 4, foundation: 8, stabilizers: 16 } as const;

/**
 * Emperor: strict horizontal/vertical "bento" grid, no zone bleeding.
 * Zones: frame on the 15-85 square, crown at y 22-34, heart at x 25-75 / y 40-60, roots at y 66-80.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [frame, crown, heart, roots] = input;

  const frameParts: string[] = [];
  if (frame & FRAME.leftWall) frameParts.push('M 15 15 L 15 85 ');
  if (frame & FRAME.rightWall) frameParts.push('M 85 15 L 85 85 ');
  if (frame & FRAME.ceiling) frameParts.push('M 15 15 L 85 15 ');
  if (frame & FRAME.floor) frameParts.push('M 15 85 L 85 85 ');
  if (frame & FRAME.pillars) frameParts.push('M 18 20 L 18 80 M 82 20 L 82 80 ');
  if (frame === 0) frameParts.push('M 25 15 L 75 15 M 25 85 L 75 85 ');

  const crownParts: string[] = [];
  if (crown & CROWN.bar) crownParts.push('M 25 24 L 75 24 ');
  if (crown & CROWN.roof) crownParts.push('M 35 30 L 50 22 L 65 30 ');
  if (crown & CROWN.kingpin) crownParts.push('M 50 22 L 50 34 ');
  if (crown & CROWN.leftSlope) crownParts.push('M 28 34 L 35 26 ');
  if (crown & CROWN.rightSlope) crownParts.push('M 72 34 L 65 26 ');

  const heartParts: string[] = [];
  if (heart & HEART.chamber) heartParts.push('M 30 42 L 70 42 L 70 58 L 30 58 Z ');
  if (heart & HEART.divider) heartParts.push('M 30 50 L 70 50 ');
  if (heart & HEART.conduit) heartParts.push('M 50 40 L 50 60 ');
  if (heart & HEART.cross) heartParts.push('M 38 45 L 62 55 M 62 45 L 38 55 ');
  if (heart & HEART.couplers) heartParts.push('M 22 50 L 28 50 M 72 50 L 78 50 ');

  const rootParts: string[] = [];
  if (roots & ROOTS.taproot) rootParts.push('M 50 66 L 50 80 ');
  if (roots & ROOTS.leftLeg) rootParts.push('M 48 70 L 28 78 ');
  if (roots & ROOTS.rightLeg) rootParts.push('M 52 70 L 72 78 ');
  if (roots & ROOTS.foundation) rootParts.push('M 35 80 L 65 80 ');
  if (roots & ROOTS.stabilizers) rootParts.push('M 25 68 L 25 76 M 75 68 L 75 76 ');

  return [
    { d: frameParts.join(''), className: 'text-emerald-500', strokeWidth: 3 },
    { d: crownParts.join(''), className: 'text-emerald-400', strokeWidth: 2 },
    { d: heartParts.join(''), className: 'text-emerald-300', strokeWidth: 1.5 },
    { d: rootParts.join(''), className: 'text-emerald-600', strokeWidth: 2.5 },
  ];
};

export const EMPEROR_STYLE: GlyphStyle = {
  name: 'Emperor',
  radicals: ['Frame (Chassis)', 'Crown (Roof)', 'Heart (Core)', 'Roots (Appendages)'],
  build,
};
