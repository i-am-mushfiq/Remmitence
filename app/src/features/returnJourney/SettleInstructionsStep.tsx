import { Send, Receipt, Landmark, AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SegmentedControl } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import { useStore } from "../../store/useStore";
import { formatMyr } from "../../lib/format";

type Decision = "stop" | "continue" | "final_payment";

export function SettleInstructionsStep({ onNext }: { onNext: () => void }) {
  const allRecurringRemittances = useStore((s) => s.recurringRemittances);
  const allBillers = useStore((s) => s.billers);
  const allDpsEnrollments = useStore((s) => s.dpsEnrollments);
  const recurringRemittances = allRecurringRemittances.filter((r) => r.status === "active");
  const billers = allBillers.filter((b) => b.autoPay?.enabled);
  const dpsEnrollments = allDpsEnrollments.filter((d) => d.autoContribution.enabled);
  const overdueBillers = allBillers.filter((b) => b.status === "overdue");
  const returnJourney = useStore((s) => s.returnJourney);
  const setRecurringDecision = useStore((s) => s.setRecurringDecision);

  const allInstructions = [
    ...recurringRemittances.map((r) => ({ id: r.id, label: r.beneficiaryName, sub: `${formatMyr(r.amountMyr)} / ${r.frequency}`, icon: Send, forceDecision: undefined as Decision | undefined })),
    ...billers.map((b) => ({ id: b.id, label: b.label, sub: "Auto-pay bill", icon: Receipt, forceDecision: undefined })),
    ...dpsEnrollments.map((d) => ({ id: d.id, label: d.schemeName, sub: `${formatMyr(d.autoContribution.amountMyr)} / month DPS`, icon: Landmark, forceDecision: "continue" as Decision })),
  ];

  const decisions = returnJourney.recurringDecisions ?? {};
  const allDecided = allInstructions.every((i) => i.forceDecision || decisions[i.id]);

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-h3">Recurring Instructions</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <p className="text-small text-[var(--color-text-secondary)]">
            Decide what happens to each standing instruction as you leave Malaysia. DPS contributions typically continue since tenure often
            extends beyond your departure — the partner bank handles this directly once you're back home.
          </p>
          {allInstructions.length === 0 ? (
            <p className="text-small text-[var(--color-text-secondary)]">You have no active recurring instructions.</p>
          ) : (
            allInstructions.map((instr) => (
              <div key={instr.id} className="flex flex-col gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <instr.icon size={17} className="text-[var(--color-text-secondary)]" />
                  <div>
                    <p className="text-small font-medium text-[var(--color-text)]">{instr.label}</p>
                    <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{instr.sub}</p>
                  </div>
                </div>
                {instr.forceDecision ? (
                  <Badge tone="info">Continues in Bangladesh</Badge>
                ) : (
                  <SegmentedControl
                    value={decisions[instr.id] ?? ""}
                    onChange={(v) => setRecurringDecision(instr.id, v as Decision)}
                    options={[
                      { label: "Stop", value: "stop" },
                      { label: "Final only", value: "final_payment" },
                      { label: "Continue", value: "continue" },
                    ]}
                  />
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {overdueBillers.length > 0 && (
        <Card className="mt-5">
          <CardBody className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
            <div>
              <p className="text-small font-semibold text-[var(--color-text)]">Outstanding bills to settle</p>
              <p className="mt-1 text-tiny font-normal text-[var(--color-text-secondary)]">
                {overdueBillers.map((b) => b.label).join(", ")} — please settle these before generating your final report so your family's utilities stay uninterrupted.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <Button fullWidth size="lg" className="mt-6" disabled={!allDecided} onClick={onNext}>
        Continue to Final Report
      </Button>
    </div>
  );
}
