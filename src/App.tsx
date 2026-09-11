import { useMemo, useState } from 'react';
import { textToGlyphs } from './cipher/encode';
import { BuilderControls } from './components/BuilderControls';
import { ModeTabs } from './components/ModeTabs';
import { SequenceControls } from './components/SequenceControls';
import { SequenceGrid } from './components/SequenceGrid';
import { selectStyle } from './logograph/Engine';
import { LogographRenderer } from './logograph/Renderer';
import { buildSequenceSvg } from './logograph/svgExport';
import type { LogographInput } from './logograph/types';
import type { GridSize, Mode, Palette } from './types';

const DEFAULT_SEQUENCE = 'CIPHER ENGINE: ONLINE. AWAITING DATA-STREAM!';
const DEFAULT_BUILDER_INPUT: LogographInput = [0, 10, 20, 15];

const downloadFile = (contents: string, filename: string, mimeType: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function App() {
  const [mode, setMode] = useState<Mode>('sequence');
  const [builderInput, setBuilderInput] = useState<LogographInput>(DEFAULT_BUILDER_INPUT);
  const [sequenceText, setSequenceText] = useState(DEFAULT_SEQUENCE);
  const [grid, setGrid] = useState<GridSize>({ columns: 4, rows: 3 });
  const [palette, setPalette] = useState<Palette>({ ink: '#121312', paper: '#FFFFFF' });

  const sequenceGlyphs = useMemo(() => textToGlyphs(sequenceText), [sequenceText]);
  const builderStyle = selectStyle(builderInput);
  const totalCells = grid.columns * grid.rows;
  const visibleCount = Math.min(sequenceGlyphs.length, totalCells);

  const handleBuilderChange = (index: number, value: number) =>
    setBuilderInput((current) => current.map((v, i) => (i === index ? value : v)) as LogographInput);

  const handleExport = () =>
    downloadFile(
      buildSequenceSvg({
        glyphs: sequenceGlyphs,
        columns: grid.columns,
        rows: grid.rows,
        inkColor: palette.ink,
        paperColor: palette.paper,
      }),
      'cipher-sequence.svg',
      'image/svg+xml',
    );

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-white">
      {/* thin top edge */}
      <div className="h-[3px] bg-[var(--ink)]" />
      <div className="h-px bg-[var(--line-strong)]" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header — specimen header, hairline under */}
        <header className="py-5 sm:py-6 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)]">
          <div className="flex items-start gap-3.5">
            <div className="mt-[3px] hidden sm:flex h-[34px] w-[34px] items-center justify-center border border-[var(--line-strong)] bg-[var(--surface)]">
              <div className="relative h-4 w-4">
                <span className="absolute inset-0 border border-[var(--ink)]/15" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--ink)]/20" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--ink)]/20" />
                <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--seal)]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1
                  className="text-[24px] sm:text-[26px] leading-none tracking-[-0.015em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Logograph<span className="font-normal italic opacity-60">Cipher</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium tracking-[0.14em] text-[var(--muted)]">
                  <span className="h-1 w-1 rounded-full bg-[var(--seal)]" />
                  ED. 01 — PROOF PRESS
                </span>
              </div>
              <p className="mt-1 max-w-[42ch] text-[12.5px] leading-5 text-[var(--muted)]">
                A four-radical logograph. Four values, five bits each — set a plate, pull a print.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div
              className="hidden sm:flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="tracking-[0.12em] text-[var(--muted)]">PLATE</span>
              <span className="h-3 w-px bg-[var(--line)]" />
              <span className="tracking-[0.06em]">
                {mode === 'builder' ? 'SINGLE SPECIMEN' : `${visibleCount} / ${totalCells} CELLS`}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
              100 × 100 VIEWBOX
            </div>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-5 lg:gap-6 py-5 sm:py-6">
          {/* Plate — the proof sheet */}
          <div className="col-span-12 lg:col-span-8">
            <section className="relative overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
              {/* corner registration marks */}
              <span className="pointer-events-none absolute left-3 top-3 h-[14px] w-[14px] border-l border-t border-[var(--line-strong)]" />
              <span className="pointer-events-none absolute right-3 top-3 h-[14px] w-[14px] border-r border-t border-[var(--line-strong)]" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-[14px] w-[14px] border-b border-l border-[var(--line-strong)]" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-[14px] w-[14px] border-b border-r border-[var(--line-strong)]" />
              {/* center ticks */}
              <span className="pointer-events-none absolute left-1/2 top-3 hidden h-[10px] w-px -translate-x-1/2 bg-[var(--line-strong)] sm:block" />
              <span className="pointer-events-none absolute bottom-3 left-1/2 hidden h-[10px] w-px -translate-x-1/2 bg-[var(--line-strong)] sm:block" />
              <span className="pointer-events-none absolute left-3 top-1/2 hidden w-[10px] h-px -translate-y-1/2 bg-[var(--line-strong)] sm:block" />
              <span className="pointer-events-none absolute right-3 top-1/2 hidden w-[10px] h-px -translate-y-1/2 bg-[var(--line-strong)] sm:block" />

              <div className="px-4 pb-4 pt-[18px] sm:px-7 sm:pb-5 sm:pt-7">
                {/* eyebrow inside plate */}
                <div
                  className="mb-4 flex items-center justify-between border-b border-dashed border-[var(--line)] pb-3 text-[10px] tracking-[0.14em]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="text-[var(--muted)]">
                    PLATE {mode === 'builder' ? 'A — SPECIMEN' : 'B — SEQUENCE'}
                    <span className="mx-1.5 text-[var(--line-strong)]">·</span>
                    <span className="text-[var(--ink)]">{mode === 'builder' ? builderStyle.name.toUpperCase() : 'COMPOSED'}</span>
                  </span>
                  <span className="hidden items-center gap-2 sm:flex text-[var(--muted)]">
                    <span className="h-px w-8 bg-[var(--line-strong)]" />
                    0 — 31 · 4 RADICALS
                  </span>
                </div>

                <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[440px] lg:min-h-[500px]">
                  {mode === 'builder' ? (
                    <div className="relative w-full max-w-[420px] aspect-square">
                      {/* soft paper shadow, not a glow */}
                      <div className="absolute inset-0 translate-y-[6px] border border-[var(--line)] bg-[var(--paper)]" aria-hidden />
                      <div className="relative flex h-full w-full items-center justify-center border border-[var(--line-strong)] bg-white p-6 sm:p-8">
                        <LogographRenderer
                          input={builderInput}
                          className="h-full w-full"
                          ariaLabel={`Specimen ${builderStyle.name} — ${builderInput.join(', ')}`}
                        />
                        {/* tiny inner corner ticks for the glyph itself */}
                        <span className="pointer-events-none absolute left-3 top-3 h-2 w-2 border-l border-t border-[var(--line)]" />
                        <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-r border-t border-[var(--line)]" />
                        <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 border-b border-l border-[var(--line)]" />
                        <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-[var(--line)]" />
                      </div>

                      {/* seal */}
                      <div className="absolute -bottom-3 -right-3 flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-[var(--seal)] bg-[var(--seal-soft)] shadow-[0_1px_0_rgba(0,0,0,0.06)] sm:h-[56px] sm:w-[56px]">
                        <div className="text-center leading-none">
                          <div className="text-[11px] font-semibold tracking-[0.16em] text-[var(--seal)]" style={{ fontFamily: 'var(--font-mono)' }}>
                            印
                          </div>
                          <div className="mt-0.5 text-[7px] tracking-[0.18em] text-[var(--seal)]/80" style={{ fontFamily: 'var(--font-mono)' }}>
                            {builderStyle.name.slice(0, 4).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <SequenceGrid glyphs={sequenceGlyphs} columns={grid.columns} rows={grid.rows} palette={palette} />
                    </div>
                  )}
                </div>
              </div>

              {/* plate footer — edition line */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[#FCFBF8] px-4 py-2.5 text-[11px] sm:px-5"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="tracking-[0.08em] text-[var(--muted)]">
                  {mode === 'builder' ? (
                    <>
                      VALUES <span className="text-[var(--ink)]">[{builderInput.join(' · ')}]</span>
                      <span className="mx-1.5 text-[var(--line-strong)]">—</span>
                      <span className="italic" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
                        {builderStyle.name}
                      </span>
                    </>
                  ) : (
                    <>
                      {sequenceGlyphs.length} GLYPH{sequenceGlyphs.length === 1 ? '' : 'S'}
                      <span className="mx-1.5 text-[var(--line-strong)]">·</span>
                      {grid.columns} × {grid.rows} GRID
                      <span className="mx-1.5 text-[var(--line-strong)]">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full border border-[var(--line)]" style={{ background: palette.ink }} />
                        INK
                        <span className="h-2 w-2 rounded-full border border-[var(--line)]" style={{ background: palette.paper }} />
                        PAPER
                      </span>
                    </>
                  )}
                </span>
                <span className="hidden items-center gap-2 text-[10px] tracking-[0.12em] text-[var(--muted)] sm:inline-flex">
                  <span className="h-px w-6 bg-[var(--line-strong)]" />
                  VIEWBOX 0 0 100 100
                </span>
              </div>
            </section>

            {/* small proof note under plate */}
            <p className="mt-3 px-1 text-[11px] leading-4 text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
              <span className="tracking-[0.08em]">NOTE</span>
              <span className="mx-1.5 text-[var(--line-strong)]">—</span>
              Every flag is cut large enough to survive ink. Flip one bit and the plate changes.
              <span className="hidden sm:inline"> Form is read at 64 px as well as at proof size.</span>
            </p>
          </div>

          {/* Drawer — controls */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
              <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-[var(--ink)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    COMPOSITION
                  </span>
                </div>
                <span className="text-[10px] tracking-[0.12em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {mode === 'builder' ? 'RADICALS 0–31' : `${sequenceGlyphs.length} TOKENS`}
                </span>
              </div>

              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <ModeTabs active={mode} onChange={setMode} />

                <div className="mt-5 border-t border-dashed border-[var(--line)] pt-5">
                  {mode === 'builder' ? (
                    <BuilderControls input={builderInput} style={builderStyle} onChange={handleBuilderChange} />
                  ) : (
                    <SequenceControls
                      text={sequenceText}
                      onTextChange={setSequenceText}
                      grid={grid}
                      onGridChange={setGrid}
                      palette={palette}
                      onPaletteChange={setPalette}
                      onExport={handleExport}
                    />
                  )}
                </div>
              </div>

              <div
                className="border-t border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[11px] leading-4 text-[var(--muted)] sm:px-5"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span>
                    Cipher &nbsp;·&nbsp; <span className="text-[var(--ink)]">4-tuple → glyph</span>
                    <br />
                    <span className="text-[10px] tracking-[0.08em]">A–Z 0–25 · ,.!?:- 26–31</span>
                  </span>
                  <span className="hidden h-6 w-6 items-center justify-center border border-[var(--line-strong)] bg-white text-[10px] text-[var(--muted)] sm:flex">
                    ¼
                  </span>
                </div>
              </div>
            </div>

            {/* tiny colophon card */}
            <div className="mt-3 flex items-center justify-between border border-dashed border-[var(--line)] bg-white/60 px-3 py-2.5 text-[10px] tracking-[0.1em] text-[var(--muted)] backdrop-blur-[1px]" style={{ fontFamily: 'var(--font-mono)' }}>
              <span>SET IN INSTRUMENT SERIF · INTER</span>
              <span className="h-1 w-1 rounded-full bg-[var(--line-strong)]" />
              <span>PAPER #F6F3EC</span>
            </div>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-4 text-[11px] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          <span className="tracking-[0.08em]">
            LOGOGRAPH CIPHER — ARCHIVAL PROOF · NO STORAGE · LOCAL STATE ONLY
          </span>
          <span className="flex items-center gap-2 tracking-[0.08em]">
            <span className="h-px w-8 bg-[var(--line-strong)]" />
            © PRESS 2026 · ED. 01
          </span>
        </footer>
      </div>
    </div>
  );
}
