import type { Mode } from '../types';

const TABS: readonly { id: Mode; label: string }[] = [
  { id: 'builder', label: 'Specimen' },
  { id: 'sequence', label: 'Sequence' },
];

interface ModeTabsProps {
  active: Mode;
  onChange: (mode: Mode) => void;
}

export const ModeTabs = ({ active, onChange }: ModeTabsProps) => (
  <div
    className="grid grid-cols-2 gap-[3px] border border-[var(--line)] bg-[var(--paper)] p-[3px]"
    role="tablist"
    aria-label="Mode"
  >
    {TABS.map((tab) => {
      const isActive = active === tab.id;
      return (
        <button
          key={tab.id}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-[9px] text-[11px] font-medium tracking-[0.12em] transition-colors ${
            isActive
              ? 'bg-[var(--ink)] text-white shadow-[0_1px_0_rgba(0,0,0,0.08)]'
              : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]'
          }`}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className={`h-1 w-1 rounded-full ${isActive ? 'bg-white' : 'bg-[var(--line-strong)]'}`} aria-hidden />
          {tab.label.toUpperCase()}
        </button>
      );
    })}
  </div>
);
