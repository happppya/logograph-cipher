import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const VENT = { leftStalk: 1, rightStalk: 2, serpentine: 4, leftSpur: 8, rightSpur: 16 } as const;
const CURRENT = { upper: 1, lower: 2, shear: 4, inverseShear: 8, vortex: 16 } as const;
const POLYP = { apex: 1, flanking: 2, basal: 4, heart: 8, spores: 16 } as const;
const DEPTH = { leftKelp: 1, rightKelp: 2, midDrift: 4, inverseDrift: 8, benthicLine: 16 } as const;

/** A node as two half-arcs, so every radical stays a single `d` string. */
const circle = (x: number, y: number, r: number) =>
  `M ${x - r} ${y} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;

/**
 * Abyssal: asymmetric organic branching with layered depth.
 * Paths are ordered back to front (depth, vent, current, polyp) so the low-opacity
 * background shapes stay underneath, and the soft depth layer is expressed with opacity
 * rather than by nudging coordinates.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [vent, current, polyp, depth] = input;

  const depthParts: string[] = [];
  if (depth & DEPTH.leftKelp) depthParts.push('M 20 95 C 10 70, 30 40, 15 15 ');
  if (depth & DEPTH.rightKelp) depthParts.push('M 80 95 C 90 70, 70 40, 85 15 ');
  if (depth & DEPTH.midDrift) depthParts.push('M 40 90 C 30 60, 60 50, 45 20 ');
  if (depth & DEPTH.inverseDrift) depthParts.push('M 60 90 C 70 60, 40 50, 55 20 ');
  if (depth & DEPTH.benthicLine) depthParts.push('M 10 50 Q 50 60 90 50 ');

  const ventParts: string[] = [];
  if (vent & VENT.leftStalk) ventParts.push('M 35 90 Q 30 60 45 35 T 30 15 ');
  if (vent & VENT.rightStalk) ventParts.push('M 65 90 Q 70 60 55 35 T 70 15 ');
  if (vent & VENT.serpentine) ventParts.push('M 50 95 C 50 75, 35 65, 50 45 C 65 25, 50 15, 50 10 ');
  if (vent & VENT.leftSpur) ventParts.push('M 25 85 C 40 80, 45 65, 30 50 ');
  if (vent & VENT.rightSpur) ventParts.push('M 75 85 C 60 80, 55 65, 70 50 ');
  if (vent === 0) ventParts.push('M 50 85 Q 45 60 50 35 ');

  const currentParts: string[] = [];
  if (current & CURRENT.upper) currentParts.push('M 10 30 C 35 20, 65 40, 90 30 ');
  if (current & CURRENT.lower) currentParts.push('M 10 70 C 35 80, 65 60, 90 70 ');
  if (current & CURRENT.shear) currentParts.push('M 20 45 Q 50 30 80 55 ');
  if (current & CURRENT.inverseShear) currentParts.push('M 20 65 Q 50 80 80 45 ');
  if (current & CURRENT.vortex) currentParts.push('M 35 40 C 45 40, 45 60, 35 60 Z ');

  const polypParts: string[] = [];
  if (polyp & POLYP.apex) polypParts.push(circle(50, 25, 4));
  if (polyp & POLYP.flanking) polypParts.push(circle(25, 45, 3) + circle(75, 45, 3));
  if (polyp & POLYP.basal) polypParts.push(circle(35, 75, 3.5) + circle(65, 75, 3.5));
  if (polyp & POLYP.heart) polypParts.push(circle(50, 50, 5));
  if (polyp & POLYP.spores) polypParts.push(circle(20, 25, 2) + circle(80, 25, 2) + circle(50, 75, 2));

  return [
    { d: depthParts.join(''), className: 'text-red-400', strokeWidth: 3, opacity: 0.25 },
    { d: ventParts.join(''), className: 'text-rose-500', strokeWidth: 2.5 },
    { d: currentParts.join(''), className: 'text-pink-400', strokeWidth: 1.25, strokeDasharray: '4 2' },
    { d: polypParts.join(''), className: 'text-fuchsia-300', strokeWidth: 1.5, fill: 'currentColor' },
  ];
};

export const ABYSSAL_STYLE: GlyphStyle = {
  name: 'Abyssal',
  radicals: ['Vent (Stalk)', 'Current (Flow)', 'Polyp (Nodes)', 'Depth (Base)'],
  build,
};
