import { useEffect, useState } from "react";
import { Clock, RefreshCcw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FundingMethodPicker, type FundingMethod } from "../../../components/shared/FundingMethodPicker";
import { StepUpAuthModal } from "../../../components/shared/StepUpAuthModal";
import { useStore } from "../../../store/useStore";
import { formatBdt, formatFxRate, formatMyr } from "../../../lib/format";
import { calcCommission, calcIncentive, estimatedPayoutTime } from "../../../lib/pricing";
import type { Beneficiary } from "../../../types";
import type { SendAmountState } from "./AmountStep";

const RATE_LOCK_SECONDS = 90;

export function ConfirmStep({
  amountState,
  beneficiary,
  fundingMethod,
  setFundingMethod,
  onBack,
  onConfirmed,
}: {
  amountState: SendAmountState;
  beneficiary: Beneficiary;
  fundingMethod: FundingMethod;
  setFundingMethod: (m: FundingMethod) => void;
  onBack: () => void;
  onConfirmed: () => void;
}) {
  const fxRate = useStore((s) => s.fxRate);
  const [secondsLeft, setSecondsLeft] = useState(RATE_LOCK_SECONDS);
  const [otpOpen, setOtpOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const commission = calcCommission(amountState.sendAmountMyr);
  const total = amountState.sendAmountMyr + commission;
  const incentive = calcIncentive(amountState.receiveAmountBdt);
  const payoutTime = estimatedPayoutTime(beneficiary.type === "bank" ? "bank" : beneficiary.type === "mfs" ? "mfs" : "cash_pickup");
  const expired = secondsLeft === 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">Review &amp; confirm</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">Double-check the details before authorising this transfer.</p>

      <div
        className={`mt-4 flex items-center justify-between rounded-[var(--radius-control)] px-3.5 py-2.5 text-tiny font-medium ${
          expired ? "bg-[var(--color-warning-soft)] text-amber-700" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Clock size={14} /> {expired ? "Rate expired — refresh to continue" : "Rate locked for"}
        </span>
        {!expired ? (
          <span className="tabular font-semibold">
            {mins}:{String(secs).padStart(2, "0")}
          </span>
        ) : (
          <button onClick={() => setSecondsLeft(RATE_LOCK_SECONDS)} className="flex items-center gap-1 font-semibold hover:underline">
            <RefreshCcw size={13} /> Refresh Rate
          </button>
        )}
      </div>

      <div className="mt-4 rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
        <p className="text-tiny font-medium text-[var(--color-text-secondary)]">Sending to</p>
        <p className="mt-0.5 text-small font-semibold text-[var(--color-text)]">{beneficiary.fullName}</p>
        <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
          {beneficiary.type === "bank" ? `${beneficiary.bankName} •••• ${beneficiary.accountNumber?.slice(-4)}` : beneficiary.type === "mfs" ? `${beneficiary.mfsProvider} • ${beneficiary.mobileNumber}` : beneficiary.pickupNetwork}
        </p>
      </div>

      <div className="mt-4 divide-y divide-[var(--color-border)] rounded-[var(--radius-control)] border border-[var(--color-border)] px-4">
        <Row label="Send amount" value={formatMyr(amountState.sendAmountMyr)} />
        <Row label="Exchange rate" value={`1 MYR = ${formatFxRate(fxRate)} BDT`} />
        <Row label="Commission" value={formatMyr(commission)} />
        <Row label="Total payable" value={formatMyr(total)} strong />
        <Row label="Recipient gets" value={formatBdt(amountState.receiveAmountBdt)} strong accent />
        {incentive > 0 && <Row label="+ Govt. incentive (2.5%)" value={formatBdt(incentive)} accent />}
        <Row label="Estimated payout time" value={payoutTime} />
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-small font-medium text-[var(--color-text)]">Funding method</p>
        <FundingMethodPicker value={fundingMethod} onChange={setFundingMethod} />
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth disabled={expired} onClick={() => setOtpOpen(true)}>
          Confirm &amp; Authorise
        </Button>
      </div>

      <StepUpAuthModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        amountLabel={formatMyr(total)}
        onVerified={() => {
          setOtpOpen(false);
          onConfirmed();
        }}
      />
    </div>
  );
}

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-small text-[var(--color-text-secondary)]">{label}</span>
      <span className={`tabular text-small ${strong ? "font-bold" : "font-medium"} ${accent ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"}`}>{value}</span>
    </div>
  );
}
