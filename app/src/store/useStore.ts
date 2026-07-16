import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppNotification,
  Beneficiary,
  Biller,
  DpsEnrollment,
  DpsScheme,
  Language,
  NotificationPreferences,
  RecurringRemittance,
  ReturnJourneyState,
  SavingsAccount,
  SupportTicket,
  Transaction,
  User,
  NestEggGoal,
} from "../types";
import {
  CURRENT_FX_RATE,
  defaultNotificationPreferences,
  seedBeneficiaries,
  seedBillers,
  seedDpsEnrollments,
  seedDpsSchemes,
  seedNotifications,
  seedRecurringRemittances,
  seedSavingsAccounts,
  seedTickets,
  seedTransactions,
  seedUser,
  genId,
  genReference,
} from "../lib/mockData";

export type AuthStage = "signed_out" | "onboarding" | "verification_pending" | "signed_in";

interface AppState {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  authStage: AuthStage;
  user: User;
  fxRate: number;
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  recurringRemittances: RecurringRemittance[];
  billers: Biller[];
  savingsAccounts: SavingsAccount[];
  dpsSchemes: DpsScheme[];
  dpsEnrollments: DpsEnrollment[];
  notifications: AppNotification[];
  tickets: SupportTicket[];
  notificationPreferences: NotificationPreferences;
  nestEggGoal: NestEggGoal | null;
  returnJourney: ReturnJourneyState;

  // auth
  signIn: () => void;
  signOut: () => void;
  completeOnboarding: (partial: Partial<User>) => void;
  setVerificationPending: () => void;
  approveVerification: () => void;

  // profile
  updateUser: (partial: Partial<User>) => void;
  setLanguage: (lang: Language) => void;

  // beneficiaries
  addBeneficiary: (b: Omit<Beneficiary, "id" | "createdAt" | "isActive" | "screeningStatus">) => Beneficiary;
  updateBeneficiary: (id: string, partial: Partial<Beneficiary>) => void;
  removeBeneficiary: (id: string) => void;
  setDefaultBeneficiary: (id: string) => void;

  // transactions / send money
  createRemittance: (input: {
    beneficiaryId: string;
    beneficiaryName: string;
    sendAmountMyr: number;
    commissionMyr: number;
    receiveAmountBdt: number;
    incentiveBdt?: number;
    payoutMethod: "bank" | "mfs" | "cash_pickup";
    fundingMethod: "bank_transfer" | "card" | "cash_deposit";
  }) => Transaction;
  cancelTransaction: (id: string) => void;
  addRecurringRemittance: (r: Omit<RecurringRemittance, "id" | "status">) => void;
  pauseRecurringRemittance: (id: string) => void;
  resumeRecurringRemittance: (id: string) => void;
  cancelRecurringRemittance: (id: string) => void;

  // bills
  addBiller: (b: Omit<Biller, "id" | "status">) => Biller;
  payBill: (input: { billerId: string; amountBdt: number; fundingMethod: "bank_transfer" | "card" | "cash_deposit" }) => Transaction;
  setAutoPay: (billerId: string, rule: Biller["autoPay"]) => void;
  removeBiller: (id: string) => void;

  // savings & DPS
  linkSavingsAccount: (acc: Omit<SavingsAccount, "id" | "lastSyncedAt" | "linkedAt">) => void;
  topUpSavings: (accountId: string, amountBdt: number, amountMyr: number) => void;
  enrollDps: (input: { scheme: DpsScheme; nominee: string; autoContributionMyr: number }) => void;
  toggleDpsAutoContribution: (id: string) => void;

  // nest egg
  setNestEggGoal: (goal: NestEggGoal) => void;

  // notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => void;

  // support
  createTicket: (subject: string, message: string, relatedTransactionId?: string) => SupportTicket;
  replyToTicket: (ticketId: string, message: string) => void;

  // return journey
  declareReturn: (departureDate: string) => void;
  setRecurringDecision: (instructionId: string, decision: "stop" | "continue" | "final_payment") => void;
  advanceReturnJourney: (stage: ReturnJourneyState["stage"]) => void;
  resetReturnJourney: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      authStage: "signed_out",
      user: seedUser,
      fxRate: CURRENT_FX_RATE,
      beneficiaries: seedBeneficiaries,
      transactions: seedTransactions,
      recurringRemittances: seedRecurringRemittances,
      billers: seedBillers,
      savingsAccounts: seedSavingsAccounts,
      dpsSchemes: seedDpsSchemes,
      dpsEnrollments: seedDpsEnrollments,
      notifications: seedNotifications,
      tickets: seedTickets,
      notificationPreferences: defaultNotificationPreferences,
      nestEggGoal: {
        targetAmountBdt: 2500000,
        targetDate: new Date(Date.now() + 1461 * 86400000).toISOString(),
        recommendedMonthlyContributionBdt: 8500,
      },
      returnJourney: { stage: "not_started" },

