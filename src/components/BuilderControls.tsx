import type { GlyphStyle, LogographInput } from '../logograph/types';

interface BuilderControlsProps {
  input: LogographInput;
  style: GlyphStyle;
  onChange: (radicalIndex: number, value: number) => void;
}

export const BuilderControls = ({ input, style, onChange }: BuilderControlsProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3 border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.12em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          MORPHOLOGY
        </span>
        <span className="h-3 w-px bg-[var(--line)]" aria-hidden />
        <span className="text-[12px] font-medium tracking-[-0.01em] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          {style.name}
        </span>
      </div>
      <span
        className="inline-flex h-5 items-center border border-[var(--seal)]/25 bg-[var(--seal-soft)] px-1.5 text-[10px] font-semibold tracking-[0.14em] text-[var(--seal)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {String(style.name).slice(0, 3).toUpperCase()} · ACTIVE
      </span>
    </div>

    <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] bg-white">
      {input.map((value, index) => (
        <div key={index} className="px-3 py-3.5 sm:px-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <label className="text-[12.5px] font-medium leading-none text-[var(--ink)]">
              <span className="mr-1.5 inline-flex h-5 min-w-5 items-center justify-center border border-[var(--line)] bg-[var(--paper)] px-1 text-[10px] tracking-[0.08em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {style.radicals[index]}
            </label>
            <span
              className="inline-flex min-w-[2.2rem] justify-center border border-[var(--ink)]/15 bg-[var(--paper)] px-1.5 py-1 text-[11px] font-medium leading-none tracking-[0.06em] text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.08em] text-[var(--muted-2)]" style={{ fontFamily: 'var(--font-mono)' }}>
              00
            </span>
            <input
              type="range"
              min="0"
              max="31"
              value={value}
              onChange={(e) => onChange(index, parseInt(e.target.value, 10))}
              aria-label={`${style.radicals[index]} value`}
              className="flex-1"
            />
            <span className="text-[10px] tracking-[0.08em] text-[var(--muted-2)]" style={{ fontFamily: 'var(--font-mono)' }}>
              31
            </span>
          </div>
        </div>
      ))}
    </div>

    <p className="px-1 text-[11px] leading-4 text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
      Dominant value selects the cut. Move one slider past the others and the plate changes family.
    </p>
  </div>
);
