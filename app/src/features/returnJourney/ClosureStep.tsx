import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StepUpAuthModal } from "../../components/shared/StepUpAuthModal";
import { SuccessOverlay } from "../../components/ui/SuccessOverlay";
import { useStore } from "../../store/useStore";

export function ClosureStep() {
  const navigate = useNavigate();
  const transactions = useStore((s) => s.transactions);
  const advanceReturnJourney = useStore((s) => s.advanceReturnJourney);
  const resetReturnJourney = useStore((s) => s.resetReturnJourney);
  const signOut = useStore((s) => s.signOut);

  const [confirmed1, setConfirmed1] = useState(false);
  const [confirmed2, setConfirmed2] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [closed, setClosed] = useState(false);

  const pendingCount = transactions.filter((t) => ["initiated", "funds_received", "processing", "compliance_review"].includes(t.status)).length;

  const handleClosed = () => {
    setOtpOpen(false);
    advanceReturnJourney("closed");
    setClosed(true);
  };

  const finish = () => {
    resetReturnJourney();
    signOut();
    navigate("/login");
  };

  return (
    <>
      <Card>
        <CardBody className="sm:p-7">
          <h2 className="text-h2 text-[var(--color-text)]">Guided Account Closure</h2>
          <p className="mt-1 text-small text-[var(--color-text-secondary)]">
            One last check before we close your RemmiNext account. Your Final Consolidation Report stays downloadable from your email for a defined retention period even after closure.
          </p>

          {pendingCount > 0 ? (
            <div className="mt-6 rounded-[var(--radius-control)] bg-[var(--color-warning-soft)] p-4 text-small text-amber-700">
              You have {pendingCount} transaction(s) still in progress. Please wait for these to complete before closing your account.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <label className="flex items-start gap-3 rounded-[var(--radius-control)] bg-slate-50 p-4">
                <input type="checkbox" checked={confirmed1} onChange={(e) => setConfirmed1(e.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 text-[var(--color-primary)]" />
                <span className="text-small text-[var(--color-text)]">
                  I understand no funds are held by RemmiNext directly — my savings and DPS balances remain with their respective partner banks in Bangladesh.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-[var(--radius-control)] bg-slate-50 p-4">
                <input type="checkbox" checked={confirmed2} onChange={(e) => setConfirmed2(e.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 text-[var(--color-primary)]" />
                <span className="text-small text-[var(--color-text)]">
                  I confirm there are no pending transactions and I wish to permanently close my RemmiNext account.
                </span>
              </label>

              <Button fullWidth size="lg" className="mt-4" icon={<ShieldCheck size={16} />} disabled={!confirmed1 || !confirmed2} onClick={() => setOtpOpen(true)}>
                Confirm Account Closure
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <StepUpAuthModal open={otpOpen} onClose={() => setOtpOpen(false)} onVerified={handleClosed} />

      <SuccessOverlay open={closed} title="Account Closed" description="Thank you for building your future with RemmiNext. Best of luck back home in Bangladesh.">
        <div className="flex items-center justify-center gap-2 text-small text-[var(--color-text-secondary)]">
          <CheckCircle2 size={16} className="text-[var(--color-accent)]" />
          Your Final Consolidation Report was emailed to you.
        </div>
        <Button fullWidth onClick={finish}>
          Done
        </Button>
      </SuccessOverlay>
    </>
  );
}
