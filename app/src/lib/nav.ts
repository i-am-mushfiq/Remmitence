import { Home, Send, Receipt, PiggyBank, User, Users, Gem, LifeBuoy } from "lucide-react";

export const primaryNavItems = [
  { label: "Home", path: "/", icon: Home, match: "/" },
  { label: "Send", path: "/send", icon: Send, match: "/send" },
  { label: "Bills", path: "/bills", icon: Receipt, match: "/bills" },
  { label: "Savings", path: "/savings", icon: PiggyBank, match: "/savings" },
  { label: "Account", path: "/account", icon: User, match: "/account" },
];

export const sidebarNavItems = [
  { label: "Home", path: "/", icon: Home, match: "/" },
  { label: "Send Money", path: "/send", icon: Send, match: "/send" },
  { label: "Beneficiaries", path: "/beneficiaries", icon: Users, match: "/beneficiaries" },
  { label: "Bills", path: "/bills", icon: Receipt, match: "/bills" },
  { label: "Savings & DPS", path: "/savings", icon: PiggyBank, match: "/savings" },
  { label: "Nest Egg", path: "/nestegg", icon: Gem, match: "/nestegg" },
  { label: "Support", path: "/support", icon: LifeBuoy, match: "/support" },
  { label: "Account", path: "/account", icon: User, match: "/account" },
];
