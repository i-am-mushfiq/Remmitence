import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Globe, LogOut, LifeBuoy } from "lucide-react";
import { useStore } from "../../store/useStore";
import { Avatar } from "../ui/Avatar";

export function AccountMenu({ onClose }: { onClose: () => void }) {
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  const items = [
    { label: "My Profile", icon: User, path: "/account" },
    { label: "Language", icon: Globe, path: "/account/language" },
    { label: "Support & Help", icon: LifeBuoy, path: "/support" },
    { label: "Settings", icon: Settings, path: "/account/settings" },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-64 animate-slide-up overflow-hidden rounded-[var(--radius-modal)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-4">
        <Avatar name={user.fullName} size={40} />
        <div className="min-w-0">
          <p className="truncate text-small font-semibold text-[var(--color-text)]">{user.fullName}</p>
          <p className="truncate text-tiny font-normal text-[var(--color-text-secondary)]">{user.mobileNumber}</p>
        </div>
      </div>
      <div className="py-1.5">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-small text-[var(--color-text)] hover:bg-slate-50"
          >
            <item.icon size={17} className="text-[var(--color-text-secondary)]" />
            {item.label}
          </button>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] py-1.5">
        <button
          onClick={() => {
            signOut();
            navigate("/login");
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-small font-medium text-[var(--color-danger)] hover:bg-red-50"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </div>
    </div>
  );
}
