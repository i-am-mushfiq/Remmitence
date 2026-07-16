import { Link, useNavigate } from "react-router-dom";
import { Send, Receipt, PiggyBank, Landmark, ChevronRight, CheckCircle2, AlertCircle, Clock3, Info } from "lucide-react";
import { useStore } from "../../store/useStore";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { TransactionRow } from "../../components/shared/TransactionRow";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { Tooltip } from "../../components/ui/Tooltip";
import { formatBdt, formatMyr } from "../../lib/format";
import { combinedSavingsBalance, dpsTotals, billerStatusCounts, totalRemitted } from "../../lib/selectors";

const QUICK_ACTIONS = [
  { label: "Send Money", icon: Send, path: "/send", tone: "primary" as const },
  { label: "Pay Bills", icon: Receipt, path: "/bills", tone: "primary" as const },
  { label: "Savings", icon: PiggyBank, path: "/savings", tone: "accent" as const },
  { label: "DPS", icon: Landmark, path: "/savings?tab=dps", tone: "accent" as const },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const transactions = useStore((s) => s.transactions);
  const savingsAccounts = useStore((s) => s.savingsAccounts);
  const dpsEnrollments = useStore((s) => s.dpsEnrollments);
  const billers = useStore((s) => s.billers);
  const nestEggGoal = useStore((s) => s.nestEggGoal);

  const liquid = combinedSavingsBalance(savingsAccounts);
  const dps = dpsTotals(dpsEnrollments);
  const netWorth = liquid + dps.contributed;
  const billStatus = billerStatusCounts(billers);
  const monthRemitted = totalRemitted(transactions, "month");
  const recent = transactions.slice(0, 5);

  const goalPercent = nestEggGoal ? Math.min(100, Math.round((netWorth / nestEggGoal.targetAmountBdt) * 100)) : 0;
  const firstName = user.fullName.split(" ").slice(0, 2).join(" ");

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-small font-medium text-[var(--color-text-secondary)]">Welcome back,</p>
          <h1 className="text-h1 text-[var(--color-text)]">{firstName}</h1>
        </div>
      </div>

      {/* Balance Summary Card */}
      <Card className="bg-gradient-to-br from-[var(--color-primary)] to-[#003d80] text-white border-0 shadow-[var(--shadow-lift)]">
        <CardBody className="sm:p-6">
          <div className="flex items-center gap-1.5">
            <p className="text-small font-medium text-white/80">Total Net Worth in Bangladesh</p>
            <Tooltip content="Liquid Balance is your withdrawable savings account balance. Total Savings (Incl. DPS) adds your locked, fixed-tenure DPS contributions.">
              <Info size={14} className="text-white/70" />
            </Tooltip>
          </div>
          <p className="mt-1.5 text-3xl font-bold tabular tracking-tight sm:text-4xl">{formatBdt(netWorth)}</p>
          <p className="mt-1 text-tiny font-normal text-white/70">&asymp; {formatMyr(netWorth / 19.8452)} at today's rate</p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
            <div>
              <p className="text-tiny font-medium text-white/70">Liquid Balance</p>
              <p className="mt-0.5 text-h3 tabular font-semibold">{formatBdt(liquid, { compact: true })}</p>
            </div>
            <div>
              <p className="text-tiny font-medium text-white/70">Total Savings (Incl. DPS)</p>
              <p className="mt-0.5 text-h3 tabular font-semibold">{formatBdt(liquid + dps.contributed, { compact: true })}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="group flex flex-col items-center gap-2.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 sm:p-5"
          >
            <div
              className={`flex size-11 items-center justify-center rounded-full transition-colors ${
                a.tone === "primary" ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
              }`}
            >
              <a.icon size={20} />
            </div>
            <span className="text-small font-semibold text-[var(--color-text)]">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* This month remittance */}
          <Card>
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <p className="text-small font-medium text-[var(--color-text-secondary)]">Remitted this month</p>
                <p className="mt-1 text-h2 tabular text-[var(--color-text)]">{formatMyr(monthRemitted.myr)}</p>
                <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{formatBdt(monthRemitted.bdt, { compact: true })} sent to Bangladesh</p>
              </div>
              <Link to="/send" className="shrink-0">
                <Button size="sm" icon={<Send size={15} />}>
                  Send Again
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Recent transactions */}
          <Card>
            <CardHeader>
              <h2 className="text-h3">Recent Activity</h2>
              <Link to="/account/history" className="flex items-center gap-0.5 text-tiny font-semibold text-[var(--color-primary)] hover:underline">
                View All <ChevronRight size={14} />
              </Link>
            </CardHeader>
            <CardBody className="p-2 sm:p-3">
              {recent.length === 0 ? (
                <EmptyState icon={<Send size={22} />} title="No transactions yet" description="Your remittances, bills and savings activity will show up here." />
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {recent.map((t) => (
                    <TransactionRow key={t.id} txn={t} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Nest Egg teaser */}
          <Card>
            <CardBody className="flex items-center gap-4">
              <ProgressRing percent={goalPercent} size={72} strokeWidth={7}>
                <span className="text-small font-bold text-[var(--color-text)]">{goalPercent}%</span>
              </ProgressRing>
              <div className="min-w-0">
                <p className="text-small font-medium text-[var(--color-text-secondary)]">Nest Egg Goal</p>
                <p className="truncate text-small font-semibold text-[var(--color-text)]">
                  {nestEggGoal ? formatBdt(nestEggGoal.targetAmountBdt, { compact: true }) : "Not set"}
                </p>
                <Link to="/nestegg" className="mt-1 inline-block text-tiny font-semibold text-[var(--color-primary)] hover:underline">
                  View Nest Egg &rarr;
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Family Financial Health Snapshot */}
          <Card>
            <CardHeader>
              <h2 className="text-h3">Family Bills Status</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-small text-[var(--color-text-secondary)]">
                  <CheckCircle2 size={16} className="text-[var(--color-accent)]" /> Up to date
                </span>
                <span className="text-small font-semibold text-[var(--color-text)]">{billStatus.up_to_date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-small text-[var(--color-text-secondary)]">
                  <Clock3 size={16} className="text-[var(--color-warning)]" /> Due soon
                </span>
                <span className="text-small font-semibold text-[var(--color-text)]">{billStatus.due_soon}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-small text-[var(--color-text-secondary)]">
                  <AlertCircle size={16} className="text-[var(--color-danger)]" /> Overdue
                </span>
                <span className="text-small font-semibold text-[var(--color-text)]">{billStatus.overdue}</span>
              </div>
              <Link to="/bills" className="mt-1 inline-block text-tiny font-semibold text-[var(--color-primary)] hover:underline">
                Manage bills &rarr;
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
