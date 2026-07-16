import { useState } from "react";
import { Gem } from "lucide-react";
import { useStore } from "../../store/useStore";
import { AppShell } from "./AppShell";
import DashboardPage from "../../features/dashboard/DashboardPage";
import LandingPage from "../../features/landing/LandingPage";
import AppWelcomePage from "../../features/landing/AppWelcomePage";
import { useStandalone } from "../../pwa/useStandalone";
import { SplashScreen } from "../../pwa/SplashScreen";

export function RootRoute() {
  const hasHydrated = useStore((s) => s._hasHydrated);
  const authStage = useStore((s) => s.authStage);
  const isStandalone = useStandalone();
  const [showSplash, setShowSplash] = useState(isStandalone);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="flex size-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--color-primary)] text-white animate-pulse">
          <Gem size={20} />
        </div>
      </div>
    );
  }

  // Installed app (Android TWA / home-screen PWA): brief branded splash,
  // then either the dashboard or a simple Login/Create Account screen —
  // never the full scrollable marketing website.
  if (isStandalone) {
    if (showSplash) {
      return <SplashScreen onDone={() => setShowSplash(false)} />;
    }
    return authStage === "signed_in" ? (
      <AppShell>
        <DashboardPage />
      </AppShell>
    ) : (
      <AppWelcomePage />
    );
  }

  // Regular browser tab: unchanged website experience.
  if (authStage === "signed_in") {
    return (
      <AppShell>
        <DashboardPage />
      </AppShell>
    );
  }

  return <LandingPage />;
}
