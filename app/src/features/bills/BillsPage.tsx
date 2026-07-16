import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { EmptyState } from "../../components/ui/EmptyState";
import { Card, CardBody } from "../../components/ui/Card";
import { useStore } from "../../store/useStore";
import { BillerCard } from "./BillerCard";
import { AddBillerFlow } from "./AddBillerFlow";
import { PayBillFlow } from "./PayBillFlow";
import { AutoPaySetupDrawer } from "./AutoPaySetupDrawer";
import { TransactionRow } from "../../components/shared/TransactionRow";
import { useToast } from "../../components/ui/Toast";
import type { Biller } from "../../types";

export default function BillsPage() {
  const billers = useStore((s) => s.billers);
  const removeBiller = useStore((s) => s.removeBiller);
  const allTransactions = useStore((s) => s.transactions);
  const transactions = allTransactions.filter((t) => t.kind === "bill");
  const { push } = useToast();

  const [tab, setTab] = useState("billers");
  const [addOpen, setAddOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<Biller | null>(null);
  const [autoPayTarget, setAutoPayTarget] = useState<Biller | null>(null);

  return (
    <div>
      <PageHeader
        title="Bill Payments"
        description="Pay recurring utility and household bills for your family in Bangladesh"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
            Add Biller
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { label: "My Billers", value: "billers", count: billers.length },
          { label: "Payment History", value: "history", count: transactions.length },
        ]}
      />

      {tab === "billers" ? (
        <div className="mt-5 space-y-3">
          {billers.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon={<Receipt size={22} />}
                  title="No billers added"
                  description="Add electricity, gas, water, internet or mobile top-up billers for your family home."
                  action={
                    <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
                      Add Biller
                    </Button>
                  }
                />
              </CardBody>
            </Card>
          ) : (
            billers.map((b) => (
              <BillerCard
                key={b.id}
                biller={b}
                onPay={() => setPayTarget(b)}
                onAutoPay={() => setAutoPayTarget(b)}
                onRemove={() => {
                  removeBiller(b.id);
                  push({ variant: "info", title: "Biller removed" });
                }}
              />
            ))
          )}
        </div>
      ) : (
        <Card className="mt-5">
          <CardBody className="p-2 sm:p-3">
            {transactions.length === 0 ? (
              <EmptyState icon={<Receipt size={22} />} title="No bill payments yet" />
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {transactions.map((t) => (
                  <TransactionRow key={t.id} txn={t} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <AddBillerFlow open={addOpen} onClose={() => setAddOpen(false)} />
      <PayBillFlow biller={payTarget} onClose={() => setPayTarget(null)} />
      <AutoPaySetupDrawer biller={autoPayTarget} onClose={() => setAutoPayTarget(null)} />
    </div>
  );
}
