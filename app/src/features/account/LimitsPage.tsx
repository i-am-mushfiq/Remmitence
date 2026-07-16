import { Gauge, ArrowUpCircle } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressRing";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatMyr } from "../../lib/format";

export default function LimitsPage() {
  const user = useStore((s) => s.user);
  const { push } = useToast();

  const dailyPct = Math.round((user.dailyUsedMyr / user.dailyLimitMyr) * 100);
  const monthlyPct = Math.round((user.monthlyUsedMyr / user.monthlyLimitMyr) * 100);

  return (
    <div>
      <PageHeader title="Transaction Limits" back="/account" />

      <Card>
        <CardHeader>
          <h2 className="text-h3">Current Risk Tier</h2>
          <Badge tone="info">{user.riskTier}</Badge>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <div className="mb-1.5 flex justify-between text-small">
              <span className="font-medium text-[var(--color-text)]">Daily limit</span>
              <span className="tabular text-[var(--color-text-secondary)]">
                {formatMyr(user.dailyUsedMyr)} / {formatMyr(user.dailyLimitMyr)}
              </span>
            </div>
            <ProgressBar percent={dailyPct} color="var(--color-primary)" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-small">
              <span className="font-medium text-[var(--color-text)]">Monthly limit</span>
              <span className="tabular text-[var(--color-text-secondary)]">
                {formatMyr(user.monthlyUsedMyr)} / {formatMyr(user.monthlyLimitMyr)}
              </span>
            </div>
            <ProgressBar percent={monthlyPct} color="var(--color-accent)" />
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Gauge size={22} />
          </div>
          <div>
            <p className="text-h3 text-[var(--color-text)]">Need a higher limit?</p>
            <p className="mt-1 max-w-sm text-small text-[var(--color-text-secondary)]">
              Complete enhanced verification (additional income proof and a compliance review) to request an increase to your daily and monthly limits.
            </p>
          </div>
          <Button
            icon={<ArrowUpCircle size={16} />}
            onClick={() => push({ variant: "info", title: "Request submitted", description: "Compliance will review your enhanced verification request." })}
          >
            Request Limit Increase
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
