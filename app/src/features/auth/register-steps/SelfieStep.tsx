import { useState } from "react";
import { ScanFace } from "lucide-react";
import { CaptureCard } from "../../../components/ui/CaptureCard";
import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

export function SelfieStep({ update, onNext, onBack }: StepProps) {
  const [captured, setCaptured] = useState(false);

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Selfie &amp; liveliness check</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        Look directly at the camera. We'll match this against your identity document photo to confirm it's really you.
      </p>

      <div className="mt-6">
        <CaptureCard
          label="Live selfie"
          hint="Make sure your face is well-lit and unobstructed"
          aspect="square"
          icon={<ScanFace size={22} />}
          onCaptured={() => {
            setCaptured(true);
            update({ selfieVerified: true });
          }}
        />
      </div>

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
