import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Modal } from "../ui/Modal";
import { OTPInput } from "../ui/OTPInput";
import { Button } from "../ui/Button";

export function StepUpAuthModal({ open, onClose, onVerified, amountLabel }: { open: boolean; onClose: () => void; onVerified: () => void; amountLabel?: string }) {
  const [error, setError] = useState("");
  const [key, setKey] = useState(0);

  const verify = (code: string) => {
    if (/^\d{6}$/.test(code)) {
      setError("");
      onVerified();
    } else {
      setError("Invalid code, please try again.");
      setKey((k) => k + 1);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" hideClose>
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <ShieldCheck size={22} />
        </div>
        <h2 className="mt-4 text-h3 text-[var(--color-text)]">Confirm this transaction</h2>
        <p className="mt-1 text-small text-[var(--color-text-secondary)]">
          {amountLabel ? `Enter the OTP sent to your mobile to authorise ${amountLabel}.` : "Enter the OTP sent to your registered mobile number."}
        </p>
        <div className="mt-6">
          <OTPInput key={key} onComplete={verify} error={error} />
        </div>
        <p className="mt-4 text-tiny text-slate-400">Demo tip: any 6 digits will verify.</p>
        <Button variant="ghost" className="mt-2" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
