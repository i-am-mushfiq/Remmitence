import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

const DIVISIONS = ["Barisal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"];

export function AddressStep({ data, update, onNext, onBack }: StepProps) {
  const valid = data.malaysiaAddressLine && data.malaysiaPostcode && data.bangladeshAddressLine && data.bangladeshDivision && data.bangladeshDistrict;

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Your addresses</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        We need both your current Malaysian address and your family's permanent address in Bangladesh.
      </p>

      <div className="mt-6 space-y-4">
        <p className="text-small font-semibold text-[var(--color-text)]">Malaysia — current residential address</p>
        <Input label="Address" required value={data.malaysiaAddressLine} onChange={(e) => update({ malaysiaAddressLine: e.target.value })} placeholder="Unit, building, street, city" />
        <Input label="Postcode" required value={data.malaysiaPostcode} onChange={(e) => update({ malaysiaPostcode: e.target.value })} placeholder="41050" />
      </div>

      <div className="mt-7 space-y-4 border-t border-[var(--color-border)] pt-6">
        <p className="text-small font-semibold text-[var(--color-text)]">Bangladesh — permanent / family address</p>
        <Input label="Address" required value={data.bangladeshAddressLine} onChange={(e) => update({ bangladeshAddressLine: e.target.value })} placeholder="Village, post office" />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Division"
            required
            placeholder="Select division"
            options={DIVISIONS.map((d) => ({ label: d, value: d }))}
            value={data.bangladeshDivision}
            onChange={(e) => update({ bangladeshDivision: e.target.value })}
          />
          <Input label="District" required value={data.bangladeshDistrict} onChange={(e) => update({ bangladeshDistrict: e.target.value })} placeholder="Bhola" />
        </div>
        <Input label="Upazila / Thana" value={data.bangladeshUpazila} onChange={(e) => update({ bangladeshUpazila: e.target.value })} placeholder="Charfasson" />
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
