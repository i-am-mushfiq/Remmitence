import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2 } from "lucide-react";

export function SuccessOverlay({
  open,
  title,
  description,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[var(--color-bg)] px-6 animate-fade-in overflow-y-auto py-10">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-[var(--color-accent-soft)] animate-scale-in">
          <CheckCircle2 size={56} className="text-[var(--color-accent)]" strokeWidth={1.5} />
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-1.5 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--color-accent)" : "var(--color-primary)",
                left: `${10 + i * 8}%`,
                top: "-10px",
                animation: `confetti-fall 1.1s ease-in ${i * 0.06}s both`,
              }}
            />
          ))}
        </div>
        <h1 className="text-h1 text-[var(--color-text)]">{title}</h1>
        {description && <p className="mt-2 text-body text-[var(--color-text-secondary)]">{description}</p>}
        <div className="mt-8 w-full space-y-3">{children}</div>
      </div>
    </div>,
    document.body
  );
}
