export function formatBdt(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    return `৳${formatIndianGrouping(Math.round(amount))}`;
  }
  return `৳${formatIndianGrouping(amount, 2)}`;
}

export function formatMyr(amount: number): string {
  return `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Bangladeshi lakh/crore-style digit grouping (last 3 digits, then groups of 2).
export function formatIndianGrouping(amount: number, decimals = 0): string {
  const negative = amount < 0;
  const fixed = Math.abs(amount).toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  let result = "";
  const len = intPart.length;
  if (len <= 3) {
    result = intPart;
  } else {
    const last3 = intPart.slice(len - 3);
    const rest = intPart.slice(0, len - 3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    result = `${grouped},${last3}`;
  }
  return (negative ? "-" : "") + result + (decPart ? `.${decPart}` : "");
}

export function formatFxRate(rate: number): string {
  return rate.toFixed(4);
}

export function formatDate(iso: string, style: "short" | "long" | "day" = "short"): string {
  const d = new Date(iso);
  if (style === "long") {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  }
  if (style === "day") {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function relativeFutureLabel(iso: string): string {
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return formatDate(iso);
  if (diffDays < 30) return `In ${diffDays} days`;
  return formatDate(iso);
}
