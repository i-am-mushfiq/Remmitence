import { useState } from "react";
import { Briefcase } from "lucide-react";
import { CaptureCard } from "../../../components/ui/CaptureCard";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

export function WorkPermitStep({ data, update, onNext, onBack }: StepProps) {
  const [captured, setCaptured] = useState(false);

  const handleCaptured = () => {
    setCaptured(true);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 94);
    update({
      workPermitNumber: data.workPermitNumber || "WP-MY-88213047",
      workPermitExpiry: data.workPermitExpiry || expiry.toISOString().slice(0, 10),
    });
  };

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Confirm your legal status in Malaysia</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        Capture your valid work permit / employment pass to establish your legal residency and employment basis.
      </p>

      <div className="mt-6">
        <CaptureCard label="Work Permit / Employment Pass" hint="Ensure the permit number and expiry date are clearly visible" icon={<Briefcase size={22} />} onCaptured={handleCaptured} />
      </div>

      {captured && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <Input label="Work permit number" value={data.workPermitNumber} onChange={(e) => update({ workPermitNumber: e.target.value })} required />
          <Input label="Expiry date" type="date" value={data.workPermitExpiry} onChange={(e) => update({ workPermitExpiry: e.target.value })} required />
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
