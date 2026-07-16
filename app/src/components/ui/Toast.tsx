import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/cn";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastContextValue {
  push: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={20} className="text-[var(--color-accent)]" />,
  error: <XCircle size={20} className="text-[var(--color-danger)]" />,
  warning: <AlertTriangle size={20} className="text-[var(--color-warning)]" />,
  info: <Info size={20} className="text-[var(--color-primary)]" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-100 flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+84px)] sm:pb-6 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-lift)]"
            )}
          >
            <div className="mt-0.5 shrink-0">{ICONS[t.variant]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-small font-medium text-[var(--color-text)]">{t.title}</p>
              {t.description && <p className="text-tiny font-normal text-[var(--color-text-secondary)] mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 text-[var(--color-text-secondary)] hover:bg-slate-100"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
