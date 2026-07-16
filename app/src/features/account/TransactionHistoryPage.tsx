import { useMemo, useState } from "react";
import { Download, Search, History as HistoryIcon } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { EmptyState } from "../../components/ui/EmptyState";
import { TransactionRow } from "../../components/shared/TransactionRow";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";

export default function TransactionHistoryPage() {
  const transactions = useStore((s) => s.transactions);
  const { push } = useToast();
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (kind === "all" ? true : t.kind === kind))
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return t.reference.toLowerCase().includes(q) || t.beneficiaryName?.toLowerCase().includes(q) || t.billerName?.toLowerCase().includes(q);
      });
  }, [transactions, kind, status, query]);

  return (
    <div>
      <PageHeader
        title="Transaction History"
        back="/account"
        actions={
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => push({ variant: "success", title: "Export started", description: "Your CSV export will download shortly." })}
          >
            Export CSV
          </Button>
        }
      />

      <Tabs
        value={kind}
        onChange={setKind}
        tabs={[
          { label: "All", value: "all" },
          { label: "Remittance", value: "remittance" },
          { label: "Bills", value: "bill" },
          { label: "Savings", value: "savings_topup" },
          { label: "DPS", value: "dps_contribution" },
        ]}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search by reference or name" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-52"
          options={[
            { label: "All statuses", value: "all" },
            { label: "Completed", value: "completed" },
            { label: "Processing", value: "processing" },
            { label: "Failed", value: "failed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "On Hold", value: "on_hold" },
          ]}
        />
      </div>

      <Card className="mt-4">
        <CardBody className="p-2 sm:p-3">
          {filtered.length === 0 ? (
            <EmptyState icon={<HistoryIcon size={22} />} title="No transactions found" description="Try adjusting your filters." />
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filtered.map((t) => (
                <TransactionRow key={t.id} txn={t} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
