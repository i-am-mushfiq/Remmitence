import { useState } from "react";
import { Landmark, Smartphone, MapPin, Star, MoreVertical, Pencil, Trash2, ShieldCheck } from "lucide-react";
import type { Beneficiary } from "../../types";
import { Badge } from "../../components/ui/Badge";

const TYPE_CONFIG: Record<Beneficiary["type"], { icon: React.ElementType; label: string }> = {
  bank: { icon: Landmark, label: "Bank Account" },
  mfs: { icon: Smartphone, label: "MFS Wallet" },
  cash_pickup: { icon: MapPin, label: "Cash Pickup" },
};

export function BeneficiaryCard({
  beneficiary,
  onSetDefault,
  onEdit,
  onRemove,
}: {
  beneficiary: Beneficiary;
  onSetDefault: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = TYPE_CONFIG[beneficiary.type];

  const subtitle =
    beneficiary.type === "bank"
      ? `${beneficiary.bankName} •••• ${beneficiary.accountNumber?.slice(-4)}`
      : beneficiary.type === "mfs"
      ? `${beneficiary.mfsProvider} • ${beneficiary.mobileNumber}`
      : `${beneficiary.pickupNetwork} • ${beneficiary.pickupRegion}`;

  return (
    <div className="flex items-center gap-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <cfg.icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-small font-semibold text-[var(--color-text)]">{beneficiary.fullName}</p>
          {beneficiary.isDefault && (
            <Badge tone="info">
              <Star size={10} className="fill-current" /> Default
            </Badge>
          )}
        </div>
        <p className="truncate text-tiny font-normal text-[var(--color-text-secondary)]">{subtitle}</p>
        <div className="mt-1 flex items-center gap-2">
          {beneficiary.relationship && <Badge>{beneficiary.relationship}</Badge>}
          <span className="flex items-center gap-1 text-tiny font-normal text-[var(--color-accent)]">
            <ShieldCheck size={12} /> Cleared
          </span>
        </div>
      </div>
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Beneficiary actions"
          className="flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-slate-100"
        >
          <MoreVertical size={17} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-lift)]">
              {!beneficiary.isDefault && (
                <button
                  onClick={() => {
                    onSetDefault();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-small text-[var(--color-text)] hover:bg-slate-50"
                >
                  <Star size={14} /> Set as default
                </button>
              )}
              <button
                onClick={() => {
                  onEdit();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-small text-[var(--color-text)] hover:bg-slate-50"
              >
                <Pencil size={14} /> Edit details
              </button>
              <button
                onClick={() => {
                  onRemove();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-small text-[var(--color-danger)] hover:bg-red-50"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
