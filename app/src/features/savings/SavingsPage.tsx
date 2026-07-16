import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Landmark, Plus, PiggyBank, RefreshCcw } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { Card, CardBody } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { Switch } from "../../components/ui/Switch";
import { useStore } from "../../store/useStore";
import { LinkSavingsFlow } from "./LinkSavingsFlow";
import { TopUpSavingsDrawer } from "./TopUpSavingsDrawer";
import { DpsEnrollFlow } from "./DpsEnrollFlow";
import { formatBdt, formatDate, formatMyr, timeAgo } from "../../lib/format";
import type { SavingsAccount } from "../../types";

export default function SavingsPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "dps" ? "dps" : "savings");
  useEffect(() => {
    if (searchParams.get("tab") === "dps") setTab("dps");
  }, [searchParams]);

  const savingsAccounts = useStore((s) => s.savingsAccounts);
  const dpsEnrollments = useStore((s) => s.dpsEnrollments);
  const toggleDpsAutoContribution = useStore((s) => s.toggleDpsAutoContribution);
  const fxRate = useStore((s) => s.fxRate);

  const [linkOpen, setLinkOpen] = useState(false);
  const [topUpTarget, setTopUpTarget] = useState<SavingsAccount | null>(null);
  const [dpsOpen, setDpsOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Savings & DPS"
        description="Grow your nest egg with a Bangladeshi partner bank savings account and DPS"
        actions={
          tab === "savings" ? (
            <Button icon={<Plus size={16} />} onClick={() => setLinkOpen(true)}>
              Link / Open Account
            </Button>
          ) : (
            <Button icon={<Plus size={16} />} onClick={() => setDpsOpen(true)}>
              Browse DPS Schemes
            </Button>
          )
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { label: "My Savings", value: "savings", count: savingsAccounts.length },
          { label: "DPS", value: "dps", count: dpsEnrollments.length },
        ]}
      />

      {tab === "savings" ? (
        <div className="mt-5 space-y-3">
          {savingsAccounts.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon={<PiggyBank size={22} />}
                  title="No savings account yet"
                  description="Link an existing Bangladeshi savings account or open a new one with a partner bank."
                  action={
                    <Button icon={<Plus size={16} />} onClick={() => setLinkOpen(true)}>
                      Link / Open Account
                    </Button>
                  }
                />
              </CardBody>
            </Card>
          ) : (
            savingsAccounts.map((acc) => (
              <Card key={acc.id}>
                <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="text-small font-semibold text-[var(--color-text)]">{acc.partnerBank}</p>
                      <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
                        {acc.accountType} &middot; •••• {acc.accountNumber.slice(-4)}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-tiny font-normal text-slate-400">
                        <RefreshCcw size={11} /> Synced {timeAgo(acc.lastSyncedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                    <div className="text-right">
                      <p className="text-h3 tabular text-[var(--color-text)]">{formatBdt(acc.balanceBdt)}</p>
                      <p className="text-tiny font-normal text-[var(--color-text-secondary)]">&asymp; {formatMyr(acc.balanceBdt / fxRate)}</p>
                    </div>
                    <Button size="sm" onClick={() => setTopUpTarget(acc)}>
                      Top Up
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {dpsEnrollments.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon={<Landmark size={22} />}
                  title="No DPS enrolments yet"
                  description="Browse partner bank Deposit Pension Schemes and start building a fixed-tenure savings corpus."
                  action={
                    <Button icon={<Plus size={16} />} onClick={() => setDpsOpen(true)}>
                      Browse DPS Schemes
                    </Button>
                  }
                />
              </CardBody>
            </Card>
          ) : (
            dpsEnrollments.map((d) => {
              const percent = Math.min(100, Math.round((d.contributedToDateBdt / (d.monthlyInstallmentBdt * d.tenureYears * 12)) * 100));
              return (
                <Card key={d.id}>
                  <CardBody>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <ProgressRing percent={percent} size={76} strokeWidth={7}>
                        <span className="text-small font-bold text-[var(--color-text)]">{percent}%</span>
                      </ProgressRing>
                      <div className="min-w-0 flex-1">
                        <p className="text-small font-semibold text-[var(--color-text)]">{d.schemeName}</p>
                        <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
                          {d.partnerBank} &middot; {d.tenureYears}yr &middot; matures {formatDate(d.maturityDate, "long")}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-3 text-tiny">
                          <div>
                            <p className="text-[var(--color-text-secondary)]">Contributed to date</p>
                            <p className="font-semibold tabular text-[var(--color-text)]">{formatBdt(d.contributedToDateBdt)}</p>
                          </div>
                          <div>
                            <p className="text-[var(--color-text-secondary)]">Indicative maturity value</p>
                            <p className="font-semibold tabular text-[var(--color-accent)]">{formatBdt(d.indicativeMaturityValueBdt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5 rounded-[var(--radius-control)] bg-slate-50 p-3 sm:flex-col sm:items-end">
                        <span className="text-tiny font-medium text-[var(--color-text-secondary)]">Auto-contribution</span>
                        <Switch checked={d.autoContribution.enabled} onChange={() => toggleDpsAutoContribution(d.id)} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      )}

      <LinkSavingsFlow open={linkOpen} onClose={() => setLinkOpen(false)} />
      <TopUpSavingsDrawer account={topUpTarget} onClose={() => setTopUpTarget(null)} />
      <DpsEnrollFlow open={dpsOpen} onClose={() => setDpsOpen(false)} />
    </div>
  );
}
