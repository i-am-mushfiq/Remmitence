import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Bottom sheet on mobile, right-side panel on desktop. */
export function Drawer({ open, onClose, title, children }: DrawerProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-90 flex sm:justify-end">
      <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative mt-auto flex max-h-[92vh] w-full flex-col rounded-t-[var(--radius-modal)] bg-[var(--color-surface)] shadow-[var(--shadow-lift)] animate-slide-down-sheet sm:mt-0 sm:h-full sm:max-h-full sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-[var(--radius-modal)] sm:animate-slide-up"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-slate-300 sm:hidden" />
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] p-5">
          {title && <h2 className="text-h3 text-[var(--color-text)]">{title}</h2>}
          <button onClick={onClose} aria-label="Close" className="ml-auto rounded-full p-1.5 text-[var(--color-text-secondary)] hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
