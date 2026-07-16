import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { TransactionStatus } from "../../types";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)]",
  warning: "bg-[var(--color-warning-soft)] text-amber-700",
  danger: "bg-[var(--color-danger-soft)] text-red-700",
  info: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-tag)] px-2 py-0.5 text-tiny font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const STATUS_CONFIG: Record<TransactionStatus, { label: string; tone: Tone }> = {
  initiated: { label: "Initiated", tone: "neutral" },
  funds_received: { label: "Funds Received", tone: "info" },
  compliance_review: { label: "Under Review", tone: "warning" },
  processing: { label: "Processing", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
  on_hold: { label: "On Hold", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  refunded: { label: "Refunded", tone: "info" },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
