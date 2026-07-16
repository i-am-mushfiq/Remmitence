import { Gem } from "lucide-react";
import { useStore } from "../../store/useStore";
import { AppShell } from "./AppShell";
import DashboardPage from "../../features/dashboard/DashboardPage";
import LandingPage from "../../features/landing/LandingPage";

export function RootRoute() {
  const hasHydrated = useStore((s) => s._hasHydrated);
  const authStage = useStore((s) => s.authStage);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="flex size-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--color-primary)] text-white animate-pulse">
          <Gem size={20} />
        </div>
      </div>
    );
  }

  if (authStage === "signed_in") {
    return (
      <AppShell>
        <DashboardPage />
      </AppShell>
    );
  }

  return <LandingPage />;
}
