export const GOVERNMENT_INCENTIVE_RATE = 0.025;

export function calcCommission(sendAmountMyr: number): number {
  if (sendAmountMyr <= 0) return 0;
  if (sendAmountMyr < 200) return 5;
  if (sendAmountMyr < 1000) return 6;
  if (sendAmountMyr < 5000) return 8;
  return 10;
}

export function estimatedPayoutTime(payoutMethod: "bank" | "mfs" | "cash_pickup"): string {
  switch (payoutMethod) {
    case "mfs":
      return "Within minutes";
    case "bank":
      return "Within 1–2 hours";
    case "cash_pickup":
      return "Ready for pickup in 30 minutes";
  }
}

export function calcIncentive(receiveAmountBdt: number, eligible = true): number {
  if (!eligible) return 0;
  return Math.round(receiveAmountBdt * GOVERNMENT_INCENTIVE_RATE * 100) / 100;
}
