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
  document.body.appendChild(link); // Firefox only dispatches clicks on attached nodes.
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function App() {
  const [mode, setMode] = useState<Mode>('sequence');
  const [builderInput, setBuilderInput] = useState<LogographInput>(DEFAULT_BUILDER_INPUT);
  const [sequenceText, setSequenceText] = useState(DEFAULT_SEQUENCE);
  const [grid, setGrid] = useState<GridSize>({ columns: 4, rows: 3 });
  const [palette, setPalette] = useState<Palette>({ ink: '#34d399', paper: '#020617' });

  const sequenceGlyphs = useMemo(() => textToGlyphs(sequenceText), [sequenceText]);
  const builderStyle = selectStyle(builderInput);

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
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <main className="flex-1 relative flex flex-col items-center justify-center p-8 bg-radial from-slate-900 to-slate-950 overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[40rem] h-[40rem] bg-emerald-900/10 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {mode === 'builder' ? (
            <div className="w-full max-w-md aspect-square flex items-center justify-center">
              <LogographRenderer
                input={builderInput}
                className="w-full h-full filter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-300"
              />
            </div>
          ) : (
            <SequenceGrid
              glyphs={sequenceGlyphs}
              columns={grid.columns}
              rows={grid.rows}
              palette={palette}
            />
          )}
        </div>
      </main>

      <aside className="w-full md:w-80 lg:w-96 bg-slate-900/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-slate-800/80 p-6 sm:p-8 flex flex-col gap-8 shadow-2xl z-20 shrink-0 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
            Cipher Engine
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Construct single symbols or write complete encrypted sequences.
          </p>
        </div>

        <ModeTabs active={mode} onChange={setMode} />

        {mode === 'builder' ? (
          <BuilderControls
            input={builderInput}
            style={builderStyle}
            onChange={handleBuilderChange}
          />
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
      </aside>
    </div>
  );
}
