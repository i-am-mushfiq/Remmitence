import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  hideClose?: boolean;
}

export function Modal({ open, onClose, title, description, children, size = "md", hideClose }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" }[size];

  return createPortal(
    <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full animate-scale-in rounded-[var(--radius-modal)] bg-[var(--color-surface)] shadow-[var(--shadow-lift)] max-h-[88vh] overflow-y-auto",
          sizeClass
        )}
      >
        {(title || !hideClose) && (
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 rounded-t-[var(--radius-modal)] border-b border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div>
              {title && <h2 className="text-h3 text-[var(--color-text)]">{title}</h2>}
              {description && <p className="mt-1 text-small text-[var(--color-text-secondary)]">{description}</p>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 rounded-full p-1.5 text-[var(--color-text-secondary)] hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
