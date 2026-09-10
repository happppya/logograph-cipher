import { LogographRenderer } from '../logograph/Renderer';
import type { LogographInput } from '../logograph/types';
import type { Palette } from '../types';

interface SequenceGridProps {
  glyphs: readonly LogographInput[];
  columns: number;
  rows: number;
  palette: Palette;
}

export const SequenceGrid = ({ glyphs, columns, rows, palette }: SequenceGridProps) => {
  const visible = glyphs.slice(0, columns * rows);
  const emptyCells = Math.max(0, columns * rows - visible.length);

  return (
    <div
      className="relative p-6 sm:p-10 rounded-xl shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: palette.paper,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: '1.5rem',
      }}
    >
      {visible.map((glyph, index) => (
        <div key={index} className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
          <div style={{ color: palette.ink }} className="w-full h-full">
            <LogographRenderer
              input={glyph}
              overrideColor={palette.ink}
              className="w-full h-full drop-shadow-lg transition-colors duration-300"
            />
          </div>
        </div>
      ))}

      {Array.from({ length: emptyCells }).map((_, index) => (
        <div
          key={`empty-${index}`}
          className="w-16 h-16 sm:w-24 sm:h-24 border border-dashed border-slate-700/30 rounded-lg"
        />
      ))}
    </div>
  );
};
