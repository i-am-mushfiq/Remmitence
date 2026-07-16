import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Drawer } from "../../components/ui/Drawer";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import type { Beneficiary } from "../../types";

export function EditBeneficiaryDrawer({ beneficiary, onClose }: { beneficiary: Beneficiary | null; onClose: () => void }) {
  const updateBeneficiary = useStore((s) => s.updateBeneficiary);
  const { push } = useToast();
  const [stage, setStage] = useState<"form" | "screening">("form");
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (beneficiary) {
      setFullName(beneficiary.fullName);
      setRelationship(beneficiary.relationship ?? "");
      setAccountNumber(beneficiary.accountNumber ?? "");
      setMobileNumber(beneficiary.mobileNumber ?? "");
      setStage("form");
    }
  }, [beneficiary]);

  if (!beneficiary) return null;

  const handleSave = () => {
    setStage("screening");
    setTimeout(() => {
      updateBeneficiary(beneficiary.id, {
        fullName,
        relationship: relationship || undefined,
        accountNumber: beneficiary.type === "bank" ? accountNumber : beneficiary.accountNumber,
        mobileNumber: beneficiary.type !== "bank" ? mobileNumber : beneficiary.mobileNumber,
      });
      push({ variant: "success", title: "Beneficiary updated", description: "Changes saved after re-screening." });
      onClose();
    }, 1300);
  };

  return (
    <Drawer open={!!beneficiary} onClose={onClose} title="Edit Beneficiary">
      {stage === "form" ? (
        <div className="space-y-4">
          <Input label="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
          {beneficiary.type === "bank" && <Input label="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />}
          {beneficiary.type !== "bank" && <Input label="Mobile number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />}
          <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Editing sensitive details triggers re-screening before changes go active.</p>
          <Button fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
          <p className="mt-4 text-small font-medium text-[var(--color-text)]">Re-screening updated details&hellip;</p>
        </div>
      )}
    </Drawer>
  );
}
