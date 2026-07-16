import { useState } from "react";
import { IdCard } from "lucide-react";
import { CaptureCard } from "../../../components/ui/CaptureCard";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

export function IdentityDocStep({ data, update, onNext, onBack }: StepProps) {
  const [captured, setCaptured] = useState(false);

  const handleCaptured = () => {
    setCaptured(true);
    update({
      nidNumber: data.nidNumber || "1994 6273 8810",
      nidName: data.nidName || "Md. Rahim Uddin",
      nidDob: data.nidDob || "1994-03-12",
    });
  };

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Verify your identity</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        Capture your Bangladeshi National ID (NID) card or passport. We'll extract your details automatically.
      </p>

      <div className="mt-6">
        <CaptureCard label="Bangladeshi NID / Passport" hint="Place your document within the frame, in good lighting" icon={<IdCard size={22} />} onCaptured={handleCaptured} />
      </div>

      {captured && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <p className="text-small font-semibold text-[var(--color-text)]">Confirm extracted details</p>
          <Input label="Full name" value={data.nidName} onChange={(e) => update({ nidName: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date of birth" type="date" value={data.nidDob} onChange={(e) => update({ nidDob: e.target.value })} required />
            <Input label="NID number" value={data.nidNumber} onChange={(e) => update({ nidNumber: e.target.value })} required />
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth disabled={!captured} onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
