import { ShieldCheck, ArrowLeftRight, Clock, FileWarning, Gem, Megaphone, Lock } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import type { NotificationCategory } from "../../types";

const CATEGORY_META: Record<NotificationCategory, { label: string; description: string; icon: React.ElementType; locked?: boolean }> = {
  security: { label: "Security", description: "OTP codes, new device login, PIN changes", icon: ShieldCheck, locked: true },
  transaction: { label: "Transaction Status", description: "Remittance sent, payout confirmed, bill paid", icon: ArrowLeftRight },
  reminder: { label: "Reminders", description: "Upcoming bills, DPS due, low balance warnings", icon: Clock },
  compliance: { label: "Compliance / KYC", description: "Document expiry, verification requests", icon: FileWarning },
  nestegg: { label: "Nest Egg / Goals", description: "Monthly summary, milestone reached", icon: Gem },
  promotional: { label: "Promotional", description: "New partners, improved rates, referrals", icon: Megaphone },
};

export default function NotificationPreferencesPage() {
  const prefs = useStore((s) => s.notificationPreferences);
  const update = useStore((s) => s.updateNotificationPreferences);
  const { push } = useToast();

  const setChannel = (cat: NotificationCategory, channel: "push" | "sms" | "email", value: boolean) => {
    update({ ...prefs, [cat]: { ...prefs[cat], [channel]: value } });
    push({ variant: "success", title: "Preferences updated" });
  };

  return (
    <div>
      <PageHeader title="Notification Preferences" description="Choose how you'd like to hear from us, per category" back="/account" />

      <div className="space-y-4">
        {(Object.keys(CATEGORY_META) as NotificationCategory[]).map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <Card key={cat}>
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <meta.icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-small font-semibold text-[var(--color-text)]">{meta.label}</p>
                      {meta.locked && (
                        <span className="flex items-center gap-1 text-tiny font-normal text-slate-400">
                          <Lock size={10} /> Always on
                        </span>
                      )}
                    </div>
                    <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{meta.description}</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {(["push", "sms", "email"] as const).map((channel) => (
                        <label key={channel} className="flex items-center gap-2 text-small text-[var(--color-text)]">
                          <Switch
                            size="sm"
                            checked={prefs[cat][channel]}
                            disabled={meta.locked}
                            onChange={(v) => setChannel(cat, channel, v)}
                          />
                          <span className="capitalize">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
