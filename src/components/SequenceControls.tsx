import type { GridSize, Palette } from '../types';

/** Grid inputs accept any text; keep the value a usable positive whole number. */
const toDimension = (raw: string): number => Math.max(1, parseInt(raw) || 1);

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
  <div className="flex flex-col flex-1 h-full gap-6">
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">Data Stream</label>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter text or numbers..."
        className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-lg p-3 font-mono text-sm text-emerald-400 focus:outline-none focus:border-emerald-500/50 resize-none"
      />
    </div>

    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase">Columns</label>
        <input
          type="number"
          min="1"
          max="20"
          value={grid.columns}
          onChange={(e) => onGridChange({ ...grid, columns: toDimension(e.target.value) })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-2 text-white font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase">Rows</label>
        <input
          type="number"
          min="1"
          max="20"
          value={grid.rows}
          onChange={(e) => onGridChange({ ...grid, rows: toDimension(e.target.value) })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-2 text-white font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase">Ink Color</label>
        <input
          type="color"
          value={palette.ink}
          onChange={(e) => onPaletteChange({ ...palette, ink: e.target.value })}
          className="w-full h-10 bg-slate-950/50 border border-slate-800 rounded-lg cursor-pointer p-1"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase">Paper Color</label>
        <input
          type="color"
          value={palette.paper}
          onChange={(e) => onPaletteChange({ ...palette, paper: e.target.value })}
          className="w-full h-10 bg-slate-950/50 border border-slate-800 rounded-lg cursor-pointer p-1"
        />
      </div>
    </div>

    <button
      onClick={onExport}
      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-emerald-900/50 transition-all active:scale-[0.98]"
    >
      Export as SVG
    </button>
  </div>
);
