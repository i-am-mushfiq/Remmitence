import { Button } from "../../../components/ui/Button";
import type { StepProps } from "../registerTypes";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-small text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-small font-medium text-[var(--color-text)] text-right">{value}</span>
    </div>
  );
}

export function ReviewStep({ data, update, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Review &amp; consent</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">Please confirm your details before we submit them for verification.</p>

      <div className="mt-6 divide-y divide-[var(--color-border)] rounded-[var(--radius-control)] border border-[var(--color-border)] px-4">
        <Row label="Mobile number" value={`+60 ${data.mobileNumber}`} />
        <Row label="Full name (NID)" value={data.nidName} />
        <Row label="NID number" value={data.nidNumber} />
        <Row label="Work permit" value={data.workPermitNumber} />
        <Row label="Malaysia address" value={data.malaysiaAddressLine} />
        <Row label="Bangladesh address" value={`${data.bangladeshAddressLine}, ${data.bangladeshDistrict}, ${data.bangladeshDivision}`} />
        <Row label="Occupation" value={`${data.occupation} at ${data.employer}`} />
        <Row label="Income band" value={data.incomeBand} />
        {data.referralCode && <Row label="Referral code" value={data.referralCode} />}
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-[var(--radius-control)] bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={data.consentGiven}
          onChange={(e) => update({ consentGiven: e.target.checked })}
          className="mt-0.5 size-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        <span className="text-tiny font-normal text-[var(--color-text-secondary)]">
          I consent to RemmiNext collecting, processing and sharing my personal data with payout, biller and savings partners for KYC,
          screening and transaction purposes, in accordance with the Malaysian PDPA and RemmiNext's Privacy Policy.
        </span>
      </label>

      <div className="mt-8 flex gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth disabled={!data.consentGiven} onClick={onNext}>
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