      signIn: () => set({ authStage: "signed_in" }),
      signOut: () => set({ authStage: "signed_out" }),
      completeOnboarding: (partial) =>
        set((s) => ({
          user: { ...s.user, ...partial, kycStatus: "pending" },
          authStage: "verification_pending",
        })),
      setVerificationPending: () => set({ authStage: "verification_pending" }),
      approveVerification: () =>
        set((s) => ({ user: { ...s.user, kycStatus: "verified" }, authStage: "signed_in" })),

      updateUser: (partial) => set((s) => ({ user: { ...s.user, ...partial } })),
      setLanguage: (language) => set((s) => ({ user: { ...s.user, language } })),

      addBeneficiary: (b) => {
        const beneficiary: Beneficiary = {
          ...b,
          id: genId("ben"),
          createdAt: new Date().toISOString(),
          isActive: true,
          screeningStatus: "cleared",
        };
        set((s) => ({ beneficiaries: [beneficiary, ...s.beneficiaries] }));
        return beneficiary;
      },
      updateBeneficiary: (id, partial) =>
        set((s) => ({
          beneficiaries: s.beneficiaries.map((b) => (b.id === id ? { ...b, ...partial } : b)),
        })),
      removeBeneficiary: (id) =>
        set((s) => ({
          beneficiaries: s.beneficiaries.map((b) => (b.id === id ? { ...b, isActive: false } : b)),
        })),
      setDefaultBeneficiary: (id) =>
        set((s) => ({
          beneficiaries: s.beneficiaries.map((b) => ({ ...b, isDefault: b.id === id })),
        })),

