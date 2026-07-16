import { Landmark, CreditCard, Banknote } from "lucide-react";
import { cn } from "../../lib/cn";

export type FundingMethod = "bank_transfer" | "card" | "cash_deposit";

const OPTIONS: { value: FundingMethod; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "bank_transfer", label: "Online Banking (FPX / DuitNow)", desc: "Instant transfer from your Malaysian bank", icon: Landmark },
  { value: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard via secure payment gateway", icon: CreditCard },
  { value: "cash_deposit", label: "Over-the-Counter Cash Deposit", desc: "Deposit cash at a partner outlet", icon: Banknote },
];

export function FundingMethodPicker({ value, onChange }: { value: FundingMethod; onChange: (v: FundingMethod) => void }) {
  return (
    <div className="space-y-2.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex w-full items-center gap-3.5 rounded-[var(--radius-control)] border p-3.5 text-left transition-colors",
            value === opt.value ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 ring-1 ring-[var(--color-primary)]" : "border-[var(--color-border)] hover:bg-slate-50"
          )}
        >
          <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", value === opt.value ? "bg-[var(--color-primary)] text-white" : "bg-slate-100 text-[var(--color-text-secondary)]")}>
            <opt.icon size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-small font-semibold text-[var(--color-text)]">{opt.label}</p>
            <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{opt.desc}</p>
          </div>
          <div className={cn("size-4 shrink-0 rounded-full border-2", value === opt.value ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-slate-300")}>
            {value === opt.value && <div className="size-full scale-50 rounded-full bg-white" />}
          </div>
        </button>
      ))}
    </div>
  );
}
