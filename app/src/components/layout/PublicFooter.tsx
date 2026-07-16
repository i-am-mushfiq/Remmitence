import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Send Money", href: "#features" },
      { label: "Bill Payments", href: "#features" },
      { label: "Savings & DPS", href: "#features" },
      { label: "Nest Egg Dashboard", href: "#nest-egg" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Trust & Security", href: "#trust" },
      { label: "Support Centre", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "AML/CTF Policy", href: "#" },
      { label: "Regulatory Disclosures", href: "#" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo height={28} />
            <p className="mt-4 max-w-[220px] text-small font-normal text-[var(--color-text-secondary)]">
              The single, unified platform for the Malaysia → Bangladesh remittance corridor.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-small font-semibold text-[var(--color-text)]">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-small font-normal text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-tiny font-normal text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} RemmiNext Sdn. Bhd. All rights reserved.</p>
          <p>Operating under Bank Negara Malaysia Money Services Business licence conditions.</p>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center">
        <Link to="/login" className="text-tiny font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          Customer / Staff Sign In
        </Link>
      </div>
    </footer>
  );
}
