import { useState } from "react";
import { Drawer } from "../../components/ui/Drawer";
import { AmountInput } from "../../components/ui/AmountInput";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatBdt } from "../../lib/format";

export function GoalSettingDrawer({ open, onClose, currentTotal }: { open: boolean; onClose: () => void; currentTotal: number }) {
  const nestEggGoal = useStore((s) => s.nestEggGoal);
  const setNestEggGoal = useStore((s) => s.setNestEggGoal);
  const { push } = useToast();

  const [amount, setAmount] = useState(nestEggGoal ? String(nestEggGoal.targetAmountBdt) : "2500000");
  const [date, setDate] = useState(nestEggGoal ? nestEggGoal.targetDate.slice(0, 10) : new Date(Date.now() + 1461 * 86400000).toISOString().slice(0, 10));

  const targetAmount = parseFloat(amount || "0");
  const monthsLeft = Math.max(1, Math.round((new Date(date).getTime() - Date.now()) / (30 * 86400000)));
  const remaining = Math.max(0, targetAmount - currentTotal);
  const recommendedMonthly = Math.ceil(remaining / monthsLeft);

  const handleSave = () => {
    setNestEggGoal({ targetAmountBdt: targetAmount, targetDate: new Date(date).toISOString(), recommendedMonthlyContributionBdt: recommendedMonthly });
    push({ variant: "success", title: "Nest Egg goal updated" });
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose} title="Set a Nest Egg Goal">
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-small font-medium text-[var(--color-text)]">Target Nest Egg amount</p>
          <AmountInput currencySymbol="৳" value={amount} onChange={setAmount} />
        </div>
        <Input label="Target date" type="date" value={date} onChange={(e) => setDate(e.target.value)} hint="Align this with your planned return-to-Bangladesh date" />

        <div className="rounded-[var(--radius-control)] bg-[var(--color-primary-soft)] p-4">
          <p className="text-tiny font-medium text-[var(--color-primary)]">Recommended monthly contribution</p>
          <p className="mt-1 text-h3 tabular text-[var(--color-primary)]">{formatBdt(recommendedMonthly)}/month</p>
          <p className="mt-1 text-tiny font-normal text-[var(--color-text-secondary)]">
            Based on {formatBdt(remaining)} remaining over {monthsLeft} months at your current trajectory.
          </p>
        </div>

        <Button fullWidth onClick={handleSave}>
          Save Goal
        </Button>
      </div>
    </Drawer>
  );
}
