// Core domain types for the RemmiNext customer app prototype.

export type Language = "bn" | "en" | "ms";

export type KycStatus = "unverified" | "pending" | "verified" | "rejected";

export interface User {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  profilePhotoUrl?: string;
  malaysiaAddress: Address;
  bangladeshAddress: Address;
  occupation: string;
  employer: string;
  incomeBand: string;
  nidNumber: string;
  passportNumber?: string;
  workPermitNumber: string;
  workPermitExpiry: string; // ISO date
  kycStatus: KycStatus;
  riskTier: "standard" | "elevated" | "high";
  language: Language;
  memberSince: string; // ISO date
  dailyLimitMyr: number;
  monthlyLimitMyr: number;
  dailyUsedMyr: number;
  monthlyUsedMyr: number;
}

export interface Address {
  line1: string;
  division?: string;
  district?: string;
  upazila?: string;
  postalCode?: string;
  country: string;
}

export type BeneficiaryType = "bank" | "mfs" | "cash_pickup";

export interface Beneficiary {
  id: string;
  type: BeneficiaryType;
  fullName: string;
  relationship?: string;
  isDefault?: boolean;
  isActive: boolean;
  screeningStatus: "cleared" | "pending";
  createdAt: string;
  // bank
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  accountNumber?: string;
  // mfs
  mfsProvider?: string;
  mobileNumber?: string;
  // cash pickup
  pickupNetwork?: string;
  pickupRegion?: string;
}

export type TransactionKind = "remittance" | "bill" | "savings_topup" | "dps_contribution";

export type TransactionStatus =
  | "initiated"
  | "funds_received"
  | "compliance_review"
  | "processing"
  | "completed"
  | "on_hold"
  | "failed"
  | "cancelled"
  | "refunded";

export interface Transaction {
  id: string;
  reference: string;
  kind: TransactionKind;
  status: TransactionStatus;
  createdAt: string;
  beneficiaryId?: string;
  beneficiaryName?: string;
  billerName?: string;
  billerCategory?: BillCategory;
  sendAmountMyr: number;
  fxRate: number;
  commissionMyr: number;
  totalAmountMyr: number;
  receiveAmountBdt: number;
  incentiveBdt?: number;
  payoutMethod?: "bank" | "mfs" | "cash_pickup";
  fundingMethod?: "bank_transfer" | "card" | "cash_deposit";
  notes?: string;
}

export type BillCategory = "electricity" | "gas" | "water" | "internet" | "mobile" | "other";

export interface Biller {
  id: string;
  category: BillCategory;
  providerName: string;
  accountNumber: string;
  label: string;
  lastBillAmountBdt?: number;
  lastBillDueDate?: string;
  supportsLiveFetch: boolean;
  autoPay?: AutoPayRule;
  status: "up_to_date" | "due_soon" | "overdue";
}

export interface AutoPayRule {
  enabled: boolean;
  mode: "fixed" | "fetched_capped";
  fixedAmountBdt?: number;
  capAmountBdt?: number;
  paymentDay: number;
  consecutiveFailures: number;
  paused: boolean;
}

export interface RecurringRemittance {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  amountMyr: number;
  frequency: "weekly" | "monthly";
  startDate: string;
  endDate?: string;
  occurrencesLeft?: number;
  nextRunDate: string;
  status: "active" | "paused" | "completed" | "cancelled";
}

export interface SavingsAccount {
  id: string;
  partnerBank: string;
  accountNumber: string;
  accountType: string;
  balanceBdt: number;
  lastSyncedAt: string;
  linkedAt: string;
}

export interface DpsScheme {
  id: string;
  partnerBank: string;
  schemeName: string;
  tenureYears: number;
  monthlyInstallmentBdt: number;
  indicativeRatePct: number;
  minEligibility: string;
}

export interface DpsEnrollment {
  id: string;
  schemeId: string;
  partnerBank: string;
  schemeName: string;
  tenureYears: number;
  monthlyInstallmentBdt: number;
  indicativeRatePct: number;
  nominee: string;
  startDate: string;
  maturityDate: string;
  contributedToDateBdt: number;
  indicativeMaturityValueBdt: number;
  status: "active" | "matured_pending" | "matured_paid";
  autoContribution: {
    enabled: boolean;
    amountMyr: number;
    nextRunDate: string;
  };
}

export type NotificationCategory =
  | "security"
  | "transaction"
  | "reminder"
  | "compliance"
  | "nestegg"
  | "promotional";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  reference: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  relatedTransactionId?: string;
  slaTarget: string;
  messages: { from: "user" | "support"; text: string; at: string }[];
}

export interface NestEggGoal {
  targetAmountBdt: number;
  targetDate: string;
  recommendedMonthlyContributionBdt: number;
}

export interface NotificationPreferences {
  security: { push: boolean; sms: boolean; email: boolean };
  transaction: { push: boolean; sms: boolean; email: boolean };
  reminder: { push: boolean; sms: boolean; email: boolean };
  compliance: { push: boolean; sms: boolean; email: boolean };
  nestegg: { push: boolean; sms: boolean; email: boolean };
  promotional: { push: boolean; sms: boolean; email: boolean };
}

export type ReturnJourneyStage =
  | "not_started"
  | "declared"
  | "settling"
  | "report_ready"
  | "closed";

export interface ReturnJourneyState {
  stage: ReturnJourneyStage;
  declaredDepartureDate?: string;
  recurringDecisions?: Record<string, "stop" | "continue" | "final_payment">;
}
