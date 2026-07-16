import { useState } from "react";
import { IdCard, Briefcase, Camera, CheckCircle2, Upload, AlertTriangle } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { CaptureCard } from "../../components/ui/CaptureCard";
import { Drawer } from "../../components/ui/Drawer";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatDate } from "../../lib/format";

export default function DocumentVaultPage() {
  const user = useStore((s) => s.user);
  const { push } = useToast();
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const daysToExpiry = Math.round((new Date(user.workPermitExpiry).getTime() - Date.now()) / 86400000);

  const docs = [
    { id: "nid", label: "Bangladeshi NID", icon: IdCard, value: user.nidNumber, status: "verified" as const },
    {
      id: "permit",
      label: "Malaysian Work Permit",
      icon: Briefcase,
      value: user.workPermitNumber,
      status: (daysToExpiry < 30 ? "expiring" : "verified") as "verified" | "expiring",
      note: `Expires ${formatDate(user.workPermitExpiry, "long")} (${daysToExpiry} days)`,
    },
    { id: "selfie", label: "Selfie / Liveliness", icon: Camera, value: "On file", status: "verified" as const },
  ];

  return (
    <div>
      <PageHeader title="Document Vault" description="All identity documents on file and their verification status" back="/account" />

      <div className="space-y-3">
        {docs.map((doc) => (
          <Card key={doc.id}>
            <CardBody className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <doc.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-small font-semibold text-[var(--color-text)]">{doc.label}</p>
                  {doc.status === "verified" ? (
                    <Badge tone="success">
                      <CheckCircle2 size={11} /> Verified
                    </Badge>
                  ) : (
                    <Badge tone="warning">
                      <AlertTriangle size={11} /> Expiring soon
                    </Badge>
                  )}
                </div>
                <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{doc.value}</p>
                {"note" in doc && doc.note && <p className="text-tiny font-normal text-amber-600">{doc.note}</p>}
              </div>
              <Button size="sm" variant="secondary" icon={<Upload size={14} />} onClick={() => setUploadTarget(doc.label)}>
                Upload New
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Drawer open={!!uploadTarget} onClose={() => setUploadTarget(null)} title={`Update ${uploadTarget}`}>
        <p className="mb-5 text-small text-[var(--color-text-secondary)]">Uploading a new version will trigger a re-verification workflow before it replaces your current document.</p>
        <CaptureCard
          label={uploadTarget ?? "Document"}
          onCaptured={() => {
            push({ variant: "success", title: "Document submitted", description: "Sent for re-verification. This usually takes under a minute." });
            setUploadTarget(null);
          }}
        />
      </Drawer>
    </div>
  );
}
