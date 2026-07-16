import { useState } from "react";
import { Landmark, Loader2, CheckCircle2 } from "lucide-react";
import { Drawer } from "../../components/ui/Drawer";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SegmentedControl } from "../../components/ui/Tabs";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";

const PARTNER_BANKS = ["Islami Bank Bangladesh", "Dutch-Bangla Bank", "BRAC Bank", "Sonali Bank", "Agrani Bank"];
const ACCOUNT_TYPES = ["Mudaraba Savings", "Regular Savings", "Special Notice Deposit"];

export function LinkSavingsFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const linkSavingsAccount = useStore((s) => s.linkSavingsAccount);
  const { push } = useToast();
  const [mode, setMode] = useState<"link" | "open">("link");
  const [bank, setBank] = useState(PARTNER_BANKS[0]);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [stage, setStage] = useState<"form" | "verifying" | "done">("form");

  const close = () => {
    onClose();
    setTimeout(() => {
      setStage("form");
      setAccountNumber("");
    }, 300);
  };

  const handleSubmit = () => {
    setStage("verifying");
    setTimeout(() => setStage("done"), 1500);
  };

  const handleFinish = () => {
    linkSavingsAccount({
      partnerBank: bank,
      accountNumber: accountNumber || `${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`,
      accountType,
      balanceBdt: mode === "open" ? 0 : Math.floor(20000 + Math.random() * 80000),
    });
    push({ variant: "success", title: mode === "link" ? "Savings account linked" : "Account opened", description: `${bank} ${accountType} is now active.` });
    close();
  };

  return (
    <Drawer open={open} onClose={close} title="Link or Open Savings Account">
      {stage === "form" && (
        <div className="space-y-5">
          <SegmentedControl
            value={mode}
            onChange={(v) => setMode(v as "link" | "open")}
            options={[
              { label: "Link Existing", value: "link" },
              { label: "Open New", value: "open" },
            ]}
          />
          <Select label="Partner bank" required options={PARTNER_BANKS.map((b) => ({ label: b, value: b }))} value={bank} onChange={(e) => setBank(e.target.value)} />
          <Select label="Account type" required options={ACCOUNT_TYPES.map((t) => ({ label: t, value: t }))} value={accountType} onChange={(e) => setAccountType(e.target.value)} />
          {mode === "link" ? (
            <Input label="Existing account number" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} hint="We'll verify ownership via micro-deposit or name match with the partner bank." />
          ) : (
            <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
              We'll pre-fill your application using your verified KYC data and submit it to {bank} via API.
            </p>
          )}
          <Button fullWidth disabled={mode === "link" && !accountNumber} onClick={handleSubmit}>
            {mode === "link" ? "Verify & Link" : "Submit Application"}
          </Button>
        </div>
      )}
      {stage === "verifying" && (
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
          <p className="mt-4 text-small font-medium text-[var(--color-text)]">{mode === "link" ? "Verifying account ownership" : "Submitting to partner bank"}&hellip;</p>
        </div>
      )}
      {stage === "done" && (
        <div className="flex flex-col items-center py-6 text-center animate-scale-in">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
            <CheckCircle2 size={28} className="text-[var(--color-accent)]" />
          </div>
          <p className="mt-4 text-h3 text-[var(--color-text)]">{mode === "link" ? "Account linked" : "Account opened"}</p>
          <p className="mt-1 text-small text-[var(--color-text-secondary)]">
            <Landmark size={13} className="inline -mt-0.5" /> {bank} confirmed your {accountType.toLowerCase()}.
          </p>
          <Button fullWidth className="mt-6" onClick={handleFinish}>
            Done
          </Button>
        </div>
      )}
    </Drawer>
  );
}
