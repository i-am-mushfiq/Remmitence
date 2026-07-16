import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";

/**
 * The signed-out entry screen shown when RemmiNext is running as an
 * installed app (Android TWA / home-screen PWA) — a simple, native-feeling
 * welcome screen instead of the full scrollable marketing website, with
 * primary actions pinned to the bottom within thumb's reach.
 */
export default function AppWelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+24px)]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="animate-scale-in">
          <Logo height={44} />
        </div>
        <h1 className="mt-8 text-h1 text-[var(--color-text)]">Send, Pay & Save</h1>
        <p className="mt-3 max-w-xs text-body text-[var(--color-text-secondary)]">
          Remit earnings, pay household bills, and build your Nest Egg back home in Bangladesh — all in one app.
        </p>

        <div className="mt-8 flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-3.5 py-1.5 text-tiny font-semibold text-[var(--color-primary)]">
          <ShieldCheck size={14} />
          BNM-Licensed Money Services Business
        </div>
      </div>

      <div className="w-full space-y-3 pb-2">
        <Link to="/register" className="block">
          <Button fullWidth size="lg">
            Create Account
          </Button>
        </Link>
        <Link to="/login" className="block">
          <Button fullWidth size="lg" variant="secondary">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  );
}
