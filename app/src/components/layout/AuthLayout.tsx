import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export function AuthLayout({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--color-bg)] px-4 py-10 sm:py-14">
      <Link to="/" className="mb-8 flex items-center">
        <Logo height={32} />
      </Link>
      <div className={wide ? "w-full max-w-lg" : "w-full max-w-md"}>{children}</div>
    </div>
  );
}
