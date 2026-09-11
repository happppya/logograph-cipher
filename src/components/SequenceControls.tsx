import type { GridSize, Palette } from '../types';

const toDimension = (raw: string): number => Math.max(1, parseInt(raw, 10) || 1);

interface SequenceControlsProps {
  text: string;
  onTextChange: (text: string) => void;
  grid: GridSize;
  onGridChange: (grid: GridSize) => void;
  palette: Palette;
  onPaletteChange: (palette: Palette) => void;
  onExport: () => void;
}

export const SequenceControls = ({
  text,
  onTextChange,
  grid,
  onGridChange,
  palette,
  onPaletteChange,
  onExport,
}: SequenceControlsProps) => (
  <div className="flex flex-col gap-4">
    <div className="space-y-2">
      <label
        className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        DATA STREAM
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
        <span className="text-[10px] tracking-[0.08em] text-[var(--muted)]">{text.length} CHARS</span>
      </label>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter text or numbers…"
        rows={4}
        className="min-h-[108px] w-full resize-none border border-[var(--line)] bg-white px-3 py-2.5 text-[12.5px] leading-5 text-[var(--ink)] placeholder:text-[var(--muted-2)] focus:border-[var(--ink)]/30 focus:outline-none"
        style={{ fontFamily: 'var(--font-mono)' }}
      />
      <p className="text-[11px] leading-4 text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
        Tokenizes per <span className="text-[var(--ink)]">cipher/encode</span> — A–Z, digits, ,.!?:-
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 border border-[var(--line)] bg-white p-3">
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.12em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          COLUMNS
        </span>
        <input
          type="number"
          min="1"
          max="20"
          value={grid.columns}
          onChange={(e) => onGridChange({ ...grid, columns: toDimension(e.target.value) })}
          className="w-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-2 text-sm text-[var(--ink)] focus:border-[var(--ink)]/30 focus:outline-none"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </label>
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.12em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          ROWS
        </span>
        <input
          type="number"
          min="1"
          max="20"
          value={grid.rows}
          onChange={(e) => onGridChange({ ...grid, rows: toDimension(e.target.value) })}
          className="w-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-2 text-sm text-[var(--ink)] focus:border-[var(--ink)]/30 focus:outline-none"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </label>
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.12em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          INK
        </span>
        <div className="flex gap-2">
          <input
            type="color"
            value={palette.ink}
            onChange={(e) => onPaletteChange({ ...palette, ink: e.target.value })}
            className="h-9 w-9 shrink-0 rounded-full"
            aria-label="Ink color"
          />
          <input
            value={palette.ink}
            onChange={(e) => onPaletteChange({ ...palette, ink: e.target.value })}
            className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-2 py-1.5 text-[11px] tracking-[0.06em] text-[var(--ink)] focus:border-[var(--ink)]/30 focus:outline-none"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </label>
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.12em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          PAPER
        </span>
        <div className="flex gap-2">
          <input
            type="color"
            value={palette.paper}
            onChange={(e) => onPaletteChange({ ...palette, paper: e.target.value })}
            className="h-9 w-9 shrink-0 rounded-full"
            aria-label="Paper color"
          />
          <input
            value={palette.paper}
            onChange={(e) => onPaletteChange({ ...palette, paper: e.target.value })}
            className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-2 py-1.5 text-[11px] tracking-[0.06em] text-[var(--ink)] focus:border-[var(--ink)]/30 focus:outline-none"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </label>
    </div>

    <button
      type="button"
      onClick={onExport}
      className="inline-flex w-full items-center justify-between border border-[var(--ink)] bg-[var(--ink)] px-4 py-3 text-[11px] font-semibold tracking-[0.12em] text-white transition-colors hover:bg-black focus-visible:outline-offset-2"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <span className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        EXPORT SVG
      </span>
      <span className="text-[10px] font-normal tracking-[0.06em] text-white/70">STANDALONE · {grid.columns}×{grid.rows}</span>
    </button>
  </div>
);
