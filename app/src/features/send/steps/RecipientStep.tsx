import { useState } from "react";
import { Plus, Landmark, Smartphone, MapPin, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useStore } from "../../../store/useStore";
import { AddBeneficiaryFlow } from "../../beneficiaries/AddBeneficiaryFlow";
import type { Beneficiary } from "../../../types";
import { cn } from "../../../lib/cn";

const TYPE_ICON: Record<Beneficiary["type"], React.ElementType> = { bank: Landmark, mfs: Smartphone, cash_pickup: MapPin };

export function RecipientStep({
  selectedId,
  onSelect,
  onNext,
  onBack,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const allBeneficiaries = useStore((s) => s.beneficiaries);
  const beneficiaries = allBeneficiaries.filter((b) => b.isActive);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = beneficiaries.filter((b) => b.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Who are you sending to?</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">Choose a saved beneficiary or add a new one.</p>

      <div className="mt-5 flex gap-2.5">
        <Input placeholder="Search beneficiaries" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <Button variant="secondary" icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add New
        </Button>
      </div>

      <div className="mt-4 space-y-2.5">
        {filtered.length === 0 ? (
          <EmptyState icon={<Landmark size={22} />} title="No beneficiaries found" description="Add a new beneficiary to continue." />
        ) : (
          filtered.map((b) => {
            const Icon = TYPE_ICON[b.type];
            const selected = selectedId === b.id;
            const subtitle =
              b.type === "bank" ? `${b.bankName} •••• ${b.accountNumber?.slice(-4)}` : b.type === "mfs" ? `${b.mfsProvider} • ${b.mobileNumber}` : `${b.pickupNetwork}`;
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-[var(--radius-control)] border p-3.5 text-left transition-colors",
                  selected ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 ring-1 ring-[var(--color-primary)]" : "border-[var(--color-border)] hover:bg-slate-50"
                )}
              >
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", selected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]")}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-small font-semibold text-[var(--color-text)]">{b.fullName}</p>
                  <p className="truncate text-tiny font-normal text-[var(--color-text-secondary)]">{subtitle}</p>
                </div>
                {b.isDefault && <span className="shrink-0 text-tiny font-semibold text-[var(--color-primary)]">Default</span>}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth disabled={!selectedId} onClick={onNext}>
          Continue
        </Button>
      </div>

      <AddBeneficiaryFlow open={addOpen} onClose={() => setAddOpen(false)} onDone={(id) => onSelect(id)} />
    </div>
  );
}
