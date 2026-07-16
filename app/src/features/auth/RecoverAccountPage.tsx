import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Phone, ScanFace, ShieldAlert } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { OTPInput } from "../../components/ui/OTPInput";
import { CaptureCard } from "../../components/ui/CaptureCard";
import { Stepper } from "../../components/ui/Stepper";

const STEPS = ["Mobile", "OTP", "Identity", "New PIN"];

export default function RecoverAccountPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState("");
  const [selfieDone, setSelfieDone] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <AuthLayout>
      {!done ? (
        <>
          <div className="mb-6">
            <Stepper steps={STEPS} current={step} />
          </div>
          <Card>
            <CardBody className="sm:p-7">
              {step === 0 && (
                <div>
                  <h2 className="text-h2 text-[var(--color-text)]">Recover your account</h2>
                  <p className="mt-1 text-small text-[var(--color-text-secondary)]">Enter your registered mobile number to get started on this new device.</p>
                  <div className="mt-6 space-y-5">
                    <Input label="Registered mobile number" required value={mobile} onChange={(e) => setMobile(e.target.value)} leftIcon={<Phone size={16} />} />
                    <Button fullWidth size="lg" disabled={mobile.replace(/\D/g, "").length < 9} onClick={() => setStep(1)}>
                      Send OTP
                    </Button>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div>
                  <h2 className="text-h2 text-[var(--color-text)]">Enter the code</h2>
                  <p className="mt-1 text-small text-[var(--color-text-secondary)]">Sent to +60 {mobile}</p>
                  <div className="mt-6">
                    <OTPInput onComplete={(code) => /^\d{6}$/.test(code) && setStep(2)} />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="text-h2 text-[var(--color-text)]">Confirm it's you</h2>
                  <p className="mt-1 text-small text-[var(--color-text-secondary)]">
                    We'll match your live selfie against the identity document already on file.
                  </p>
                  <div className="mt-6">
                    <CaptureCard label="Live selfie" aspect="square" icon={<ScanFace size={22} />} onCaptured={() => setSelfieDone(true)} />
                  </div>
                  <Button fullWidth size="lg" className="mt-6" disabled={!selfieDone} onClick={() => setStep(3)}>
                    Continue
                  </Button>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-h2 text-[var(--color-text)]">Set a new PIN</h2>
                  <p className="mt-1 text-small text-[var(--color-text-secondary)]">This will replace your PIN on all devices.</p>
                  <div className="mt-6">
                    <OTPInput onComplete={(code) => /^\d{6}$/.test(code) && setDone(true)} />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
          <p className="mt-5 text-center text-small text-[var(--color-text-secondary)]">
            <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
              Back to sign in
            </Link>
          </p>
        </>
      ) : (
        <Card>
          <CardBody className="flex flex-col items-center py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
              <CheckCircle2 size={30} className="text-[var(--color-accent)]" />
            </div>
            <h1 className="mt-5 text-h2 text-[var(--color-text)]">Access restored</h1>
            <p className="mt-1.5 max-w-xs text-small text-[var(--color-text-secondary)]">
              You're all set on this device. For your security, all other active sessions have been signed out.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-control)] bg-[var(--color-warning-soft)] p-3 text-left">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-tiny font-normal text-amber-700">All previous device sessions have been invalidated as a security precaution.</p>
            </div>
            <Button fullWidth size="lg" className="mt-6" onClick={() => navigate("/login")}>
              Continue to sign in
            </Button>
          </CardBody>
        </Card>
      )}
    </AuthLayout>
  );
}
