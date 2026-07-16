import { cn } from "../../lib/cn";

export function AmountInput({
  value,
  onChange,
  currencySymbol,
  placeholder = "0",
  autoFocus,
  error,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  currencySymbol: string;
  placeholder?: string;
  autoFocus?: boolean;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-control)] border bg-[var(--color-surface)] px-4 py-3.5 transition-colors",
          "focus-within:ring-2 focus-within:ring-[var(--color-primary)]/25 focus-within:border-[var(--color-primary)]",
          error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
          disabled && "bg-slate-50"
        )}
      >
        <span className="text-h2 font-bold text-[var(--color-text-secondary)]">{currencySymbol}</span>
        <input
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.]/g, "");
            if ((v.match(/\./g) || []).length > 1) return;
            onChange(v);
          }}
          inputMode="decimal"
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className="w-full min-w-0 bg-transparent text-h2 font-bold text-[var(--color-text)] placeholder:text-slate-300 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-tiny text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
