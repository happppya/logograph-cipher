import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const MATRIX = { hexagon: 1, rhombus: 2, kite: 4, triangle: 8, star: 16 } as const;
const FACET = { chords: 1, lattice: 2, triangle: 4, rhombus: 8, chevrons: 16 } as const;
const CORE = { northWest: 1, northEast: 2, southEast: 4, southWest: 8, heart: 16 } as const;
const REFRACTION = { meridians: 1, equators: 2, northWestSouthEast: 4, northEastSouthWest: 8, offAxis: 16 } as const;

/**
 * Prismatic: cut crystal. Straight edges at an angle — almost no horizontal or vertical runs,
 * which is the opposite of Emperor — plus a solid faceted core that no other style has.
 * The five core flags are disjoint wedges, so each one stays visible on its own.
 * Zones: hulls across 4-96, facets triangulating them, core inside a radius of 18, rays in
 * the outer 2-98 band.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [matrix, facet, core, refraction] = input;

  const matrixParts: string[] = [];
  if (matrix & MATRIX.hexagon) matrixParts.push('M 50 6 L 90 32 L 78 90 L 22 90 L 10 32 Z ');
  if (matrix & MATRIX.rhombus) matrixParts.push('M 50 8 L 88 50 L 50 92 L 12 50 Z ');
  if (matrix & MATRIX.kite) matrixParts.push('M 50 10 L 84 40 L 50 90 L 16 60 Z ');
  if (matrix & MATRIX.triangle) matrixParts.push('M 50 8 L 90 92 L 10 92 Z ');
  if (matrix & MATRIX.star)
    matrixParts.push('M 50 4 L 62 30 L 92 26 L 74 50 L 96 74 L 64 72 L 50 98 L 36 72 L 4 74 L 26 50 L 8 26 L 38 30 Z ');
  if (matrix === 0) matrixParts.push('M 50 20 L 80 50 L 50 80 L 20 50 Z ');

  const facetParts: string[] = [];
  if (facet & FACET.chords) facetParts.push('M 8 26 L 92 74 M 8 74 L 92 26 ');
  if (facet & FACET.lattice) facetParts.push('M 8 34 L 66 92 M 34 8 L 92 66 M 92 34 L 34 92 M 66 8 L 8 66 ');
  if (facet & FACET.triangle) facetParts.push('M 50 14 L 76 78 L 24 78 Z ');
  if (facet & FACET.rhombus) facetParts.push('M 50 28 L 72 50 L 50 72 L 28 50 Z ');
  if (facet & FACET.chevrons) facetParts.push('M 24 40 L 50 24 L 76 40 M 24 60 L 50 76 L 76 60 ');

  // Corner facets sit clear of the centre stone, so none of the five hides another.
  const coreParts: string[] = [];
  if (core & CORE.northWest) coreParts.push('M 38 30 L 48 40 L 38 50 L 28 40 Z ');
  if (core & CORE.northEast) coreParts.push('M 62 30 L 72 40 L 62 50 L 52 40 Z ');
  if (core & CORE.southEast) coreParts.push('M 62 50 L 72 60 L 62 70 L 52 60 Z ');
  if (core & CORE.southWest) coreParts.push('M 38 50 L 48 60 L 38 70 L 28 60 Z ');
  if (core & CORE.heart) coreParts.push('M 50 42 L 58 50 L 50 58 L 42 50 Z ');

  const refractionParts: string[] = [];
  if (refraction & REFRACTION.meridians) refractionParts.push('M 42 24 L 42 4 M 50 30 L 50 2 M 58 24 L 58 4 M 42 76 L 42 96 M 50 70 L 50 98 M 58 76 L 58 96 ');
  if (refraction & REFRACTION.equators) refractionParts.push('M 24 42 L 4 42 M 30 50 L 2 50 M 24 58 L 4 58 M 76 42 L 96 42 M 70 50 L 98 50 M 76 58 L 96 58 ');
  if (refraction & REFRACTION.northWestSouthEast)
    refractionParts.push('M 6 6 L 26 26 M 2 14 L 16 28 M 94 94 L 74 74 M 98 86 L 84 72 ');
  if (refraction & REFRACTION.northEastSouthWest)
    refractionParts.push('M 94 6 L 74 26 M 98 14 L 84 28 M 6 94 L 26 74 M 2 86 L 16 72 ');
  if (refraction & REFRACTION.offAxis)
    refractionParts.push('M 24 6 L 28 16 M 76 6 L 72 16 M 24 94 L 28 84 M 76 94 L 72 84 M 6 30 L 16 34 M 94 30 L 84 34 M 6 70 L 16 66 M 94 70 L 84 66 ');

  return [
    { d: matrixParts.join(''), className: 'text-cyan-500', strokeWidth: 2.5 },
    { d: facetParts.join(''), className: 'text-blue-400', strokeWidth: 1.75 },
    { d: coreParts.join(''), className: 'text-teal-300', strokeWidth: 2.5, fill: 'currentColor', opacity: 0.85 },
    { d: refractionParts.join(''), className: 'text-cyan-200', strokeWidth: 2 },
  ];
};

export const PRISMATIC_STYLE: GlyphStyle = {
  name: 'Prismatic',
  radicals: ['Matrix (Grid)', 'Facet (Cuts)', 'Core (Jewel)', 'Refraction (Light)'],
  build,
};
