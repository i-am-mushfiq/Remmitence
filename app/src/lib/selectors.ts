import type { Biller, DpsEnrollment, SavingsAccount, Transaction } from "../types";

export function isWithinDays(iso: string, days: number): boolean {
  return Date.now() - new Date(iso).getTime() <= days * 86400000;
}

export function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function isThisYear(iso: string): boolean {
  return new Date(iso).getFullYear() === new Date().getFullYear();
}

export function totalRemitted(transactions: Transaction[], period: "month" | "year" | "life" = "life") {
  return transactions
    .filter((t) => t.kind === "remittance" && t.status === "completed")
    .filter((t) => (period === "month" ? isThisMonth(t.createdAt) : period === "year" ? isThisYear(t.createdAt) : true))
    .reduce(
      (acc, t) => ({ bdt: acc.bdt + t.receiveAmountBdt, myr: acc.myr + t.sendAmountMyr }),
      { bdt: 0, myr: 0 }
    );
}

export function totalIncentive(transactions: Transaction[], period: "month" | "year" | "life" = "life") {
  return transactions
    .filter((t) => t.kind === "remittance" && t.status === "completed" && t.incentiveBdt)
    .filter((t) => (period === "month" ? isThisMonth(t.createdAt) : period === "year" ? isThisYear(t.createdAt) : true))
    .reduce((acc, t) => acc + (t.incentiveBdt ?? 0), 0);
}

export function totalBillsPaid(transactions: Transaction[], period: "month" | "year" | "life" = "life") {
  const filtered = transactions
    .filter((t) => t.kind === "bill" && t.status === "completed")
    .filter((t) => (period === "month" ? isThisMonth(t.createdAt) : period === "year" ? isThisYear(t.createdAt) : true));
  const total = filtered.reduce((acc, t) => acc + t.receiveAmountBdt, 0);
  const byCategory: Record<string, number> = {};
  filtered.forEach((t) => {
    const cat = t.billerCategory ?? "other";
    byCategory[cat] = (byCategory[cat] ?? 0) + t.receiveAmountBdt;
  });
  return { total, byCategory };
}

export function combinedSavingsBalance(accounts: SavingsAccount[]): number {
  return accounts.reduce((acc, a) => acc + a.balanceBdt, 0);
}

export function dpsTotals(enrollments: DpsEnrollment[]) {
  return enrollments.reduce(
    (acc, d) => ({
      contributed: acc.contributed + d.contributedToDateBdt,
      maturity: acc.maturity + d.indicativeMaturityValueBdt,
    }),
    { contributed: 0, maturity: 0 }
  );
}

export function nestEggTotal(accounts: SavingsAccount[], enrollments: DpsEnrollment[]): number {
  return combinedSavingsBalance(accounts) + dpsTotals(enrollments).contributed;
}

export function monthlyRemittanceTrend(transactions: Transaction[], months = 12) {
  const buckets: { label: string; amount: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-GB", { month: "short" });
    const amount = transactions
      .filter((t) => t.kind === "remittance" && t.status === "completed")
      .filter((t) => {
        const td = new Date(t.createdAt);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      })
      .reduce((acc, t) => acc + t.receiveAmountBdt, 0);
    buckets.push({ label, amount });
  }
  return buckets;
}

export function billerStatusCounts(billers: Biller[]) {
  return billers.reduce(
    (acc, b) => {
      acc[b.status]++;
      return acc;
    },
    { up_to_date: 0, due_soon: 0, overdue: 0 } as Record<Biller["status"], number>
  );
}
