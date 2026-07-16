import { useState } from "react";
import { Landmark, Smartphone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Drawer } from "../../components/ui/Drawer";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import type { BeneficiaryType } from "../../types";

const MFS_PROVIDERS = ["bKash", "Nagad", "Rocket", "Upay"];
const PICKUP_NETWORKS = ["bKash Cash Point Network", "Western Union Agent Network", "MoneyGram Agent Network"];

const TYPE_OPTIONS: { type: BeneficiaryType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: "bank", label: "Bank Account", icon: Landmark, desc: "Direct deposit via BEFTN / RTGS / NPSB" },
  { type: "mfs", label: "Mobile Wallet (MFS)", icon: Smartphone, desc: "bKash, Nagad, Rocket, Upay" },
  { type: "cash_pickup", label: "Cash Pickup", icon: MapPin, desc: "Collect cash at a partner agent location" },
];

export function AddBeneficiaryFlow({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone?: (id: string) => void }) {
  const addBeneficiary = useStore((s) => s.addBeneficiary);
  const { push } = useToast();
  const [stage, setStage] = useState<"type" | "form" | "screening" | "done">("type");
  const [type, setType] = useState<BeneficiaryType | null>(null);
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mfsProvider, setMfsProvider] = useState(MFS_PROVIDERS[0]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [pickupNetwork, setPickupNetwork] = useState(PICKUP_NETWORKS[0]);
  const [pickupRegion, setPickupRegion] = useState("");

  const reset = () => {
    setStage("type");
    setType(null);
    setFullName("");
    setRelationship("");
    setBankName("");
    setBranchName("");
    setRoutingNumber("");
    setAccountNumber("");
    setMobileNumber("");
    setPickupRegion("");
  };

  const close = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const isFormValid =
    !!fullName &&
    (type === "bank"
      ? !!bankName && !!routingNumber && !!accountNumber
      : type === "mfs"
      ? !!mobileNumber
      : type === "cash_pickup"
      ? !!pickupRegion
      : false);

  const handleSubmit = () => {
    if (!type) return;
    setStage("screening");
    setTimeout(() => {
      const b = addBeneficiary({
        type,
        fullName,
        relationship: relationship || undefined,
        bankName: type === "bank" ? bankName : undefined,
        branchName: type === "bank" ? branchName || "Auto-resolved from routing number" : undefined,
        routingNumber: type === "bank" ? routingNumber : undefined,
        accountNumber: type === "bank" ? accountNumber : undefined,
        mfsProvider: type === "mfs" ? mfsProvider : undefined,
        mobileNumber: type === "mfs" ? mobileNumber : undefined,
        pickupNetwork: type === "cash_pickup" ? pickupNetwork : undefined,
        pickupRegion: type === "cash_pickup" ? pickupRegion : undefined,
      });
      setStage("done");
      onDone?.(b.id);
    }, 1600);
  };

  return (
    <Drawer open={open} onClose={close} title={stage === "type" ? "Add Beneficiary" : stage === "form" ? TYPE_OPTIONS.find((t) => t.type === type)?.label : undefined}>
      {stage === "type" && (
        <div className="space-y-3">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                setType(opt.type);
                setStage("form");
              }}
              className="flex w-full items-center gap-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)] p-4 text-left transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]/40"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <opt.icon size={20} />
              </div>
              <div>
                <p className="text-small font-semibold text-[var(--color-text)]">{opt.label}</p>
                <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {stage === "form" && type && (
        <div className="space-y-4">
          <Input label="Beneficiary full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As per their valid ID" />
          <Input label="Relationship (optional)" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="e.g., Spouse, Father, Sister" />

          {type === "bank" && (
            <>
              <Input label="Bank name" required value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., Islami Bank Bangladesh" />
              <Input label="Branch name" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="Auto-resolved from routing number" />
              <Input
                label="Routing number"
                required
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="9 digits"
                hint="We'll validate this against the Bangladesh Bank routing database"
              />
              <Input label="Account number" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </>
          )}

          {type === "mfs" && (
            <>
              <Select label="MFS Provider" required options={MFS_PROVIDERS.map((p) => ({ label: p, value: p }))} value={mfsProvider} onChange={(e) => setMfsProvider(e.target.value)} />
              <Input label="Bangladesh mobile number" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+880 1XXX-XXXXXX" />
            </>
          )}

          {type === "cash_pickup" && (
            <>
              <Select
                label="Pickup network"
                required
                options={PICKUP_NETWORKS.map((p) => ({ label: p, value: p }))}
                value={pickupNetwork}
                onChange={(e) => setPickupNetwork(e.target.value)}
              />
              <Input label="Region / district" required value={pickupRegion} onChange={(e) => setPickupRegion(e.target.value)} placeholder="e.g., Bhola District" />
              <Input label="Beneficiary mobile number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setStage("type")}>
              Back
            </Button>
            <Button fullWidth disabled={!isFormValid} onClick={handleSubmit}>
              Save Beneficiary
            </Button>
          </div>
        </div>
      )}

      {stage === "screening" && (
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
          <p className="mt-4 text-small font-medium text-[var(--color-text)]">Screening beneficiary&hellip;</p>
          <p className="mt-1 text-tiny font-normal text-[var(--color-text-secondary)]">Checking sanctions, PEP and internal watchlists</p>
        </div>
      )}

      {stage === "done" && (
        <div className="flex flex-col items-center py-8 text-center animate-scale-in">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
            <CheckCircle2 size={28} className="text-[var(--color-accent)]" />
          </div>
          <p className="mt-4 text-h3 text-[var(--color-text)]">Beneficiary added</p>
          <p className="mt-1 text-small text-[var(--color-text-secondary)]">{fullName} has cleared screening and is ready to receive funds.</p>
          <Button
            fullWidth
            className="mt-6"
            onClick={() => {
              push({ variant: "success", title: "Beneficiary saved", description: `${fullName} added to your beneficiary list.` });
              close();
            }}
          >
            Done
          </Button>
        </div>
      )}
    </Drawer>
  );
}
