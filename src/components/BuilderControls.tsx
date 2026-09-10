import type { GlyphStyle, LogographInput } from '../logograph/types';

interface BuilderControlsProps {
  input: LogographInput;
  style: GlyphStyle;
  onChange: (radicalIndex: number, value: number) => void;
}

export const BuilderControls = ({ input, style, onChange }: BuilderControlsProps) => (
  <div className="space-y-6 flex-1">
    <div className="flex justify-between items-center mb-[-10px] mt-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Active Morphology
      </span>
      <span className="text-xs font-bold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-800/30">
        {style.name}
      </span>
    </div>

    <div className="space-y-6">
      {input.map((value, index) => (
        <div key={index} className="space-y-3 group">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
              {index}. {style.radicals[index]}
            </label>
            <span className="text-emerald-400 font-mono text-sm bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-800/30">
              {value}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="31"
            value={value}
            onChange={(e) => onChange(index, parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      ))}
    </div>
  </div>
);
