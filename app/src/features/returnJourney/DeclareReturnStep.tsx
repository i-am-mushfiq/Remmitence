import { useState } from "react";
import { PlaneTakeoff } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";

export function DeclareReturnStep({ onDeclared }: { onDeclared: () => void }) {
  const declareReturn = useStore((s) => s.declareReturn);
  const [date, setDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10));
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Card>
      <CardBody className="text-center sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <PlaneTakeoff size={28} />
        </div>
        <h1 className="mt-5 text-h1 text-[var(--color-text)]">Returning to Bangladesh?</h1>
        <p className="mx-auto mt-2 max-w-lg text-body text-[var(--color-text-secondary)]">
          Let's make sure every Ringgit you remitted, every bill you paid, and every Taka you saved is accurately tracked and handed
          off to you cleanly — a dignified closing chapter for your time in Malaysia.
        </p>

        <div className="mx-auto mt-8 max-w-xs text-left">
          <Input label="Intended final departure date" type="date" value={date} onChange={(e) => setDate(e.target.value)} hint="Approximate is acceptable" />
        </div>

        <label className="mx-auto mt-5 flex max-w-lg items-start gap-3 rounded-[var(--radius-control)] bg-slate-50 p-4 text-left">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 text-[var(--color-primary)]" />
          <span className="text-tiny font-normal text-[var(--color-text-secondary)]">
            I understand this will pause my recurring remittances, bill auto-pay and DPS contributions from auto-renewing past my departure date, and begins my account closure journey.
          </span>
        </label>

        <Button
          size="lg"
          className="mt-6"
          disabled={!confirmed}
          onClick={() => {
            declareReturn(new Date(date).toISOString());
            onDeclared();
          }}
        >
          Start My Return Journey
        </Button>
      </CardBody>
    </Card>
  );
}
