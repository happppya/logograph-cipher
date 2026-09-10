import { generateLogograph } from './Engine';
import { resolvePath } from './pathAttributes';
import type { LogographInput, RenderPath } from './types';

/** Scale of one grid cell and the surrounding margin, in SVG user units. */
const CELL_SIZE = 120;
const PADDING = 20;

export interface SequenceSvgOptions {
  glyphs: readonly LogographInput[];
  columns: number;
  rows: number;
  inkColor: string;
  paperColor: string;
}

const serializePath = (path: RenderPath): string => {
  const { d, fill, strokeWidth, strokeDasharray, opacity } = resolvePath(path);
  const dash = strokeDasharray ? ` stroke-dasharray="${strokeDasharray}"` : '';
  const alpha = opacity !== undefined ? ` opacity="${opacity}"` : '';
  return `<path d="${d}" stroke-width="${strokeWidth}"${dash} fill="${fill}"${alpha} />`;
};

const serializeGlyph = (input: LogographInput, x: number, y: number, inkColor: string): string => {
  const paths = generateLogograph(input).map(serializePath).join('\n          ');
  return `
        <g transform="translate(${x}, ${y})" stroke="${inkColor}" color="${inkColor}" stroke-linecap="round" stroke-linejoin="round" fill="none">
          ${paths}
        </g>`;
};

/** Builds a standalone SVG document for the first `columns * rows` glyphs. */
export const buildSequenceSvg = ({
  glyphs,
  columns,
  rows,
  inkColor,
  paperColor,
}: SequenceSvgOptions): string => {
  const width = columns * CELL_SIZE + PADDING * 2;
  const height = rows * CELL_SIZE + PADDING * 2;

  const cells = glyphs
    .slice(0, columns * rows)
    .map((input, index) => {
      const x = PADDING + (index % columns) * CELL_SIZE;
      const y = PADDING + Math.floor(index / columns) * CELL_SIZE;
      return serializeGlyph(input, x, y, inkColor);
    })
    .join('');

  const header =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"` +
    ` width="${width}" height="${height}"` +
    ` style="background-color: ${paperColor}; color: ${inkColor};">`;

  return `${header}${cells}\n</svg>`;
};
