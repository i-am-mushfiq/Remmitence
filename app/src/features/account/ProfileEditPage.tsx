import { useState } from "react";
import { Lock, Pencil } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { ChangeContactDrawer } from "./ChangeContactDrawer";

export default function ProfileEditPage() {
  const user = useStore((s) => s.user);
  const updateUser = useStore((s) => s.updateUser);
  const { push } = useToast();

  const [malaysiaLine, setMalaysiaLine] = useState(user.malaysiaAddress.line1);
  const [bangladeshLine, setBangladeshLine] = useState(user.bangladeshAddress.line1);
  const [occupation, setOccupation] = useState(user.occupation);
  const [employer, setEmployer] = useState(user.employer);
  const [changeTarget, setChangeTarget] = useState<"mobile" | "email" | null>(null);

  const saveAddresses = () => {
    updateUser({
      malaysiaAddress: { ...user.malaysiaAddress, line1: malaysiaLine },
      bangladeshAddress: { ...user.bangladeshAddress, line1: bangladeshLine },
    });
    push({ variant: "success", title: "Addresses updated" });
  };

  const saveOccupation = () => {
    updateUser({ occupation, employer });
    push({ variant: "success", title: "Occupation details updated", description: "Subject to re-screening as this is a material change." });
  };

  return (
    <div>
      <PageHeader title="Profile" back="/account" />

      <Card>
        <CardBody className="flex items-center gap-4">
          <Avatar name={user.fullName} size={64} />
          <div>
            <p className="text-h3 text-[var(--color-text)]">{user.fullName}</p>
            <p className="mt-1 flex items-center gap-1.5 text-tiny font-normal text-[var(--color-text-secondary)]">
              <Lock size={11} /> Requires document re-verification to change
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <h2 className="text-h3">Contact Details</h2>
        </CardHeader>
        <CardBody className="divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-small font-medium text-[var(--color-text)]">Mobile number</p>
              <p className="text-small text-[var(--color-text-secondary)]">{user.mobileNumber}</p>
            </div>
            <Button size="sm" variant="secondary" icon={<Pencil size={13} />} onClick={() => setChangeTarget("mobile")}>
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-small font-medium text-[var(--color-text)]">Email address</p>
              <p className="text-small text-[var(--color-text-secondary)]">{user.email}</p>
            </div>
            <Button size="sm" variant="secondary" icon={<Pencil size={13} />} onClick={() => setChangeTarget("email")}>
              Change
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <h2 className="text-h3">Addresses</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Malaysia residential address" value={malaysiaLine} onChange={(e) => setMalaysiaLine(e.target.value)} />
          <Input label="Bangladesh permanent address" value={bangladeshLine} onChange={(e) => setBangladeshLine(e.target.value)} />
          <Button onClick={saveAddresses}>Save Addresses</Button>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <h2 className="text-h3">Occupation & Income</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
          <Input label="Employer" value={employer} onChange={(e) => setEmployer(e.target.value)} />
          <Button onClick={saveOccupation}>Save Changes</Button>
        </CardBody>
      </Card>

      <ChangeContactDrawer target={changeTarget} onClose={() => setChangeTarget(null)} />
    </div>
  );
}
