import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { AuthLayout } from "../../../components/layout/AuthLayout";
import { Card, CardBody } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

const CHECKS = [
  "Validating identity documents",
  "Running sanctions & PEP screening",
  "Calculating risk-based decision",
];

export function VerificationPendingStep({ onApproved }: { onApproved: () => void }) {
  const [checkIndex, setCheckIndex] = useState(0);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (checkIndex >= CHECKS.length) {
      const t = setTimeout(() => setApproved(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCheckIndex((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [checkIndex]);

  return (
    <AuthLayout>
      <Card>
        <CardBody className="flex flex-col items-center py-10 text-center">
          {!approved ? (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
                <ShieldCheck size={30} className="text-[var(--color-primary)]" />
              </div>
              <h1 className="mt-5 text-h2 text-[var(--color-text)]">Verifying your details</h1>
              <p className="mt-1.5 text-small text-[var(--color-text-secondary)]">This usually takes less than a minute.</p>

              <div className="mt-7 w-full space-y-3.5 text-left">
                {CHECKS.map((c, i) => (
                  <div key={c} className="flex items-center gap-3">
                    {i < checkIndex ? (
                      <CheckCircle2 size={18} className="shrink-0 text-[var(--color-accent)]" />
                    ) : i === checkIndex ? (
                      <Loader2 size={18} className="shrink-0 animate-spin text-[var(--color-primary)]" />
                    ) : (
                      <div className="size-[18px] shrink-0 rounded-full border-2 border-slate-200" />
                    )}
                    <span className={`text-small ${i <= checkIndex ? "text-[var(--color-text)]" : "text-slate-400"}`}>{c}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="animate-slide-up">
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                <CheckCircle2 size={30} className="text-[var(--color-accent)]" />
              </div>
              <h1 className="mt-5 text-h2 text-[var(--color-text)]">You're verified!</h1>
              <p className="mt-1.5 max-w-xs text-small text-[var(--color-text-secondary)]">
                Your account is approved. You're all set to send your first remittance to Bangladesh.
              </p>
              <Button fullWidth size="lg" className="mt-7" onClick={onApproved}>
                Go to my dashboard
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
