import { useState } from "react";
import { Target, FileDown, Gem, ArrowUpRight, Receipt, PiggyBank, Landmark, TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Pie, PieChart, Cell, Legend } from "recharts";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { SegmentedControl } from "../../components/ui/Tabs";
import { ProgressBar } from "../../components/ui/ProgressRing";
import { Badge } from "../../components/ui/Badge";
import { useStore } from "../../store/useStore";
import { GoalSettingDrawer } from "./GoalSettingDrawer";
import { ReturnReadinessReportModal } from "./ReturnReadinessReportModal";
import { formatBdt, formatMyr } from "../../lib/format";
import {
  combinedSavingsBalance,
  dpsTotals,
  monthlyRemittanceTrend,
  totalBillsPaid,
  totalIncentive,
  totalRemitted,
} from "../../lib/selectors";

const CATEGORY_COLORS: Record<string, string> = {
  electricity: "#0057b3",
  gas: "#00a86b",
  water: "#38bdf8",
  internet: "#f59e0b",
  mobile: "#a855f7",
  other: "#64748b",
};

type Period = "month" | "year" | "life";

export default function NestEggPage() {
  const transactions = useStore((s) => s.transactions);
  const savingsAccounts = useStore((s) => s.savingsAccounts);
  const dpsEnrollments = useStore((s) => s.dpsEnrollments);
  const nestEggGoal = useStore((s) => s.nestEggGoal);
  const fxRate = useStore((s) => s.fxRate);

  const [period, setPeriod] = useState<Period>("life");
  const [goalOpen, setGoalOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const remitted = totalRemitted(transactions, period);
  const incentive = totalIncentive(transactions, period);
  const bills = totalBillsPaid(transactions, period);
  const savings = combinedSavingsBalance(savingsAccounts);
  const dps = dpsTotals(dpsEnrollments);
  const nestEggTotal = savings + dps.contributed;

  const trend = monthlyRemittanceTrend(transactions, 12);
  const pieData = Object.entries(bills.byCategory).map(([cat, amt]) => ({ name: cat, value: amt }));

  const goalPercent = nestEggGoal ? Math.min(100, Math.round((nestEggTotal / nestEggGoal.targetAmountBdt) * 100)) : 0;
  const monthsToGoal = nestEggGoal ? Math.max(0, Math.round((new Date(nestEggGoal.targetDate).getTime() - Date.now()) / (30 * 86400000))) : 0;
  const onTrack = nestEggGoal ? nestEggTotal >= (nestEggGoal.targetAmountBdt * (1 - monthsToGoal / 48)) : true;

  return (
    <div>
      <PageHeader
        title="Nest Egg"
        description="Your single, consolidated view of everything remitted, paid and saved in Bangladesh"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Target size={16} />} onClick={() => setGoalOpen(true)}>
              Set Goal
            </Button>
            <Button icon={<FileDown size={16} />} onClick={() => setReportOpen(true)}>
              Return Readiness Report
            </Button>
          </div>
        }
      />

      <Card className="bg-gradient-to-br from-[var(--color-primary)] to-[#003d80] text-white border-0 shadow-[var(--shadow-lift)]">
        <CardBody className="sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gem size={16} className="text-white/80" />
              <p className="text-small font-medium text-white/80">Nest Egg Total</p>
            </div>
            <SegmentedControl
              value={period}
              onChange={(v) => setPeriod(v as Period)}
              options={[
                { label: "This Month", value: "month" },
                { label: "This Year", value: "year" },
                { label: "Lifetime", value: "life" },
              ]}
            />
          </div>
          <p className="mt-3 text-3xl font-bold tabular tracking-tight sm:text-4xl">{formatBdt(nestEggTotal)}</p>
          <p className="mt-1 text-tiny font-normal text-white/70">&asymp; {formatMyr(nestEggTotal / fxRate)} at today's rate</p>
        </CardBody>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={ArrowUpRight} label="Remitted" value={formatBdt(remitted.bdt, { compact: true })} sub={formatMyr(remitted.myr)} />
        <StatTile icon={Gem} label="Govt. Incentive" value={formatBdt(incentive, { compact: true })} sub="2.5% scheme" tone="accent" />
        <StatTile icon={Receipt} label="Bills Paid" value={formatBdt(bills.total, { compact: true })} sub={`${Object.keys(bills.byCategory).length} categories`} />
        <StatTile icon={PiggyBank} label="Savings + DPS" value={formatBdt(savings + dps.contributed, { compact: true })} sub={`Maturity est. ${formatBdt(dps.maturity, { compact: true })}`} tone="accent" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <h2 className="text-h3">Monthly Remittance Trend</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <RTooltip
                    formatter={(v) => formatBdt(Number(v))}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                  />
                  <Bar dataKey="amount" fill="#0057b3" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-h3">Bill Spend by Category</h2>
          </CardHeader>
          <CardBody>
            {pieData.length === 0 ? (
              <p className="py-12 text-center text-small text-[var(--color-text-secondary)]">No bill payments in this period yet.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? "#64748b"} />
                      ))}
                    </Pie>
                    <RTooltip formatter={(v) => formatBdt(Number(v))} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Goal progress */}
      <Card className="mt-5">
        <CardHeader>
          <h2 className="text-h3">Nest Egg Goal</h2>
          <Badge tone={onTrack ? "success" : "warning"}>
            {onTrack ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {onTrack ? "On track" : "Behind schedule"}
          </Badge>
        </CardHeader>
        <CardBody>
          {nestEggGoal ? (
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-h2 tabular text-[var(--color-text)]">{formatBdt(nestEggTotal, { compact: true })}</p>
                <p className="text-small text-[var(--color-text-secondary)]">of {formatBdt(nestEggGoal.targetAmountBdt, { compact: true })}</p>
              </div>
              <div className="mt-3">
                <ProgressBar percent={goalPercent} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-tiny text-[var(--color-text-secondary)]">
                <span>{goalPercent}% complete &middot; {monthsToGoal} months to target date</span>
                <span>
                  Recommended: <strong className="text-[var(--color-text)]">{formatBdt(nestEggGoal.recommendedMonthlyContributionBdt)}/mo</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <p className="text-small text-[var(--color-text-secondary)]">You haven't set a Nest Egg goal yet.</p>
              <Button icon={<Target size={16} />} onClick={() => setGoalOpen(true)}>
                Set a Goal
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {dpsEnrollments.length > 0 && (
        <Card className="mt-5">
          <CardHeader>
            <h2 className="text-h3">DPS Maturity Tracker</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {dpsEnrollments.map((d) => {
              const monthsLeft = Math.max(0, Math.round((new Date(d.maturityDate).getTime() - Date.now()) / (30 * 86400000)));
              return (
                <div key={d.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] p-3.5">
                  <div className="flex items-center gap-3">
                    <Landmark size={18} className="text-[var(--color-accent)]" />
                    <div>
                      <p className="text-small font-semibold text-[var(--color-text)]">{d.schemeName}</p>
                      <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{d.partnerBank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-small font-semibold text-[var(--color-text)]">{monthsLeft} months left</p>
                    <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Est. {formatBdt(d.indicativeMaturityValueBdt, { compact: true })}</p>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}

      <GoalSettingDrawer open={goalOpen} onClose={() => setGoalOpen(false)} currentTotal={nestEggTotal} />
      <ReturnReadinessReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  tone = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  tone?: "primary" | "accent";
}) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className={`flex size-8 items-center justify-center rounded-full ${tone === "accent" ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
          <Icon size={15} />
        </div>
        <p className="mt-2.5 text-tiny font-medium text-[var(--color-text-secondary)]">{label}</p>
        <p className="text-h3 tabular text-[var(--color-text)]">{value}</p>
        {sub && <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{sub}</p>}
      </CardBody>
    </Card>
  );
}
