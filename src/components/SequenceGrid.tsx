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
      className="relative overflow-hidden border bg-[var(--surface)] p-3 sm:p-4"
      style={{
        backgroundColor: palette.paper,
        borderColor: 'var(--line-strong)',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '1px',
      }}
    >
      {/* hairline grid lives on the gap color; wrap in paper border for measure */}
      <div
        className="pointer-events-none absolute inset-0 border border-[var(--line-strong)] opacity-0"
        aria-hidden
      />
      {visible.map((glyph, index) => (
        <div
          key={index}
          className="relative flex aspect-square items-center justify-center bg-white/0 p-2 sm:p-3"
          style={{ backgroundColor: 'transparent' }}
        >
          {/* per-cell hairline frame */}
          <span className="pointer-events-none absolute inset-0 border border-[var(--line)]/60" aria-hidden />
          <span className="pointer-events-none absolute left-1.5 top-1.5 h-1.5 w-1.5 border-l border-t border-[var(--line-strong)]/60" aria-hidden />
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-1.5 w-1.5 border-b border-r border-[var(--line-strong)]/60" aria-hidden />
          <div style={{ color: palette.ink }} className="h-full w-full">
            <LogographRenderer
              input={glyph}
              overrideColor={palette.ink}
              className="h-full w-full"
              ariaLabel={`Glyph ${index + 1}`}
            />
          </div>
          <span
            className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.14em] text-[var(--muted)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      ))}

      {Array.from({ length: emptyCells }).map((_, index) => (
        <div
          key={`empty-${index}`}
          className="relative flex aspect-square items-center justify-center border border-dashed border-[var(--line)] p-3"
        >
          <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
          <span className="absolute h-6 w-px bg-[var(--line)]" aria-hidden />
        </div>
      ))}
    </div>
  );
};
