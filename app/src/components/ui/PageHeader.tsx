import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "./IconButton";

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: boolean | string;
  actions?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {back && (
          <IconButton
            size="md"
            className="mt-0.5"
            aria-label="Go back"
            onClick={() => (typeof back === "string" ? navigate(back) : navigate(-1))}
          >
            <ChevronLeft size={20} />
          </IconButton>
        )}
        <div>
          <h1 className="text-h1 text-[var(--color-text)]">{title}</h1>
          {description && <p className="mt-1 text-body text-[var(--color-text-secondary)]">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
