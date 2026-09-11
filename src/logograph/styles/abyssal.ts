import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const VENT = { leftStalk: 1, rightStalk: 2, serpentine: 4, leftSpur: 8, rightSpur: 16 } as const;
const CURRENT = { upper: 1, lower: 2, shear: 4, inverseShear: 8, spiral: 16 } as const;
const POLYP = { apex: 1, flanking: 2, basal: 4, heart: 8, spores: 16 } as const;
const DEPTH = { leftKelp: 1, rightKelp: 2, midDrift: 4, inverseDrift: 8, benthicSweep: 16 } as const;

/** A node as two half-arcs, so every radical stays a single `d` string. */
const circle = (x: number, y: number, r: number) =>
  `M ${x - r} ${y} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;

/**
 * Abyssal: the organic outlier. Nothing is mirrored and no two limbs are the same length, so
 * the mass always sits off-centre; tendrils are dashed and punctuated by solid nodes, which
 * survives even when the whole glyph is drawn in a single ink color.
 * Paths are ordered back to front (depth, vent, current, polyp): depth is an ambient layer
 * expressed with opacity rather than by nudging coordinates.
 * Extents: depth 2-98, vents 20-96, currents 6-94, polyps keep to x 18-84.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [vent, current, polyp, depth] = input;

  const depthParts: string[] = [];
  if (depth & DEPTH.leftKelp) depthParts.push('M 16 98 C 2 66, 36 34, 14 6 ');
  if (depth & DEPTH.rightKelp) depthParts.push('M 84 98 C 96 70, 64 42, 90 14 ');
  if (depth & DEPTH.midDrift) depthParts.push('M 34 94 C 22 58, 60 46, 42 12 ');
  if (depth & DEPTH.inverseDrift) depthParts.push('M 66 94 C 76 60, 42 50, 58 14 ');
  if (depth & DEPTH.benthicSweep) depthParts.push('M 6 56 Q 48 68 94 44 ');

  const ventParts: string[] = [];
  if (vent & VENT.leftStalk) ventParts.push('M 38 92 Q 30 62 46 34 T 28 10 ');
  if (vent & VENT.rightStalk) ventParts.push('M 68 94 Q 74 66 58 44 T 72 24 ');
  if (vent & VENT.serpentine) ventParts.push('M 52 96 C 52 74, 34 66, 50 46 C 66 28, 50 18, 50 8 ');
  if (vent & VENT.leftSpur) ventParts.push('M 22 84 C 38 78, 44 62, 28 46 ');
  if (vent & VENT.rightSpur) ventParts.push('M 78 88 C 62 82, 58 66, 74 52 ');
  if (vent === 0) ventParts.push('M 50 86 Q 44 60 52 34 ');

  const currentParts: string[] = [];
  if (current & CURRENT.upper) currentParts.push('M 6 32 C 32 18, 66 44, 94 26 ');
  if (current & CURRENT.lower) currentParts.push('M 8 74 C 36 84, 64 58, 92 72 ');
  if (current & CURRENT.shear) currentParts.push('M 14 46 Q 52 26 86 58 ');
  if (current & CURRENT.inverseShear) currentParts.push('M 18 68 Q 54 84 86 42 ');
  if (current & CURRENT.spiral) currentParts.push('M 62 40 C 74 42, 72 62, 60 60 C 52 58, 56 46, 66 48 ');

  const polypParts: string[] = [];
  if (polyp & POLYP.apex) polypParts.push(circle(46, 22, 4));
  if (polyp & POLYP.flanking) polypParts.push(circle(26, 44, 3) + circle(70, 36, 2.5));
  if (polyp & POLYP.basal) polypParts.push(circle(36, 72, 3.5) + circle(66, 80, 2.5));
  if (polyp & POLYP.heart) polypParts.push(circle(52, 52, 5.5));
  if (polyp & POLYP.spores) polypParts.push(circle(18, 66, 2) + circle(84, 20, 2.5) + circle(58, 92, 2));

  return [
    { d: depthParts.join(''), className: 'text-red-400', strokeWidth: 2.5, opacity: 0.35 },
    { d: ventParts.join(''), className: 'text-rose-500', strokeWidth: 2.75 },
    { d: currentParts.join(''), className: 'text-pink-400', strokeWidth: 1.5, strokeDasharray: '5 3' },
    { d: polypParts.join(''), className: 'text-fuchsia-300', strokeWidth: 2, fill: 'currentColor' },
  ];
};

export const ABYSSAL_STYLE: GlyphStyle = {
  name: 'Abyssal',
  radicals: ['Vent (Stalk)', 'Current (Flow)', 'Polyp (Nodes)', 'Depth (Base)'],
  build,
};
