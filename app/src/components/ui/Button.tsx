import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)] disabled:bg-slate-300",
  accent:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-hover)] disabled:bg-slate-300",
  secondary:
    "bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] disabled:border-slate-300 disabled:text-slate-400",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-slate-100 disabled:text-slate-300",
  danger:
    "bg-[var(--color-danger)] text-white hover:bg-red-600 disabled:bg-slate-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-small gap-1.5 rounded-[var(--radius-control)]",
  md: "h-11 px-5 text-body gap-2 rounded-[var(--radius-control)]",
  lg: "h-13 px-6 text-body font-semibold gap-2 rounded-[var(--radius-control)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, icon, iconRight, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 select-none",
          "disabled:cursor-not-allowed",
          "active:scale-[0.98] transition-transform",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? <Loader2 size={size === "sm" ? 15 : 18} className="animate-spin" /> : icon}
        {children}
        {!loading && iconRight}
      </button>
    );
  }
);
Button.displayName = "Button";
