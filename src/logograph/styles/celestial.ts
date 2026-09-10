import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const AURA = { outerOrbit: 1, upperCrescent: 2, lowerCrescent: 4, resonanceRing: 8, axisTicks: 16 } as const;
const SPINE = { harmonicWave: 1, inverseWave: 2, plumbLine: 4, eye: 8, equatorLock: 16 } as const;
/** Both wings share the same bit layout, mirrored around x = 50. */
const WING = { upperSail: 1, lowerSail: 2, innerBow: 4, outerArc: 8, pulseNode: 16 } as const;

/**
 * Celestial: concentric orbital system built from arcs and Bezier curves.
 * Zones: aura across the full 5-95 field, spine down the centre, left wing in x 15-45, right wing in x 55-85.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [spine, leftWing, rightWing, aura] = input;

  const auraParts: string[] = [];
  if (aura & AURA.outerOrbit) auraParts.push('M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z ');
  if (aura & AURA.upperCrescent) auraParts.push('M 15 50 A 35 35 0 0 1 85 50 ');
  if (aura & AURA.lowerCrescent) auraParts.push('M 85 50 A 35 35 0 0 1 15 50 ');
  if (aura & AURA.resonanceRing) auraParts.push('M 50 20 A 30 30 0 1 0 50 80 A 30 30 0 1 0 50 20 Z ');
  if (aura & AURA.axisTicks)
    auraParts.push('M 50 5 L 50 15 M 50 85 L 50 95 M 5 50 L 15 50 M 85 50 L 95 50 ');

  const spineParts: string[] = [];
  if (spine & SPINE.harmonicWave) spineParts.push('M 50 15 C 65 35, 35 65, 50 85 ');
  if (spine & SPINE.inverseWave) spineParts.push('M 50 15 C 35 35, 65 65, 50 85 ');
  if (spine & SPINE.plumbLine) spineParts.push('M 50 25 L 50 75 ');
  if (spine & SPINE.eye) spineParts.push('M 42 40 Q 50 50 42 60 M 58 40 Q 50 50 58 60 ');
  if (spine & SPINE.equatorLock) spineParts.push('M 45 50 L 55 50 ');
  if (spine === 0) spineParts.push('M 50 30 L 50 70 ');

  const leftParts: string[] = [];
  if (leftWing & WING.upperSail) leftParts.push('M 45 25 Q 25 25 20 45 ');
  if (leftWing & WING.lowerSail) leftParts.push('M 20 55 Q 25 75 45 75 ');
  if (leftWing & WING.innerBow) leftParts.push('M 40 35 Q 28 50 40 65 ');
  if (leftWing & WING.outerArc) leftParts.push('M 15 35 C 10 50, 10 50, 15 65 ');
  if (leftWing & WING.pulseNode) leftParts.push('M 30 45 Q 25 50 30 55 ');

  const rightParts: string[] = [];
  if (rightWing & WING.upperSail) rightParts.push('M 55 25 Q 75 25 80 45 ');
  if (rightWing & WING.lowerSail) rightParts.push('M 80 55 Q 75 75 55 75 ');
  if (rightWing & WING.innerBow) rightParts.push('M 60 35 Q 72 50 60 65 ');
  if (rightWing & WING.outerArc) rightParts.push('M 85 35 C 90 50, 90 50, 85 65 ');
  if (rightWing & WING.pulseNode) rightParts.push('M 70 45 Q 75 50 70 55 ');

  return [
    { d: auraParts.join(''), className: 'text-purple-400', strokeWidth: 1, opacity: 0.35 },
    { d: spineParts.join(''), className: 'text-indigo-400', strokeWidth: 2.5 },
    { d: leftParts.join(''), className: 'text-indigo-300', strokeWidth: 1.75 },
    { d: rightParts.join(''), className: 'text-indigo-500', strokeWidth: 1.75 },
  ];
};

export const CELESTIAL_STYLE: GlyphStyle = {
  name: 'Celestial',
  radicals: ['Spine (Core)', 'Left Wing', 'Right Wing', 'Aura (Accents)'],
  build,
};
