import { useEffect, useState } from "react";
import { ArrowDownUp, AlertTriangle } from "lucide-react";
import { AmountInput } from "../../../components/ui/AmountInput";
import { SegmentedControl } from "../../../components/ui/Tabs";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useStore } from "../../../store/useStore";
import { formatBdt, formatFxRate, formatMyr } from "../../../lib/format";
import { calcCommission, calcIncentive } from "../../../lib/pricing";

export interface SendAmountState {
  sendAmountMyr: number;
  receiveAmountBdt: number;
  isRecurring: boolean;
  frequency: "weekly" | "monthly";
  startDate: string;
  endMode: "never" | "date" | "occurrences";
  endDate: string;
  occurrences: number;
}

export function AmountStep({ state, setState, onNext }: { state: SendAmountState; setState: (s: SendAmountState) => void; onNext: () => void }) {
  const fxRate = useStore((s) => s.fxRate);
  const user = useStore((s) => s.user);
  const [mode, setMode] = useState<"send" | "receive">("send");
  const [sendInput, setSendInput] = useState(state.sendAmountMyr ? String(state.sendAmountMyr) : "");
  const [receiveInput, setReceiveInput] = useState(state.receiveAmountBdt ? String(state.receiveAmountBdt) : "");

  useEffect(() => {
    const sendVal = parseFloat(sendInput || "0");
    const receiveVal = parseFloat(receiveInput || "0");
    if (mode === "send") {
      setState({ ...state, sendAmountMyr: sendVal, receiveAmountBdt: Math.round(sendVal * fxRate * 100) / 100 });
    } else {
      setState({ ...state, receiveAmountBdt: receiveVal, sendAmountMyr: Math.round((receiveVal / fxRate) * 100) / 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendInput, receiveInput, mode, fxRate]);

  const commission = calcCommission(state.sendAmountMyr);
  const total = state.sendAmountMyr + commission;
  const incentive = calcIncentive(state.receiveAmountBdt);
  const remainingDaily = user.dailyLimitMyr - user.dailyUsedMyr;
  const remainingMonthly = user.monthlyLimitMyr - user.monthlyUsedMyr;
  const exceedsLimit = total > remainingDaily || total > remainingMonthly;
  const valid = state.sendAmountMyr > 0 && !exceedsLimit;

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">How much are you sending?</h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">Enter an amount in either currency — we'll convert it live.</p>

      <div className="mt-5">
        <p className="mb-1.5 text-small font-medium text-[var(--color-text)]">You send</p>
        <AmountInput currencySymbol="RM" value={mode === "send" ? sendInput : String(state.sendAmountMyr || "")} onChange={(v) => { setMode("send"); setSendInput(v); }} autoFocus />
      </div>

      <div className="my-2 flex justify-center">
        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[var(--color-text-secondary)]">
          <ArrowDownUp size={15} />
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-small font-medium text-[var(--color-text)]">They receive</p>
        <AmountInput currencySymbol="৳" value={mode === "receive" ? receiveInput : String(state.receiveAmountBdt || "")} onChange={(v) => { setMode("receive"); setReceiveInput(v); }} />
      </div>

      <div className="mt-4 rounded-[var(--radius-control)] bg-slate-50 p-3.5 text-tiny">
        <div className="flex justify-between py-0.5">
          <span className="text-[var(--color-text-secondary)]">Exchange rate</span>
          <span className="tabular font-semibold text-[var(--color-text)]">1 MYR = {formatFxRate(fxRate)} BDT</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-[var(--color-text-secondary)]">Commission</span>
          <span className="tabular font-semibold text-[var(--color-text)]">{formatMyr(commission)}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-[var(--color-text-secondary)]">Total payable</span>
          <span className="tabular font-semibold text-[var(--color-text)]">{formatMyr(total)}</span>
        </div>
        {incentive > 0 && (
          <div className="flex justify-between py-0.5 text-[var(--color-accent)]">
            <span>Govt. incentive (2.5%) for beneficiary</span>
            <span className="tabular font-semibold">+{formatBdt(incentive)}</span>
          </div>
        )}
      </div>

      {exceedsLimit && (
        <div className="mt-3 flex items-start gap-2 rounded-[var(--radius-control)] bg-[var(--color-danger-soft)] p-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--color-danger)]" />
          <p className="text-tiny font-normal text-red-700">
            This exceeds your remaining limit ({formatMyr(Math.max(0, Math.min(remainingDaily, remainingMonthly)))} left). Request a limit increase via enhanced verification in Account &rarr; Transaction Limits.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
        <div>
          <p className="text-small font-medium text-[var(--color-text)]">Recurring transfer</p>
          <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Automatically repeat this transfer on a schedule</p>
        </div>
        <SegmentedControl
          value={state.isRecurring ? "recurring" : "once"}
          onChange={(v) => setState({ ...state, isRecurring: v === "recurring" })}
          options={[
            { label: "One-time", value: "once" },
            { label: "Recurring", value: "recurring" },
          ]}
        />
      </div>

      {state.isRecurring && (
        <div className="mt-4 space-y-4 rounded-[var(--radius-control)] bg-slate-50 p-4 animate-slide-up">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Frequency"
              options={[
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
              ]}
              value={state.frequency}
              onChange={(e) => setState({ ...state, frequency: e.target.value as "weekly" | "monthly" })}
            />
            <Input label="Start date" type="date" value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} />
          </div>
          <Select
            label="Ends"
            options={[
              { label: "Never", value: "never" },
              { label: "On date", value: "date" },
              { label: "After number of transfers", value: "occurrences" },
            ]}
            value={state.endMode}
            onChange={(e) => setState({ ...state, endMode: e.target.value as SendAmountState["endMode"] })}
          />
          {state.endMode === "date" && <Input label="End date" type="date" value={state.endDate} onChange={(e) => setState({ ...state, endDate: e.target.value })} />}
          {state.endMode === "occurrences" && (
            <Input
              label="Number of transfers"
              type="number"
              min={1}
              value={state.occurrences}
              onChange={(e) => setState({ ...state, occurrences: parseInt(e.target.value) || 1 })}
            />
          )}
        </div>
      )}

      <Button fullWidth size="lg" className="mt-7" disabled={!valid} onClick={onNext}>
        Continue
      </Button>
    </div>
  );
}
