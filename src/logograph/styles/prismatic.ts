import type { GlyphStyle, LogographInput, RenderPath } from '../types';

const MATRIX = { hexagon: 1, diamond: 2, square: 4, triangle: 8, rectangle: 16 } as const;
const FACET = { chords: 1, axes: 2, triangle: 4, box: 8, diamond: 16 } as const;
const CORE = { diamond: 1, square: 2, crosshair: 4, x: 8, dot: 16 } as const;
const REFRACTION = { northSouth: 1, eastWest: 2, northWestSouthEast: 4, northEastSouthWest: 8, offAxis: 16 } as const;

/**
 * Prismatic: isometric hex lattice of straight chords, plus rays that escape the shell.
 * Zones: matrix hull in the 10-90 field, facets triangulating it, core inside a radius of 12,
 * refraction ticks in the outer 2-98 band.
 */
const build = (input: LogographInput): RenderPath[] => {
  const [matrix, facet, core, refraction] = input;

  const matrixParts: string[] = [];
  if (matrix & MATRIX.hexagon) matrixParts.push('M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z ');
  if (matrix & MATRIX.diamond) matrixParts.push('M 50 15 L 80 50 L 50 85 L 20 50 Z ');
  if (matrix & MATRIX.square) matrixParts.push('M 25 25 L 75 25 L 75 75 L 25 75 Z ');
  if (matrix & MATRIX.triangle) matrixParts.push('M 50 10 L 90 90 L 10 90 Z ');
  if (matrix & MATRIX.rectangle) matrixParts.push('M 15 20 L 85 20 L 85 80 L 15 80 Z ');
  if (matrix === 0) matrixParts.push('M 30 30 L 70 30 L 70 70 L 30 70 Z ');

  const facetParts: string[] = [];
  if (facet & FACET.chords) facetParts.push('M 15 30 L 85 70 M 15 70 L 85 30 ');
  if (facet & FACET.axes) facetParts.push('M 50 10 L 50 90 M 15 50 L 85 50 ');
  if (facet & FACET.triangle) facetParts.push('M 50 15 L 75 75 L 25 75 Z ');
  if (facet & FACET.box) facetParts.push('M 32 32 L 68 32 L 68 68 L 32 68 Z ');
  if (facet & FACET.diamond) facetParts.push('M 50 30 L 70 50 L 50 70 L 30 50 Z ');

  const coreParts: string[] = [];
  if (core & CORE.diamond) coreParts.push('M 50 40 L 60 50 L 50 60 L 40 50 Z ');
  if (core & CORE.square) coreParts.push('M 44 44 L 56 44 L 56 56 L 44 56 Z ');
  if (core & CORE.crosshair) coreParts.push('M 50 38 L 50 62 M 38 50 L 62 50 ');
  if (core & CORE.x) coreParts.push('M 45 45 L 55 55 M 55 45 L 45 55 ');
  if (core & CORE.dot) coreParts.push('M 50 46 L 54 50 L 50 54 L 46 50 Z ');

  const refractionParts: string[] = [];
  if (refraction & REFRACTION.northSouth) refractionParts.push('M 50 2 L 50 10 M 50 90 L 50 98 ');
  if (refraction & REFRACTION.eastWest) refractionParts.push('M 2 50 L 10 50 M 90 50 L 98 50 ');
  if (refraction & REFRACTION.northWestSouthEast) refractionParts.push('M 15 15 L 22 22 M 85 85 L 78 78 ');
  if (refraction & REFRACTION.northEastSouthWest) refractionParts.push('M 85 15 L 78 22 M 15 85 L 22 78 ');
  if (refraction & REFRACTION.offAxis)
    refractionParts.push('M 30 10 L 33 15 M 70 10 L 67 15 M 30 90 L 33 85 M 70 90 L 67 85 ');

  return [
    { d: matrixParts.join(''), className: 'text-cyan-500', strokeWidth: 2.5 },
    { d: facetParts.join(''), className: 'text-blue-400', strokeWidth: 1.5 },
    { d: coreParts.join(''), className: 'text-teal-300', strokeWidth: 2, fill: 'currentColor', opacity: 0.8 },
    { d: refractionParts.join(''), className: 'text-cyan-200', strokeWidth: 1.5 },
  ];
};

export const PRISMATIC_STYLE: GlyphStyle = {
  name: 'Prismatic',
  radicals: ['Matrix (Grid)', 'Facet (Cuts)', 'Core (Jewel)', 'Refraction (Light)'],
  build,
};