      createRemittance: (input) => {
        const txn: Transaction = {
          id: genId("txn"),
          reference: genReference(),
          kind: "remittance",
          status: "processing",
          createdAt: new Date().toISOString(),
          beneficiaryId: input.beneficiaryId,
          beneficiaryName: input.beneficiaryName,
          sendAmountMyr: input.sendAmountMyr,
          fxRate: get().fxRate,
          commissionMyr: input.commissionMyr,
          totalAmountMyr: input.sendAmountMyr + input.commissionMyr,
          receiveAmountBdt: input.receiveAmountBdt,
          incentiveBdt: input.incentiveBdt,
          payoutMethod: input.payoutMethod,
          fundingMethod: input.fundingMethod,
        };
        set((s) => ({
          transactions: [txn, ...s.transactions],
          user: { ...s.user, dailyUsedMyr: s.user.dailyUsedMyr + txn.totalAmountMyr, monthlyUsedMyr: s.user.monthlyUsedMyr + txn.totalAmountMyr },
        }));
        // simulate async payout completion
        setTimeout(() => {
          set((s) => ({
            transactions: s.transactions.map((t) => (t.id === txn.id ? { ...t, status: "completed" } : t)),
          }));
        }, 4500);
        return txn;
      },
      cancelTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t)),
        })),
      addRecurringRemittance: (r) =>
        set((s) => ({
          recurringRemittances: [{ ...r, id: genId("rec"), status: "active" }, ...s.recurringRemittances],
        })),
      pauseRecurringRemittance: (id) =>
        set((s) => ({
          recurringRemittances: s.recurringRemittances.map((r) => (r.id === id ? { ...r, status: "paused" } : r)),
        })),
      resumeRecurringRemittance: (id) =>
        set((s) => ({
          recurringRemittances: s.recurringRemittances.map((r) => (r.id === id ? { ...r, status: "active" } : r)),
        })),
      cancelRecurringRemittance: (id) =>
        set((s) => ({
          recurringRemittances: s.recurringRemittances.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
        })),

      addBiller: (b) => {
        const biller: Biller = { ...b, id: genId("bil"), status: "up_to_date" };
        set((s) => ({ billers: [biller, ...s.billers] }));
        return biller;
      },
      payBill: (input) => {
        const biller = get().billers.find((b) => b.id === input.billerId);
        const fxRate = get().fxRate;
        const commission = Math.max(1, Math.round(input.amountBdt / fxRate * 0.02 * 100) / 100);
        const sendAmountMyr = Math.round((input.amountBdt / fxRate) * 100) / 100;
        const txn: Transaction = {
          id: genId("txn"),
          reference: genReference(),
          kind: "bill",
          status: "processing",
          createdAt: new Date().toISOString(),
          billerName: biller?.label ?? "Biller",
          billerCategory: biller?.category ?? "other",
          sendAmountMyr,
          fxRate,
          commissionMyr: commission,
          totalAmountMyr: sendAmountMyr + commission,
          receiveAmountBdt: input.amountBdt,
          fundingMethod: input.fundingMethod,
        };
        set((s) => ({
          transactions: [txn, ...s.transactions],
          billers: s.billers.map((b) => (b.id === input.billerId ? { ...b, status: "up_to_date" as const } : b)),
        }));
        setTimeout(() => {
          set((s) => ({
            transactions: s.transactions.map((t) => (t.id === txn.id ? { ...t, status: "completed" } : t)),
          }));
        }, 3000);
        return txn;
      },
      setAutoPay: (billerId, rule) =>
        set((s) => ({
          billers: s.billers.map((b) => (b.id === billerId ? { ...b, autoPay: rule } : b)),
        })),
      removeBiller: (id) => set((s) => ({ billers: s.billers.filter((b) => b.id !== id) })),

      linkSavingsAccount: (acc) =>
        set((s) => ({
          savingsAccounts: [
            { ...acc, id: genId("sav"), lastSyncedAt: new Date().toISOString(), linkedAt: new Date().toISOString() },
            ...s.savingsAccounts,
          ],
        })),
      topUpSavings: (accountId, amountBdt, amountMyr) => {
        const fxRate = get().fxRate;
        set((s) => ({
          savingsAccounts: s.savingsAccounts.map((a) =>
            a.id === accountId ? { ...a, balanceBdt: a.balanceBdt + amountBdt, lastSyncedAt: new Date().toISOString() } : a
          ),
          transactions: [
            {
              id: genId("txn"),
              reference: genReference(),
              kind: "savings_topup",
              status: "completed",
              createdAt: new Date().toISOString(),
              beneficiaryName: s.savingsAccounts.find((a) => a.id === accountId)?.partnerBank ?? "Savings",
              sendAmountMyr: amountMyr,
              fxRate,
              commissionMyr: 0,
              totalAmountMyr: amountMyr,
              receiveAmountBdt: amountBdt,
              fundingMethod: "bank_transfer",
            },
            ...s.transactions,
          ],
        }));
      },
      enrollDps: (input) => {
        const startDate = new Date();
        const maturityDate = new Date(startDate.getTime() + input.scheme.tenureYears * 365 * 86400000);
        const enrollment: DpsEnrollment = {
          id: genId("dps"),
          schemeId: input.scheme.id,
          partnerBank: input.scheme.partnerBank,
          schemeName: input.scheme.schemeName,
          tenureYears: input.scheme.tenureYears,
          monthlyInstallmentBdt: input.scheme.monthlyInstallmentBdt,
          indicativeRatePct: input.scheme.indicativeRatePct,
          nominee: input.nominee,
          startDate: startDate.toISOString(),
          maturityDate: maturityDate.toISOString(),
          contributedToDateBdt: 0,
          indicativeMaturityValueBdt: Math.round(
            input.scheme.monthlyInstallmentBdt *
              input.scheme.tenureYears *
              12 *
              (1 + (input.scheme.indicativeRatePct / 100) * (input.scheme.tenureYears / 2))
          ),
          status: "active",
          autoContribution: {
            enabled: true,
            amountMyr: input.autoContributionMyr,
            nextRunDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          },
        };
        set((s) => ({ dpsEnrollments: [enrollment, ...s.dpsEnrollments] }));
      },
      toggleDpsAutoContribution: (id) =>
        set((s) => ({
          dpsEnrollments: s.dpsEnrollments.map((d) =>
            d.id === id ? { ...d, autoContribution: { ...d.autoContribution, enabled: !d.autoContribution.enabled } } : d
          ),
        })),

      setNestEggGoal: (goal) => set({ nestEggGoal: goal }),

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      updateNotificationPreferences: (prefs) => set({ notificationPreferences: prefs }),

      createTicket: (subject, message, relatedTransactionId) => {
        const ticket: SupportTicket = {
          id: genId("tic"),
          reference: `SUP-${Math.floor(10000 + Math.random() * 89999)}`,
          subject,
          status: "open",
          createdAt: new Date().toISOString(),
          relatedTransactionId,
          slaTarget: new Date(Date.now() + 2 * 86400000).toISOString(),
          messages: [{ from: "user", text: message, at: new Date().toISOString() }],
        };
        set((s) => ({ tickets: [ticket, ...s.tickets] }));
        return ticket;
      },
      replyToTicket: (ticketId, message) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId
              ? { ...t, messages: [...t.messages, { from: "user", text: message, at: new Date().toISOString() }] }
              : t
          ),
        })),

      declareReturn: (departureDate) =>
        set({ returnJourney: { stage: "declared", declaredDepartureDate: departureDate, recurringDecisions: {} } }),
      setRecurringDecision: (instructionId, decision) =>
        set((s) => ({
          returnJourney: {
            ...s.returnJourney,
            recurringDecisions: { ...(s.returnJourney.recurringDecisions ?? {}), [instructionId]: decision },
          },
        })),
      advanceReturnJourney: (stage) => set((s) => ({ returnJourney: { ...s.returnJourney, stage } })),
      resetReturnJourney: () => set({ returnJourney: { stage: "not_started" } }),
    }),
    {
      name: "remminext-app-state",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
