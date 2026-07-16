import { useState } from "react";
import { Drawer } from "../../components/ui/Drawer";
import { AmountInput } from "../../components/ui/AmountInput";
import { Button } from "../../components/ui/Button";
import { FundingMethodPicker, type FundingMethod } from "../../components/shared/FundingMethodPicker";
import { StepUpAuthModal } from "../../components/shared/StepUpAuthModal";
import { SuccessOverlay } from "../../components/ui/SuccessOverlay";
import { useStore } from "../../store/useStore";
import { formatBdt, formatFxRate, formatMyr } from "../../lib/format";
import type { SavingsAccount } from "../../types";

export function TopUpSavingsDrawer({ account, onClose }: { account: SavingsAccount | null; onClose: () => void }) {
  const fxRate = useStore((s) => s.fxRate);
  const topUpSavings = useStore((s) => s.topUpSavings);
  const [amount, setAmount] = useState("");
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>("bank_transfer");
  const [otpOpen, setOtpOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!account) return null;

  const sendMyr = parseFloat(amount || "0");
  const receiveBdt = Math.round(sendMyr * fxRate * 100) / 100;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setAmount("");
    }, 300);
  };

  const handleConfirm = () => {
    topUpSavings(account.id, receiveBdt, sendMyr);
    setOtpOpen(false);
    setSuccess(true);
  };

  return (
    <>
      <Drawer open={!!account && !success} onClose={handleClose} title={`Top Up ${account.partnerBank}`}>
        <div className="space-y-5">
          <div>
            <p className="mb-1.5 text-small font-medium text-[var(--color-text)]">Amount to send (MYR)</p>
            <AmountInput currencySymbol="RM" value={amount} onChange={setAmount} autoFocus />
            <p className="mt-1.5 text-tiny font-normal text-[var(--color-text-secondary)]">
              Adds {formatBdt(receiveBdt)} at 1 MYR = {formatFxRate(fxRate)} BDT
            </p>
          </div>
          <div>
            <p className="mb-2.5 text-small font-medium text-[var(--color-text)]">Funding method</p>
            <FundingMethodPicker value={fundingMethod} onChange={setFundingMethod} />
          </div>
          <Button fullWidth disabled={!sendMyr} onClick={() => setOtpOpen(true)}>
            Confirm Top-Up
          </Button>
        </div>
      </Drawer>
      <StepUpAuthModal open={otpOpen} onClose={() => setOtpOpen(false)} amountLabel={formatMyr(sendMyr)} onVerified={handleConfirm} />
      <SuccessOverlay open={success} title="Savings Topped Up!" description={`${formatBdt(receiveBdt)} added to your ${account.partnerBank} account.`}>
        <Button fullWidth onClick={handleClose}>
          Done
        </Button>
      </SuccessOverlay>
    </>
  );
}
