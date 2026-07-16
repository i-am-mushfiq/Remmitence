import { useState } from "react";
import { Drawer } from "../../components/ui/Drawer";
import { SegmentedControl } from "../../components/ui/Tabs";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { StepUpAuthModal } from "../../components/shared/StepUpAuthModal";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import type { Biller } from "../../types";

export function AutoPaySetupDrawer({ biller, onClose }: { biller: Biller | null; onClose: () => void }) {
  const setAutoPay = useStore((s) => s.setAutoPay);
  const { push } = useToast();
  const [mode, setMode] = useState<"fixed" | "fetched_capped">(biller?.supportsLiveFetch ? "fetched_capped" : "fixed");
  const [amount, setAmount] = useState("1000");
  const [day, setDay] = useState(5);
  const [otpOpen, setOtpOpen] = useState(false);

  if (!biller) return null;

  const handleConfirm = () => {
    setAutoPay(biller.id, {
      enabled: true,
      mode,
      fixedAmountBdt: mode === "fixed" ? parseFloat(amount) : undefined,
      capAmountBdt: mode === "fetched_capped" ? parseFloat(amount) : undefined,
      paymentDay: day,
      consecutiveFailures: 0,
      paused: false,
    });
    setOtpOpen(false);
    push({ variant: "success", title: "Auto-Pay enabled", description: `${biller.label} will be paid automatically each cycle.` });
    onClose();
  };

  return (
    <>
      <Drawer open={!!biller} onClose={onClose} title={`Auto-Pay: ${biller.label}`}>
        <div className="space-y-5">
          {biller.supportsLiveFetch && (
            <SegmentedControl
              value={mode}
              onChange={(v) => setMode(v as "fixed" | "fetched_capped")}
              options={[
                { label: "Pay fetched amount", value: "fetched_capped" },
                { label: "Fixed amount", value: "fixed" },
              ]}
            />
          )}
          <Input
            label={mode === "fixed" ? "Fixed amount (BDT)" : "Maximum cap (BDT)"}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            hint={mode === "fetched_capped" ? "We'll pay the live fetched bill amount, up to this cap." : undefined}
          />
          <Input label="Payment day of month" type="number" min={1} max={28} value={day} onChange={(e) => setDay(parseInt(e.target.value) || 1)} />
          <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
            If funds are unavailable or the fetched amount exceeds your cap, that cycle will be skipped and you'll be notified to pay manually.
          </p>
          <Button fullWidth onClick={() => setOtpOpen(true)}>
            Authorise Standing Instruction
          </Button>
        </div>
      </Drawer>
      <StepUpAuthModal open={otpOpen} onClose={() => setOtpOpen(false)} onVerified={handleConfirm} />
    </>
  );
}
