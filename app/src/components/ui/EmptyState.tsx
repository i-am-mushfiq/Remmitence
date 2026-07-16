import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-[var(--color-text-secondary)]">{icon}</div>
      <div>
        <p className="text-h3 text-[var(--color-text)]">{title}</p>
        {description && <p className="mt-1 max-w-xs text-small text-[var(--color-text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
