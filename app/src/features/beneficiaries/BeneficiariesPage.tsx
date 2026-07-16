import { useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Tabs } from "../../components/ui/Tabs";
import { EmptyState } from "../../components/ui/EmptyState";
import { useStore } from "../../store/useStore";
import { BeneficiaryCard } from "./BeneficiaryCard";
import { AddBeneficiaryFlow } from "./AddBeneficiaryFlow";
import { EditBeneficiaryDrawer } from "./EditBeneficiaryDrawer";
import { useToast } from "../../components/ui/Toast";
import type { Beneficiary } from "../../types";

export default function BeneficiariesPage() {
  const beneficiaries = useStore((s) => s.beneficiaries);
  const setDefaultBeneficiary = useStore((s) => s.setDefaultBeneficiary);
  const removeBeneficiary = useStore((s) => s.removeBeneficiary);
  const { push } = useToast();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Beneficiary | null>(null);

  const active = beneficiaries.filter((b) => b.isActive);

  const filtered = useMemo(() => {
    return active
      .filter((b) => (filter === "all" ? true : b.type === filter))
      .filter((b) => b.fullName.toLowerCase().includes(query.toLowerCase()) || b.relationship?.toLowerCase().includes(query.toLowerCase()));
  }, [active, filter, query]);

  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        description="Manage who receives your remittances in Bangladesh"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
            Add Beneficiary
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { label: "All", value: "all", count: active.length },
            { label: "Bank", value: "bank", count: active.filter((b) => b.type === "bank").length },
            { label: "MFS", value: "mfs", count: active.filter((b) => b.type === "mfs").length },
            { label: "Cash Pickup", value: "cash_pickup", count: active.filter((b) => b.type === "cash_pickup").length },
          ]}
        />
        <Input
          placeholder="Search by name or relationship"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search size={16} />}
          className="sm:w-72"
        />
      </div>

      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={22} />}
            title={active.length === 0 ? "No beneficiaries yet" : "No matches found"}
            description={active.length === 0 ? "Add a bank account, MFS wallet or cash pickup recipient to send your first remittance." : "Try a different search or filter."}
            action={
              active.length === 0 && (
                <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
                  Add Beneficiary
                </Button>
              )
            }
          />
        ) : (
          filtered.map((b) => (
            <BeneficiaryCard
              key={b.id}
              beneficiary={b}
              onSetDefault={() => {
                setDefaultBeneficiary(b.id);
                push({ variant: "success", title: "Default beneficiary updated" });
              }}
              onEdit={() => setEditTarget(b)}
              onRemove={() => {
                removeBeneficiary(b.id);
                push({ variant: "info", title: "Beneficiary removed", description: `${b.fullName} was deactivated. Past transactions remain visible.` });
              }}
            />
          ))
        )}
      </div>

      <AddBeneficiaryFlow open={addOpen} onClose={() => setAddOpen(false)} />
      <EditBeneficiaryDrawer beneficiary={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  );
}
