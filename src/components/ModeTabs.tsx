import type { Mode } from '../types';

const TABS: readonly { id: Mode; label: string }[] = [
  { id: 'builder', label: 'Builder' },
  { id: 'sequence', label: 'Sequence' },
];

interface ModeTabsProps {
  active: Mode;
  onChange: (mode: Mode) => void;
}

export const ModeTabs = ({ active, onChange }: ModeTabsProps) => (
  <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          active === tab.id
            ? 'bg-slate-800 text-emerald-400 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
