import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { primaryNavItems, sidebarNavItems } from "../../lib/nav";
import { cn } from "../../lib/cn";
import { useStore } from "../../store/useStore";
import { Avatar } from "../ui/Avatar";
import { Logo } from "../ui/Logo";
import { NotificationPanel } from "./NotificationPanel";
import { AccountMenu } from "./AccountMenu";
import { formatBdt } from "../../lib/format";
import { combinedSavingsBalance, dpsTotals } from "../../lib/selectors";

function isActive(path: string, match: string) {
  if (match === "/") return path === "/";
  return path.startsWith(match);
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const savingsAccounts = useStore((s) => s.savingsAccounts);
  const dpsEnrollments = useStore((s) => s.dpsEnrollments);
  const unreadCount = useStore((s) => s.notifications.filter((n) => !n.read).length);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const nestEgg = combinedSavingsBalance(savingsAccounts) + dpsTotals(dpsEnrollments).contributed;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] md:flex">
        <div className="flex h-16 shrink-0 items-center px-6">
          <Logo height={26} />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {sidebarNavItems.map((item) => {
            const active = isActive(location.pathname, item.match);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-small font-medium transition-colors",
                  active ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:bg-slate-50 hover:text-[var(--color-text)]"
                )}
              >
                <item.icon size={19} strokeWidth={active ? 2.25 : 1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Nest Egg Total</p>
          <p className="mt-1 text-h3 tabular text-[var(--color-text)]">{formatBdt(nestEgg, { compact: true })}</p>
          <Link to="/nestegg" className="mt-2 inline-block text-tiny font-semibold text-[var(--color-primary)] hover:underline">
            View breakdown &rarr;
          </Link>
        </div>
      </aside>

      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 backdrop-blur md:left-64 sm:px-6">
        <button onClick={() => navigate("/")} className="flex items-center md:hidden">
          <Logo height={22} />
        </button>
        <div className="hidden items-baseline gap-2 sm:flex">
          <span className="text-tiny font-normal text-[var(--color-text-secondary)]">Nest Egg</span>
          <span className="text-body font-semibold tabular text-[var(--color-text)]">{formatBdt(nestEgg, { compact: true })}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setMenuOpen(false);
              }}
              aria-label="Notifications"
              className="relative flex size-10 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-slate-100"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 flex size-2 items-center justify-center rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-surface)]" />
              )}
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setMenuOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="Account menu"
              className="rounded-full"
            >
              <Avatar name={user.fullName} size={38} />
            </button>
            {menuOpen && <AccountMenu onClose={() => setMenuOpen(false)} />}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-20 md:pb-8 md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[calc(64px+env(safe-area-inset-bottom))] items-stretch border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] md:hidden">
        {primaryNavItems.map((item) => {
          const active = isActive(location.pathname, item.match);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
            >
              <item.icon size={22} strokeWidth={active ? 2.25 : 1.75} className={active ? "text-[var(--color-primary)]" : "text-slate-400"} />
              <span className={cn("text-tiny", active ? "font-semibold text-[var(--color-primary)]" : "font-normal text-slate-400")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
