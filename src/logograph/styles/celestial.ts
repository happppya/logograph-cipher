import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const AURA = { outerOrbit: 1, upperCrescent: 2, lowerCrescent: 4, innerRing: 8, microOrbit: 16 } as const;
const SPINE = { harmonicWave: 1, inverseWave: 2, serpentine: 4, eye: 8, lens: 16 } as const;
/** Both wings share the same bit layout, mirrored around x = 50. */
const WING = { upperSail: 1, lowerSail: 2, innerBow: 4, outerArc: 8, pulseNode: 16 } as const;

/**
 * Celestial: curves only — no straight segment in the whole style — and the thinnest strokes
 * of the four. Every flag is a long nested sweep, never a detail, so even the lightest radical
 * changes the silhouette. Zones: aura rings across 6-94, spine down the centre, left wing in
 * x 1-48, right wing in x 52-99.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [spine, leftWing, rightWing, aura] = input;

  const auraParts: string[] = [];
  if (aura & AURA.outerOrbit) auraParts.push('M 50 6 A 44 44 0 1 0 50 94 A 44 44 0 1 0 50 6 Z ');
  if (aura & AURA.upperCrescent) auraParts.push('M 12 50 A 38 38 0 0 1 88 50 M 16 50 A 34 34 0 0 1 84 50 ');
  if (aura & AURA.lowerCrescent) auraParts.push('M 88 50 A 38 38 0 0 1 12 50 M 84 50 A 34 34 0 0 1 16 50 ');
  if (aura & AURA.innerRing) auraParts.push('M 50 20 A 30 30 0 1 0 50 80 A 30 30 0 1 0 50 20 Z ');
  if (aura & AURA.microOrbit)
    auraParts.push('M 50 30 A 20 20 0 1 0 50 70 A 20 20 0 1 0 50 30 Z M 50 38 A 12 12 0 1 0 50 62 A 12 12 0 1 0 50 38 Z ');

  const spineParts: string[] = [];
  if (spine & SPINE.harmonicWave) spineParts.push('M 50 10 C 70 30, 30 70, 50 90 ');
  if (spine & SPINE.inverseWave) spineParts.push('M 50 10 C 30 30, 70 70, 50 90 ');
  if (spine & SPINE.serpentine) spineParts.push('M 50 16 C 64 28, 36 40, 50 52 C 64 64, 36 76, 50 88 ');
  if (spine & SPINE.eye) spineParts.push('M 36 34 Q 50 50 36 66 M 64 34 Q 50 50 64 66 ');
  if (spine & SPINE.lens) spineParts.push('M 30 50 Q 50 34 70 50 Q 50 66 30 50 Z ');
  if (spine === 0) spineParts.push('M 50 30 Q 62 50 50 70 ');

  const leftParts: string[] = [];
  if (leftWing & WING.upperSail) leftParts.push('M 48 14 C 24 20, 10 36, 10 60 M 42 22 C 26 30, 20 42, 22 58 ');
  if (leftWing & WING.lowerSail) leftParts.push('M 48 86 C 24 80, 10 64, 10 40 M 42 78 C 26 70, 20 58, 22 42 ');
  if (leftWing & WING.innerBow) leftParts.push('M 44 26 C 30 40, 30 60, 44 74 M 38 34 C 32 44, 32 56, 38 66 M 33 44 C 28 48, 28 52, 33 56 ');
  if (leftWing & WING.outerArc) leftParts.push('M 6 22 C 1 44, 1 56, 6 78 M 14 16 C 4 38, 4 62, 14 84 ');
  if (leftWing & WING.pulseNode) leftParts.push('M 32 34 Q 20 50 32 66 M 32 34 Q 44 50 32 66 M 32 42 Q 26 50 32 58 M 32 30 Q 16 50 32 70 ');

  const rightParts: string[] = [];
  if (rightWing & WING.upperSail) rightParts.push('M 52 14 C 76 20, 90 36, 90 60 M 58 22 C 74 30, 80 42, 78 58 ');
  if (rightWing & WING.lowerSail) rightParts.push('M 52 86 C 76 80, 90 64, 90 40 M 58 78 C 74 70, 80 58, 78 42 ');
  if (rightWing & WING.innerBow) rightParts.push('M 56 26 C 70 40, 70 60, 56 74 M 62 34 C 68 44, 68 56, 62 66 M 67 44 C 72 48, 72 52, 67 56 ');
  if (rightWing & WING.outerArc) rightParts.push('M 94 22 C 99 44, 99 56, 94 78 M 86 16 C 96 38, 96 62, 86 84 ');
  if (rightWing & WING.pulseNode) rightParts.push('M 68 34 Q 80 50 68 66 M 68 34 Q 56 50 68 66 M 68 42 Q 74 50 68 58 M 68 30 Q 84 50 68 70 ');

  return [
    { d: auraParts.join(''), className: 'text-purple-400', strokeWidth: 1.75, opacity: 0.45 },
    { d: spineParts.join(''), className: 'text-indigo-400', strokeWidth: 2.5 },
    { d: leftParts.join(''), className: 'text-indigo-300', strokeWidth: 2 },
    { d: rightParts.join(''), className: 'text-indigo-500', strokeWidth: 2 },
  ];
};

export const CELESTIAL_STYLE: GlyphStyle = {
  name: 'Celestial',
  radicals: ['Spine (Core)', 'Left Wing', 'Right Wing', 'Aura (Accents)'],
  build,
};
