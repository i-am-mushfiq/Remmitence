import { ArrowUpRight, Receipt, PiggyBank, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import type { Transaction } from "../../types";
import { formatBdt, formatDateTime, formatMyr } from "../../lib/format";
import { StatusBadge } from "../ui/Badge";

const KIND_ICON: Record<Transaction["kind"], React.ElementType> = {
  remittance: ArrowUpRight,
  bill: Receipt,
  savings_topup: PiggyBank,
  dps_contribution: Landmark,
};

const KIND_LABEL: Record<Transaction["kind"], string> = {
  remittance: "Remittance",
  bill: "Bill Payment",
  savings_topup: "Savings Top-up",
  dps_contribution: "DPS Contribution",
};

export function TransactionRow({ txn, linkable = true }: { txn: Transaction; linkable?: boolean }) {
  const Icon = KIND_ICON[txn.kind];
  const title = txn.kind === "remittance" ? txn.beneficiaryName : txn.kind === "bill" ? txn.billerName : txn.beneficiaryName;

  const content = (
    <div className="flex items-center gap-3.5 px-1 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-small font-semibold text-[var(--color-text)]">{title}</p>
        <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
          {KIND_LABEL[txn.kind]} &middot; {formatDateTime(txn.createdAt)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="tabular text-small font-semibold text-[var(--color-text)]">{formatMyr(txn.totalAmountMyr)}</p>
        <p className="tabular text-tiny font-normal text-[var(--color-text-secondary)]">{formatBdt(txn.receiveAmountBdt, { compact: true })}</p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <StatusBadge status={txn.status} />
      </div>
    </div>
  );

  if (!linkable) return content;

  return (
    <Link to={`/transactions/${txn.id}`} className="block rounded-[var(--radius-control)] transition-colors hover:bg-slate-50">
      {content}
    </Link>
  );
}
