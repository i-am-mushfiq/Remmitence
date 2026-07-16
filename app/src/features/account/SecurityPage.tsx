import { useState } from "react";
import { Fingerprint, KeyRound, Smartphone, ShieldAlert } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Switch } from "../../components/ui/Switch";
import { Drawer } from "../../components/ui/Drawer";
import { OTPInput } from "../../components/ui/OTPInput";
import { useToast } from "../../components/ui/Toast";

export default function SecurityPage() {
  const { push } = useToast();
  const [biometric, setBiometric] = useState(true);
  const [changeOpen, setChangeOpen] = useState(false);
  const [stage, setStage] = useState<"verify" | "new" | "confirm">("verify");
  const [newPin, setNewPin] = useState("");
  const [key, setKey] = useState(0);

  const closeDrawer = () => {
    setChangeOpen(false);
    setTimeout(() => {
      setStage("verify");
      setNewPin("");
      setKey((k) => k + 1);
    }, 300);
  };

  return (
    <div>
      <PageHeader title="Security & PIN" back="/account" />

      <Card>
        <CardHeader>
          <h2 className="text-h3">PIN & Biometric</h2>
        </CardHeader>
        <CardBody className="divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <KeyRound size={18} className="text-[var(--color-text-secondary)]" />
              <div>
                <p className="text-small font-medium text-[var(--color-text)]">Change PIN</p>
                <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Last changed 4 months ago</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setChangeOpen(true)}>
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Fingerprint size={18} className="text-[var(--color-text-secondary)]" />
              <div>
                <p className="text-small font-medium text-[var(--color-text)]">Biometric unlock</p>
                <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Use fingerprint or face unlock</p>
              </div>
            </div>
            <Switch checked={biometric} onChange={setBiometric} />
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <h2 className="text-h3">Active Sessions</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] p-3.5">
            <Smartphone size={18} className="text-[var(--color-accent)]" />
            <div className="flex-1">
              <p className="text-small font-medium text-[var(--color-text)]">Samsung Galaxy A14 &middot; Kluang, Johor</p>
              <p className="text-tiny font-normal text-[var(--color-text-secondary)]">This device &middot; Active now</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-[var(--radius-control)] bg-[var(--color-warning-soft)] p-3">
            <ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-tiny font-normal text-amber-700">
              Recovering your account on a new device automatically signs out all other sessions.
            </p>
          </div>
        </CardBody>
      </Card>

      <Drawer open={changeOpen} onClose={closeDrawer} title="Change PIN">
        {stage === "verify" && (
          <div>
            <p className="mb-5 text-small text-[var(--color-text-secondary)]">Enter the OTP sent to your registered mobile number to continue.</p>
            <OTPInput key={key} onComplete={(code) => /^\d{6}$/.test(code) && setStage("new")} />
          </div>
        )}
        {stage === "new" && (
          <div>
            <p className="mb-5 text-small text-[var(--color-text-secondary)]">Set your new 6-digit PIN.</p>
            <OTPInput
              key={key}
              onComplete={(code) => {
                setNewPin(code);
                setStage("confirm");
                setKey((k) => k + 1);
              }}
            />
          </div>
        )}
        {stage === "confirm" && (
          <div>
            <p className="mb-5 text-small text-[var(--color-text-secondary)]">Confirm your new PIN.</p>
            <OTPInput
              key={key}
              onComplete={(code) => {
                if (code === newPin) {
                  push({ variant: "success", title: "PIN changed successfully" });
                  closeDrawer();
                } else {
                  push({ variant: "error", title: "PINs did not match", description: "Please try again." });
                  setStage("new");
                  setKey((k) => k + 1);
                }
              }}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
