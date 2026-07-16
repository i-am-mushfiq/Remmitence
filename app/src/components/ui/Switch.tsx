import { cn } from "../../lib/cn";

export function Switch({
  checked,
  onChange,
  disabled,
  label,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md";
}) {
  const track = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const knob = size === "sm" ? "size-3.5" : "size-4.5";
  const translate = size === "sm" ? "translate-x-4" : "translate-x-5";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        track,
        checked ? "bg-[var(--color-primary)]" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 left-0.5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200",
          knob,
          checked && translate
        )}
      />
    </button>
  );
}
