import { cn } from "../../lib/cn";

interface TabItem {
  label: string;
  value: string;
  count?: number;
}

export function Tabs({ tabs, value, onChange }: { tabs: TabItem[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-[var(--radius-control)] bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-[calc(var(--radius-control)-2px)] px-3.5 py-1.5 text-small font-medium transition-colors",
            value === tab.value ? "bg-white text-[var(--color-text)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 text-tiny",
                value === tab.value ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "bg-slate-200 text-slate-500"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function SegmentedControl({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-[var(--radius-control)] border border-[var(--color-border)] p-0.5 bg-white">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-[calc(var(--radius-control)-2px)] px-3 py-1.5 text-small font-medium transition-colors",
            value === o.value ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
