import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

const INCOME_BANDS = [
  "Below RM 1,500 / month",
  "RM 1,500 – RM 2,000 / month",
  "RM 2,000 – RM 3,000 / month",
  "RM 3,000 – RM 5,000 / month",
  "Above RM 5,000 / month",
];

export function OccupationStep({ data, update, onNext, onBack }: StepProps) {
  const valid = data.occupation && data.employer && data.incomeBand;

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Occupation &amp; income</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        This helps us verify your source of funds, as required under Malaysian and Bangladeshi financial regulation.
      </p>

      <div className="mt-6 space-y-4">
        <Input label="Occupation" required value={data.occupation} onChange={(e) => update({ occupation: e.target.value })} placeholder="e.g., Machine Operator" />
        <Input label="Employer name" required value={data.employer} onChange={(e) => update({ employer: e.target.value })} placeholder="e.g., Kluang Precision Manufacturing Sdn. Bhd." />
        <Select
          label="Approximate monthly income"
          required
          placeholder="Select income band"
          options={INCOME_BANDS.map((b) => ({ label: b, value: b }))}
          value={data.incomeBand}
          onChange={(e) => update({ incomeBand: e.target.value })}
        />
        <Input
          label="Referral code (optional)"
          value={data.referralCode}
          onChange={(e) => update({ referralCode: e.target.value.toUpperCase() })}
          placeholder="Enter code from a friend"
          hint="Both you and your referrer may receive a reward after your first successful remittance."
        />
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth disabled={!valid} onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
