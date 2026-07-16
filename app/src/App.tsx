import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { RootRoute } from "./components/layout/RootRoute";
import { UpdatePrompt } from "./pwa/UpdatePrompt";
import { InstallPrompt } from "./pwa/InstallPrompt";

import LoginPage from "./features/auth/LoginPage";
import RegisterFlow from "./features/auth/RegisterFlow";
import ForgotPinPage from "./features/auth/ForgotPinPage";
import RecoverAccountPage from "./features/auth/RecoverAccountPage";

import BeneficiariesPage from "./features/beneficiaries/BeneficiariesPage";
import SendMoneyFlow from "./features/send/SendMoneyFlow";
import RecurringTransfersPage from "./features/send/RecurringTransfersPage";
import BillsPage from "./features/bills/BillsPage";
import SavingsPage from "./features/savings/SavingsPage";
import NestEggPage from "./features/nestegg/NestEggPage";
import SupportPage from "./features/support/SupportPage";
import ReturnJourneyFlow from "./features/returnJourney/ReturnJourneyFlow";
import TransactionDetailPage from "./features/shared/TransactionDetailPage";

import AccountHome from "./features/account/AccountHome";
import ProfileEditPage from "./features/account/ProfileEditPage";
import SecurityPage from "./features/account/SecurityPage";
import LimitsPage from "./features/account/LimitsPage";
import TransactionHistoryPage from "./features/account/TransactionHistoryPage";
import NotificationPreferencesPage from "./features/account/NotificationPreferencesPage";
import LanguagePage from "./features/account/LanguagePage";
import DocumentVaultPage from "./features/account/DocumentVaultPage";
import PrivacyPage from "./features/account/PrivacyPage";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterFlow />} />
          <Route path="/forgot-pin" element={<ForgotPinPage />} />
          <Route path="/recover" element={<RecoverAccountPage />} />

          <Route path="/" element={<RootRoute />} />
          <Route path="/beneficiaries" element={<ProtectedRoute><BeneficiariesPage /></ProtectedRoute>} />
          <Route path="/send" element={<ProtectedRoute><SendMoneyFlow /></ProtectedRoute>} />
          <Route path="/send/scheduled" element={<ProtectedRoute><RecurringTransfersPage /></ProtectedRoute>} />
          <Route path="/bills" element={<ProtectedRoute><BillsPage /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><SavingsPage /></ProtectedRoute>} />
          <Route path="/nestegg" element={<ProtectedRoute><NestEggPage /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
          <Route path="/return-journey" element={<ProtectedRoute><ReturnJourneyFlow /></ProtectedRoute>} />
          <Route path="/transactions/:id" element={<ProtectedRoute><TransactionDetailPage /></ProtectedRoute>} />

          <Route path="/account" element={<ProtectedRoute><AccountHome /></ProtectedRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
          <Route path="/account/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
          <Route path="/account/limits" element={<ProtectedRoute><LimitsPage /></ProtectedRoute>} />
          <Route path="/account/history" element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />
          <Route path="/account/notifications" element={<ProtectedRoute><NotificationPreferencesPage /></ProtectedRoute>} />
          <Route path="/account/language" element={<ProtectedRoute><LanguagePage /></ProtectedRoute>} />
          <Route path="/account/documents" element={<ProtectedRoute><DocumentVaultPage /></ProtectedRoute>} />
          <Route path="/account/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
          <Route path="/account/settings" element={<Navigate to="/account" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <InstallPrompt />
        <UpdatePrompt />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
