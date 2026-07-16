import { useState } from "react";
import { Fingerprint } from "lucide-react";
import { OTPInput } from "../../../components/ui/OTPInput";
import { Switch } from "../../../components/ui/Switch";
import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

export function PinStep({ data, update, onNext }: StepProps) {
  const [stage, setStage] = useState<"set" | "confirm">("set");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [key, setKey] = useState(0);

  const handleSet = (code: string) => {
    setFirstPin(code);
    setStage("confirm");
    setKey((k) => k + 1);
  };

  const handleConfirm = (code: string) => {
    if (code !== firstPin) {
      setError("PINs don't match. Try again.");
      setStage("set");
      setFirstPin("");
      setKey((k) => k + 1);
      return;
    }
    update({ pin: code });
    onNext();
  };

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">{stage === "set" ? "Create your PIN" : "Confirm your PIN"}</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        {stage === "set" ? "Set a 6-digit PIN to secure your app access." : "Enter the same PIN again to confirm."}
      </p>
      <div className="mt-6">
        <OTPInput key={key} onComplete={stage === "set" ? handleSet : handleConfirm} error={error} />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Fingerprint size={18} />
          </div>
          <div>
            <p className="text-small font-medium text-[var(--color-text)]">Enable biometric unlock</p>
            <p className="text-tiny text-[var(--color-text-secondary)]">Use fingerprint or face unlock instead of PIN</p>
          </div>
        </div>
        <Switch checked={data.biometricEnabled} onChange={(v) => update({ biometricEnabled: v })} />
      </div>

      {stage === "confirm" && (
        <Button variant="ghost" className="mt-4" onClick={() => { setStage("set"); setFirstPin(""); setKey((k) => k + 1); }}>
          Start over
        </Button>
      )}
    </div>
  );
}
