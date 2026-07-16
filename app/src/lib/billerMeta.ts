import { Zap, Flame, Droplet, Wifi, Smartphone, Receipt } from "lucide-react";
import type { BillCategory } from "../types";

export const CATEGORY_META: Record<BillCategory, { label: string; icon: React.ElementType; providers: string[] }> = {
  electricity: { label: "Electricity", icon: Zap, providers: ["DESCO", "DPDC", "NESCO", "WZPDCL", "Palli Bidyut Samity (PBS)"] },
  gas: { label: "Gas", icon: Flame, providers: ["Titas Gas", "Karnaphuli Gas Distribution", "Jalalabad Gas", "Bakhrabad Gas"] },
  water: { label: "Water", icon: Droplet, providers: ["Dhaka WASA", "Chattogram WASA"] },
  internet: { label: "Internet / ISP", icon: Wifi, providers: ["Link3 Broadband", "Amber IT", "Carnival Internet", "BDCOM Online"] },
  mobile: { label: "Mobile Top-up", icon: Smartphone, providers: ["Grameenphone", "Robi", "Banglalink", "Teletalk"] },
  other: { label: "Other Household Utility", icon: Receipt, providers: ["Waste Collection", "Building Maintenance Fee"] },
};
