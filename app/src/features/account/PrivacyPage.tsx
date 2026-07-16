import { useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";

const CONSENTS = [
  { id: "kyc", label: "KYC & Screening Data Sharing", description: "Required to verify your identity and screen against sanctions/PEP lists", locked: true },
  { id: "partners", label: "Payout & Biller Partner Data Sharing", description: "Share necessary transaction data with Bangladeshi payout partners and billers", locked: true },
  { id: "marketing", label: "Marketing Communications", description: "Receive product updates and offers based on your usage patterns" },
  { id: "analytics", label: "Product Analytics", description: "Help us improve RemmiNext by sharing anonymised usage data" },
];

export default function PrivacyPage() {
  const { push } = useToast();
  const [consents, setConsents] = useState<Record<string, boolean>>({ kyc: true, partners: true, marketing: false, analytics: true });

  return (
    <div>
      <PageHeader title="Privacy & Data" description="Manage your consent preferences under Malaysia's PDPA" back="/account" />

      <Card>
        <CardHeader>
          <h2 className="text-h3">Consent Preferences</h2>
        </CardHeader>
        <CardBody className="divide-y divide-[var(--color-border)]">
          {CONSENTS.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="text-small font-medium text-[var(--color-text)]">{c.label}</p>
                <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{c.description}</p>
              </div>
              <Switch
                checked={consents[c.id]}
                disabled={c.locked}
                onChange={(v) => {
                  setConsents((prev) => ({ ...prev, [c.id]: v }));
                  push({ variant: "success", title: "Consent preference updated" });
                }}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
          <div>
            <p className="text-small font-medium text-[var(--color-text)]">Your data, protected</p>
            <p className="mt-1 text-tiny font-normal text-[var(--color-text-secondary)]">
              All data in transit is encrypted (TLS 1.2+) and sensitive data at rest uses AES-256 encryption, in line with Malaysian PDPA and Bangladeshi data handling requirements.
            </p>
            <a href="#" onClick={(e) => e.preventDefault()} className="mt-2 inline-flex items-center gap-1 text-tiny font-semibold text-[var(--color-primary)] hover:underline">
              Read full Privacy Policy <ExternalLink size={11} />
            </a>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
