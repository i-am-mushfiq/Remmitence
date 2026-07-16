import { Download, FileCheck2, Phone } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatBdt, formatDate } from "../../lib/format";
import { combinedSavingsBalance, dpsTotals, totalBillsPaid, totalIncentive, totalRemitted } from "../../lib/selectors";

const PARTNER_CONTACTS: Record<string, string> = {
  "Islami Bank Bangladesh": "16259 / +880 2-8331090",
  "Dutch-Bangla Bank": "16216 / +880 2-9550081",
  "BRAC Bank": "16221 / +880 2-9887899",
  "Sonali Bank": "16612 / +880 2-9556680",
};

export function FinalReportStep({ onNext }: { onNext: () => void }) {
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

  const involvedBanks = Array.from(new Set([...savingsAccounts.map((a) => a.partnerBank), ...dpsEnrollments.map((d) => d.partnerBank)]));

  return (
    <div>
      <Card>
        <CardBody className="sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <FileCheck2 size={20} />
            </div>
            <div>
              <h2 className="text-h2 text-[var(--color-text)]">Final Consolidation Report</h2>
              <p className="text-small text-[var(--color-text-secondary)]">{user.fullName} &middot; Generated {formatDate(new Date().toISOString(), "long")}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat label="Total lifetime remitted" value={formatBdt(remitted.bdt)} />
            <Stat label="Total government incentive" value={formatBdt(incentive)} />
            <Stat label="Total lifetime bills paid" value={formatBdt(bills.total)} />
            <Stat label="Final savings balance" value={formatBdt(savings)} />
          </div>

          <div className="mt-5 rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
            <p className="mb-3 text-small font-semibold text-[var(--color-text)]">DPS Scheme Status</p>
            {dpsEnrollments.length === 0 ? (
              <p className="text-small text-[var(--color-text-secondary)]">No active DPS schemes.</p>
            ) : (
              <div className="space-y-2.5">
                {dpsEnrollments.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-small">
                    <span className="text-[var(--color-text-secondary)]">
                      {d.schemeName} ({d.partnerBank})
                    </span>
                    <span className="font-semibold text-[var(--color-text)]">Active &middot; matures {formatDate(d.maturityDate, "long")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 rounded-[var(--radius-control)] border-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4">
            <p className="text-small font-medium text-[var(--color-accent-hover)]">Nest Egg at Return</p>
            <p className="mt-1 text-h1 tabular text-[var(--color-accent-hover)]">{formatBdt(nestEggTotal)}</p>
          </div>

          {involvedBanks.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-small font-semibold text-[var(--color-text)]">Partner Bank Contacts</p>
              <div className="space-y-2">
                {involvedBanks.map((bank) => (
                  <div key={bank} className="flex items-center justify-between rounded-[var(--radius-control)] bg-slate-50 px-3.5 py-2.5 text-small">
                    <span className="text-[var(--color-text)]">{bank}</span>
                    <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                      <Phone size={12} /> {PARTNER_CONTACTS[bank] ?? "See partner website"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-tiny font-normal text-[var(--color-text-secondary)]">
                Since your DPS tenure may extend beyond your time in Malaysia, you'll continue dealing with these partner banks directly in Bangladesh.
              </p>
            </div>
          )}

          <Button
            fullWidth
            variant="secondary"
            className="mt-6"
            icon={<Download size={16} />}
            onClick={() => push({ variant: "success", title: "Report downloaded", description: "Final_Consolidation_Report.pdf saved." })}
          >
            Download PDF
          </Button>
          <Button fullWidth className="mt-3" onClick={onNext}>
            Proceed to Account Closure
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-control)] bg-slate-50 p-3.5">
      <p className="text-tiny font-medium text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-0.5 text-h3 tabular text-[var(--color-text)]">{value}</p>
    </div>
  );
}
