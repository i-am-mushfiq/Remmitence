import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Phone, ScanFace } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { OTPInput } from "../../components/ui/OTPInput";
import { CaptureCard } from "../../components/ui/CaptureCard";
import { Stepper } from "../../components/ui/Stepper";
import { useToast } from "../../components/ui/Toast";

const STEPS = ["Mobile", "OTP", "Identity", "New PIN"];

export default function ForgotPinPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState("");
  const [otpError, setOtpError] = useState("");
  const [selfieDone, setSelfieDone] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [pinKey, setPinKey] = useState(0);
  const [done, setDone] = useState(false);

  const handleFinalPin = (code: string) => {
    if (!newPin) {
      setNewPin(code);
      setPinKey((k) => k + 1);
      return;
    }
    if (code !== newPin) {
      setConfirmError("PINs don't match. Try again.");
      setNewPin("");
      setPinKey((k) => k + 1);
      return;
    }
    setDone(true);
    push({ variant: "success", title: "PIN updated", description: "Your PIN was changed successfully." });
  };

  if (done) {
    return (
      <AuthLayout>
        <Card>
          <CardBody className="flex flex-col items-center py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
              <CheckCircle2 size={30} className="text-[var(--color-accent)]" />
            </div>
            <h1 className="mt-5 text-h2 text-[var(--color-text)]">PIN reset complete</h1>
            <p className="mt-1.5 text-small text-[var(--color-text-secondary)]">
              We've notified you by SMS and email. If this wasn't you, contact support immediately.
            </p>
            <Button fullWidth size="lg" className="mt-7" onClick={() => navigate("/login")}>
              Back to sign in
            </Button>
          </CardBody>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <Stepper steps={STEPS} current={step} />
      </div>
      <Card>
        <CardBody className="sm:p-7">
          {step === 0 && (
            <div>
              <h2 className="text-h2 text-[var(--color-text)]">Forgot your PIN?</h2>
              <p className="mt-1 text-small text-[var(--color-text-secondary)]">Enter your registered mobile number to receive a reset code.</p>
              <div className="mt-6 space-y-5">
                <Input label="Malaysian mobile number" required value={mobile} onChange={(e) => setMobile(e.target.value)} leftIcon={<Phone size={16} />} />
                <Button fullWidth size="lg" disabled={mobile.replace(/\D/g, "").length < 9} onClick={() => setStep(1)}>
                  Send Reset Code
                </Button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="text-h2 text-[var(--color-text)]">Enter the code</h2>
              <p className="mt-1 text-small text-[var(--color-text-secondary)]">Sent to +60 {mobile}</p>
              <div className="mt-6">
                <OTPInput
                  error={otpError}
                  onComplete={(code) => {
                    if (/^\d{6}$/.test(code)) {
                      setOtpError("");
                      setStep(2);
                    } else setOtpError("Invalid code.");
                  }}
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-h2 text-[var(--color-text)]">Confirm it's you</h2>
              <p className="mt-1 text-small text-[var(--color-text-secondary)]">A quick liveliness selfie check for step-up authentication.</p>
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
              <h2 className="text-h2 text-[var(--color-text)]">{newPin ? "Confirm your new PIN" : "Set a new PIN"}</h2>
              <p className="mt-1 text-small text-[var(--color-text-secondary)]">{newPin ? "Enter it once more to confirm." : "Choose a 6-digit PIN you'll remember."}</p>
              <div className="mt-6">
                <OTPInput key={pinKey} onComplete={handleFinalPin} error={confirmError} />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      <p className="mt-5 text-center text-small text-[var(--color-text-secondary)]">
        Remembered your PIN?{" "}
        <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
