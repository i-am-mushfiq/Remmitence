import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "ghost";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "md", variant = "default", className, children, ...props }, ref) => {
    const sizeClass = { sm: "size-8", md: "size-10", lg: "size-12" }[size];
    const variantClass = {
      default: "bg-slate-100 text-[var(--color-text)] hover:bg-slate-200",
      filled: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
      ghost: "bg-transparent text-[var(--color-text-secondary)] hover:bg-slate-100",
    }[variant];
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded-full transition-colors active:scale-95", sizeClass, variantClass, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
