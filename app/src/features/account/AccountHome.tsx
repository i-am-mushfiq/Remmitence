import { useNavigate } from "react-router-dom";
import {
  UserCog,
  ShieldCheck,
  Gauge,
  History,
  Bell,
  Globe,
  FileStack,
  Lock,
  LogOut,
  PlaneTakeoff,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { SettingsRow } from "./SettingsRow";
import { useStore } from "../../store/useStore";
import { formatDate } from "../../lib/format";
import { APP_VERSION } from "../../lib/version";

export default function AccountHome() {
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Account" description="Manage your profile, security and preferences" />

      <Card>
        <CardBody className="flex items-center gap-4">
          <Avatar name={user.fullName} size={56} />
          <div className="min-w-0 flex-1">
            <p className="text-h3 truncate text-[var(--color-text)]">{user.fullName}</p>
            <p className="text-small font-normal text-[var(--color-text-secondary)]">{user.mobileNumber}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge tone={user.kycStatus === "verified" ? "success" : "warning"}>
                <ShieldCheck size={11} /> {user.kycStatus === "verified" ? "Verified" : "Pending"}
              </Badge>
              <span className="text-tiny font-normal text-slate-400">Member since {formatDate(user.memberSince, "long")}</span>
            </div>
          </div>
          <button onClick={() => navigate("/account/profile")} className="shrink-0 rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-slate-100">
            <ChevronRight size={18} />
          </button>
        </CardBody>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="divide-y divide-[var(--color-border)] overflow-hidden">
          <SettingsRow icon={UserCog} label="Profile & Addresses" description="Name, mobile, email, occupation" to="/account/profile" />
          <SettingsRow icon={ShieldCheck} label="Security & PIN" description="Change PIN, biometric unlock" to="/account/security" />
          <SettingsRow icon={Gauge} label="Transaction Limits" description="Daily & monthly limits, risk tier" to="/account/limits" />
          <SettingsRow icon={History} label="Transaction History" description="All remittance, bills & savings activity" to="/account/history" />
        </Card>
        <Card className="divide-y divide-[var(--color-border)] overflow-hidden">
          <SettingsRow icon={Bell} label="Notification Preferences" description="Manage channels per category" to="/account/notifications" />
          <SettingsRow icon={Globe} label="Language" description="বাংলা · English · Bahasa Malaysia" to="/account/language" />
          <SettingsRow icon={FileStack} label="Document Vault" description="NID, passport, work permit status" to="/account/documents" />
          <SettingsRow icon={Lock} label="Privacy & Data" description="Consent preferences, PDPA" to="/account/privacy" />
        </Card>
      </div>

      <Card className="mt-5 divide-y divide-[var(--color-border)] overflow-hidden">
        <SettingsRow icon={PlaneTakeoff} label="I'm Returning to Bangladesh Permanently" description="Start your guided closure & consolidation journey" to="/return-journey" />
        <SettingsRow icon={LogOut} label="Log Out" danger onClick={() => { signOut(); navigate("/login"); }} />
      </Card>

      <p className="mt-5 text-center text-tiny font-normal text-slate-400">RemmiNext v{APP_VERSION}</p>
    </div>
  );
}
