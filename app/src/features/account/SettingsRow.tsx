import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsRow({
  icon: Icon,
  label,
  description,
  to,
  onClick,
  danger,
  trailing,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
  trailing?: React.ReactNode;
}) {
  const content = (
    <div className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-slate-50">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${danger ? "bg-[var(--color-danger-soft)] text-[var(--color-danger)]" : "bg-slate-100 text-[var(--color-text-secondary)]"}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-small font-medium ${danger ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>{label}</p>
        {description && <p className="truncate text-tiny font-normal text-[var(--color-text-secondary)]">{description}</p>}
      </div>
      {trailing ? trailing : (to || onClick) && <ChevronRight size={16} className="shrink-0 text-slate-300" />}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="block w-full">
      {content}
    </button>
  );
}
