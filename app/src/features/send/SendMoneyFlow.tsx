import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Stepper } from "../../components/ui/Stepper";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { useStore } from "../../store/useStore";
import { AmountStep, type SendAmountState } from "./steps/AmountStep";
import { RecipientStep } from "./steps/RecipientStep";
import { ConfirmStep } from "./steps/ConfirmStep";
import { SuccessStep } from "./steps/SuccessStep";
import type { FundingMethod } from "../../components/shared/FundingMethodPicker";
import type { Transaction } from "../../types";

const STEP_LABELS = ["Amount", "Recipient", "Confirm"];

const initialAmountState: SendAmountState = {
  sendAmountMyr: 0,
  receiveAmountBdt: 0,
  isRecurring: false,
  frequency: "monthly",
  startDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  endMode: "never",
  endDate: "",
  occurrences: 12,
};

export default function SendMoneyFlow() {
  const beneficiaries = useStore((s) => s.beneficiaries);
  const defaultBeneficiary = beneficiaries.find((b) => b.isDefault && b.isActive);
  const createRemittance = useStore((s) => s.createRemittance);
  const addRecurringRemittance = useStore((s) => s.addRecurringRemittance);

  const [step, setStep] = useState(0);
  const [amountState, setAmountState] = useState<SendAmountState>(initialAmountState);
  const [beneficiaryId, setBeneficiaryId] = useState<string | null>(defaultBeneficiary?.id ?? null);
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>("bank_transfer");
  const [resultTxn, setResultTxn] = useState<Transaction | null>(null);

  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId);

  const handleConfirmed = () => {
    if (!beneficiary) return;
    const payoutMethod = beneficiary.type === "bank" ? "bank" : beneficiary.type === "mfs" ? "mfs" : "cash_pickup";
    const commission = amountState.sendAmountMyr < 200 ? 5 : amountState.sendAmountMyr < 1000 ? 6 : amountState.sendAmountMyr < 5000 ? 8 : 10;
    const incentive = Math.round(amountState.receiveAmountBdt * 0.025 * 100) / 100;

    const txn = createRemittance({
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.fullName,
      sendAmountMyr: amountState.sendAmountMyr,
      commissionMyr: commission,
      receiveAmountBdt: amountState.receiveAmountBdt,
      incentiveBdt: incentive,
      payoutMethod,
      fundingMethod,
    });

    if (amountState.isRecurring) {
      addRecurringRemittance({
        beneficiaryId: beneficiary.id,
        beneficiaryName: beneficiary.fullName,
        amountMyr: amountState.sendAmountMyr,
        frequency: amountState.frequency,
        startDate: new Date(amountState.startDate).toISOString(),
        endDate: amountState.endMode === "date" ? new Date(amountState.endDate).toISOString() : undefined,
        occurrencesLeft: amountState.endMode === "occurrences" ? amountState.occurrences : undefined,
        nextRunDate: new Date(amountState.startDate).toISOString(),
      });
    }

    setResultTxn(txn);
  };

  const reset = () => {
    setStep(0);
    setAmountState(initialAmountState);
    setResultTxn(null);
  };

  if (resultTxn) {
    return <SuccessStep txn={resultTxn} onSendAnother={reset} />;
  }

  return (
    <div>
      <PageHeader
        title="Send Money"
        description="Transfer earnings from Malaysia to your family in Bangladesh"
        actions={
          <Link to="/send/scheduled" className="flex items-center gap-1.5 text-small font-semibold text-[var(--color-primary)] hover:underline">
            <CalendarClock size={16} /> Scheduled Transfers
          </Link>
        }
      />
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Stepper steps={STEP_LABELS} current={step} />
        </div>
        <Card>
          <CardBody className="sm:p-7">
            <div key={step} className="animate-fade-in">
              {step === 0 && <AmountStep state={amountState} setState={setAmountState} onNext={() => setStep(1)} />}
              {step === 1 && (
                <RecipientStep selectedId={beneficiaryId} onSelect={setBeneficiaryId} onNext={() => setStep(2)} onBack={() => setStep(0)} />
              )}
              {step === 2 && beneficiary && (
                <ConfirmStep
                  amountState={amountState}
                  beneficiary={beneficiary}
                  fundingMethod={fundingMethod}
                  setFundingMethod={setFundingMethod}
                  onBack={() => setStep(1)}
                  onConfirmed={handleConfirmed}
                />
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
