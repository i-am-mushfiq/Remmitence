import { useState } from "react";
import { MoreVertical, Zap as ZapDefault, Pencil, Trash2, PauseCircle } from "lucide-react";
import type { Biller } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { CATEGORY_META } from "../../lib/billerMeta";
import { formatBdt, relativeFutureLabel } from "../../lib/format";

const STATUS_CONFIG = {
  up_to_date: { label: "Up to date", tone: "success" as const },
  due_soon: { label: "Due soon", tone: "warning" as const },
  overdue: { label: "Overdue", tone: "danger" as const },
};

export function BillerCard({
  biller,
  onPay,
  onAutoPay,
  onRemove,
}: {
  biller: Biller;
  onPay: () => void;
  onAutoPay: () => void;
  onRemove: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = CATEGORY_META[biller.category]?.icon ?? ZapDefault;
  const status = STATUS_CONFIG[biller.status];

  return (
    <div className="rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-small font-semibold text-[var(--color-text)]">{biller.label}</p>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          <p className="truncate text-tiny font-normal text-[var(--color-text-secondary)]">
            {biller.providerName} &middot; {biller.accountNumber}
          </p>
          {biller.lastBillAmountBdt && (
            <p className="mt-1 text-small font-semibold tabular text-[var(--color-text)]">
              {formatBdt(biller.lastBillAmountBdt)} {biller.lastBillDueDate && <span className="font-normal text-[var(--color-text-secondary)]">&middot; due {relativeFutureLabel(biller.lastBillDueDate)}</span>}
            </p>
          )}
          {biller.autoPay?.enabled && (
            <p className="mt-1 flex items-center gap-1 text-tiny font-medium text-[var(--color-accent)]">
              <PauseCircle size={12} /> Auto-Pay active &middot; day {biller.autoPay.paymentDay}
            </p>
          )}
        </div>
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Biller actions" className="flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-slate-100">
            <MoreVertical size={17} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-lift)]">
                <button
                  onClick={() => {
                    onAutoPay();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-small text-[var(--color-text)] hover:bg-slate-50"
                >
                  <Pencil size={14} /> {biller.autoPay?.enabled ? "Edit Auto-Pay" : "Set Auto-Pay"}
                </button>
                <button
                  onClick={() => {
                    onRemove();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-small text-[var(--color-danger)] hover:bg-red-50"
                >
                  <Trash2 size={14} /> Remove biller
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-3.5 flex justify-end">
        <Button size="sm" onClick={onPay}>
          Pay Now
        </Button>
      </div>
    </div>
  );
}
