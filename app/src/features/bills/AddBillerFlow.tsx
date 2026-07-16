import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Drawer } from "../../components/ui/Drawer";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { CATEGORY_META } from "../../lib/billerMeta";
import type { BillCategory } from "../../types";

export function AddBillerFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addBiller = useStore((s) => s.addBiller);
  const { push } = useToast();
  const [stage, setStage] = useState<"form" | "validating" | "done">("form");
  const [category, setCategory] = useState<BillCategory>("electricity");
  const [provider, setProvider] = useState(CATEGORY_META.electricity.providers[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [label, setLabel] = useState("");
  const [resolvedName, setResolvedName] = useState("");

  const reset = () => {
    setStage("form");
    setCategory("electricity");
    setProvider(CATEGORY_META.electricity.providers[0]);
    setAccountNumber("");
    setLabel("");
  };

  const close = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = () => {
    setStage("validating");
    setTimeout(() => {
      setResolvedName("Md. Jashim Uddin (Head of Household)");
      setStage("done");
    }, 1300);
  };

  const handleSave = () => {
    addBiller({
      category,
      providerName: provider,
      accountNumber,
      label: label || `${CATEGORY_META[category].label} Bill`,
      supportsLiveFetch: category === "electricity" || category === "water",
    });
    push({ variant: "success", title: "Biller added", description: `${label || provider} is ready for payment.` });
    close();
  };

  return (
    <Drawer open={open} onClose={close} title="Add a Biller">
      {stage === "form" && (
        <div className="space-y-4">
          <Select
            label="Biller category"
            required
            options={Object.entries(CATEGORY_META).map(([k, v]) => ({ label: v.label, value: k }))}
            value={category}
            onChange={(e) => {
              const cat = e.target.value as BillCategory;
              setCategory(cat);
              setProvider(CATEGORY_META[cat].providers[0]);
            }}
          />
          <Select
            label="Provider"
            required
            options={CATEGORY_META[category].providers.map((p) => ({ label: p, value: p }))}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
          <Input
            label={category === "mobile" ? "Mobile number" : "Account / consumer / meter number"}
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder={category === "mobile" ? "01712-345678" : "e.g., DESCO-771029-4"}
          />
          <Input label="Nickname (optional)" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., Home Electricity" />
          <Button fullWidth disabled={!accountNumber} onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      )}

      {stage === "validating" && (
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
          <p className="mt-4 text-small font-medium text-[var(--color-text)]">Validating account with {provider}&hellip;</p>
        </div>
      )}

      {stage === "done" && (
        <div className="flex flex-col items-center py-6 text-center animate-scale-in">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
            <CheckCircle2 size={28} className="text-[var(--color-accent)]" />
          </div>
          <p className="mt-4 text-h3 text-[var(--color-text)]">Account verified</p>
          <p className="mt-1 text-small text-[var(--color-text-secondary)]">Registered to: {resolvedName}</p>
          <Button fullWidth className="mt-6" onClick={handleSave}>
            Save Biller
          </Button>
        </div>
      )}
    </Drawer>
  );
}
