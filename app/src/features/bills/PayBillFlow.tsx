import { useState } from "react";
import { Drawer } from "../../components/ui/Drawer";
import { AmountInput } from "../../components/ui/AmountInput";
import { Button } from "../../components/ui/Button";
import { FundingMethodPicker, type FundingMethod } from "../../components/shared/FundingMethodPicker";
import { StepUpAuthModal } from "../../components/shared/StepUpAuthModal";
import { SuccessOverlay } from "../../components/ui/SuccessOverlay";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatBdt, formatFxRate, formatMyr } from "../../lib/format";
import type { Biller } from "../../types";

export function PayBillFlow({ biller, onClose }: { biller: Biller | null; onClose: () => void }) {
  const fxRate = useStore((s) => s.fxRate);
  const payBill = useStore((s) => s.payBill);
  const { push } = useToast();
  const [amount, setAmount] = useState(biller?.lastBillAmountBdt ? String(biller.lastBillAmountBdt) : "");
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>("card");
  const [otpOpen, setOtpOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!biller) return null;

  const amountBdt = parseFloat(amount || "0");
  const myrEquivalent = amountBdt / fxRate;
  const commission = Math.max(1, Math.round(myrEquivalent * 0.02 * 100) / 100);
  const total = myrEquivalent + commission;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setAmount("");
    }, 300);
  };

  const handlePay = () => {
    payBill({ billerId: biller.id, amountBdt, fundingMethod });
    setOtpOpen(false);
    setSuccess(true);
    push({ variant: "success", title: "Bill payment submitted" });
  };

  return (
    <>
      <Drawer open={!!biller && !success} onClose={handleClose} title={`Pay ${biller.label}`}>
        <div className="space-y-5">
          {biller.supportsLiveFetch && biller.lastBillAmountBdt && (
            <div className="rounded-[var(--radius-control)] bg-[var(--color-primary-soft)] p-3.5 text-tiny text-[var(--color-primary)]">
              Live bill fetched: {formatBdt(biller.lastBillAmountBdt)} due {biller.lastBillDueDate ? new Date(biller.lastBillDueDate).toLocaleDateString() : ""}
            </div>
          )}
          <div>
            <p className="mb-1.5 text-small font-medium text-[var(--color-text)]">Amount to pay</p>
            <AmountInput currencySymbol="৳" value={amount} onChange={setAmount} />
          </div>
          <div className="rounded-[var(--radius-control)] bg-slate-50 p-3.5 text-tiny">
            <div className="flex justify-between py-0.5">
              <span className="text-[var(--color-text-secondary)]">Exchange rate</span>
              <span className="tabular font-semibold text-[var(--color-text)]">1 MYR = {formatFxRate(fxRate)} BDT</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-[var(--color-text-secondary)]">MYR debit + fee</span>
              <span className="tabular font-semibold text-[var(--color-text)]">{formatMyr(total)}</span>
            </div>
          </div>
          <div>
            <p className="mb-2.5 text-small font-medium text-[var(--color-text)]">Funding method</p>
            <FundingMethodPicker value={fundingMethod} onChange={setFundingMethod} />
          </div>
          <Button fullWidth disabled={!amountBdt} onClick={() => setOtpOpen(true)}>
            Confirm Payment
          </Button>
        </div>
      </Drawer>

      <StepUpAuthModal open={otpOpen} onClose={() => setOtpOpen(false)} amountLabel={formatMyr(total)} onVerified={handlePay} />

      <SuccessOverlay open={success} title="Bill Paid!" description={`${formatBdt(amountBdt)} sent to ${biller.providerName}.`}>
        <Button fullWidth onClick={handleClose}>
          Done
        </Button>
      </SuccessOverlay>
    </>
  );
}
