import { Download, FileText } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatBdt, formatDate, formatMyr } from "../../lib/format";
import { totalBillsPaid, totalIncentive, totalRemitted, combinedSavingsBalance, dpsTotals } from "../../lib/selectors";

export function ReturnReadinessReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useStore((s) => s.user);
  const transactions = useStore((s) => s.transactions);
  const savingsAccounts = useStore((s) => s.savingsAccounts);
  const dpsEnrollments = useStore((s) => s.dpsEnrollments);
  const { push } = useToast();

  const remitted = totalRemitted(transactions, "life");
  const incentive = totalIncentive(transactions, "life");
  const bills = totalBillsPaid(transactions, "life");
  const savings = combinedSavingsBalance(savingsAccounts);
  const dps = dpsTotals(dpsEnrollments);
  const nestEggTotal = savings + dps.contributed;

  return (
    <Modal open={open} onClose={onClose} size="lg" title="Return Readiness Report" description={`Generated ${formatDate(new Date().toISOString(), "long")}`}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-[var(--radius-control)] bg-[var(--color-primary-soft)] p-4">
          <FileText size={22} className="text-[var(--color-primary)]" />
          <div>
            <p className="text-small font-semibold text-[var(--color-text)]">{user.fullName}</p>
            <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Member since {formatDate(user.memberSince, "long")}</p>
          </div>
        </div>

        <Section title="Remittance Summary">
          <Row label="Total lifetime remitted" value={formatBdt(remitted.bdt)} sub={formatMyr(remitted.myr)} />
          <Row label="Total government incentive received" value={formatBdt(incentive)} />
        </Section>

        <Section title="Bill Payments">
          <Row label="Total lifetime bills paid" value={formatBdt(bills.total)} />
          {Object.entries(bills.byCategory).map(([cat, amt]) => (
            <Row key={cat} label={cat.replace("_", " ")} value={formatBdt(amt)} indent />
          ))}
        </Section>

        <Section title="Savings Accounts">
          {savingsAccounts.length === 0 ? (
            <p className="text-small text-[var(--color-text-secondary)]">No linked savings accounts.</p>
          ) : (
            savingsAccounts.map((a) => <Row key={a.id} label={`${a.partnerBank} •••• ${a.accountNumber.slice(-4)}`} value={formatBdt(a.balanceBdt)} />)
          )}
        </Section>

        <Section title="DPS Schemes">
          {dpsEnrollments.length === 0 ? (
            <p className="text-small text-[var(--color-text-secondary)]">No active DPS enrolments.</p>
          ) : (
            dpsEnrollments.map((d) => (
              <Row
                key={d.id}
                label={`${d.schemeName} (${d.partnerBank})`}
                value={formatBdt(d.contributedToDateBdt)}
                sub={`Matures ${formatDate(d.maturityDate, "long")} · Est. ${formatBdt(d.indicativeMaturityValueBdt)}`}
              />
            ))
          )}
        </Section>

        <div className="rounded-[var(--radius-control)] border-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4">
          <p className="text-small font-medium text-[var(--color-accent-hover)]">Nest Egg at Report Date</p>
          <p className="mt-1 text-h1 tabular text-[var(--color-accent-hover)]">{formatBdt(nestEggTotal)}</p>
        </div>

        <Button
          fullWidth
          icon={<Download size={16} />}
          onClick={() => push({ variant: "success", title: "Report downloaded", description: "Return_Readiness_Report.pdf saved to your device." })}
        >
          Download PDF
        </Button>
      </div>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-small font-semibold text-[var(--color-text)]">{title}</p>
      <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius-control)] border border-[var(--color-border)] px-3.5">{children}</div>
    </div>
  );
}

function Row({ label, value, sub, indent }: { label: string; value: string; sub?: string; indent?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${indent ? "pl-3" : ""}`}>
      <div>
        <p className="text-small capitalize text-[var(--color-text-secondary)]">{label}</p>
        {sub && <p className="text-tiny font-normal text-slate-400">{sub}</p>}
      </div>
      <span className="tabular text-small font-semibold text-[var(--color-text)]">{value}</span>
    </div>
  );
}
