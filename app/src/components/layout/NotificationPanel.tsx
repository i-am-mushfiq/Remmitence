import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, ShieldCheck, ArrowLeftRight, Clock, FileWarning, Gem, Megaphone, CheckCheck } from "lucide-react";
import { useStore } from "../../store/useStore";
import { timeAgo } from "../../lib/format";
import type { NotificationCategory } from "../../types";
import { EmptyState } from "../ui/EmptyState";

const CATEGORY_ICON: Record<NotificationCategory, React.ElementType> = {
  security: ShieldCheck,
  transaction: ArrowLeftRight,
  reminder: Clock,
  compliance: FileWarning,
  nestegg: Gem,
  promotional: Megaphone,
};

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const markRead = useStore((s) => s.markNotificationRead);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-sm animate-slide-up overflow-hidden rounded-[var(--radius-modal)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <h3 className="text-h3">Notifications</h3>
        <button onClick={markAllRead} className="flex items-center gap-1 text-tiny font-semibold text-[var(--color-primary)] hover:underline">
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sorted.length === 0 ? (
          <EmptyState icon={<BellRing size={22} />} title="No notifications" description="You're all caught up." />
        ) : (
          sorted.map((n) => {
            const Icon = CATEGORY_ICON[n.category];
            return (
              <button
                key={n.id}
                onClick={() => {
                  markRead(n.id);
                  onClose();
                }}
                className="flex w-full items-start gap-3 border-b border-[var(--color-border)] p-4 text-left last:border-0 hover:bg-slate-50"
              >
                <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-slate-100 text-slate-400" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-small ${n.read ? "font-medium text-[var(--color-text-secondary)]" : "font-semibold text-[var(--color-text)]"}`}>{n.title}</p>
                  <p className="mt-0.5 text-tiny font-normal text-[var(--color-text-secondary)] line-clamp-2">{n.body}</p>
                  <p className="mt-1 text-tiny font-normal text-slate-400">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--color-primary)]" />}
              </button>
            );
          })
        )}
      </div>
      <button
        onClick={() => {
          navigate("/account/notifications");
          onClose();
        }}
        className="block w-full border-t border-[var(--color-border)] p-3 text-center text-small font-semibold text-[var(--color-primary)] hover:bg-slate-50"
      >
        Notification settings
      </button>
    </div>
  );
}
