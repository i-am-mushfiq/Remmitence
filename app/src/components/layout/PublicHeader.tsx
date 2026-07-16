import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Nest Egg", href: "#nest-egg" },
  { label: "Trust & Security", href: "#trust" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="top" className="sticky top-4 z-40 px-4 sm:px-6">
      <header className="mx-auto flex max-w-6xl items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-5 py-3.5 shadow-[var(--shadow-card)] backdrop-blur">
        <Link to="/" className="flex shrink-0 items-center">
          <Logo height={26} />
        </Link>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-small font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 sm:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" iconRight={<ArrowUpRight size={15} />}>
              Create Account
            </Button>
          </Link>
        </div>

        <button
          className="ml-auto flex size-9 items-center justify-center rounded-full text-[var(--color-text)] sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-6xl animate-slide-up rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lift)] sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-small font-medium text-[var(--color-text)] hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3">
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" fullWidth>
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>
              <Button fullWidth iconRight={<ArrowUpRight size={15} />}>
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
