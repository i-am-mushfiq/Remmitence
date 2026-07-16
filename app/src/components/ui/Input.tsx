import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface FieldWrapProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  id: string;
}

function FieldWrap({ label, hint, error, required, className, children, id }: FieldWrapProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-small font-medium text-[var(--color-text)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-tiny text-[var(--color-danger)]">{error}</p>
      ) : hint ? (
        <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, required, className, leftIcon, rightElement, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrap label={label} hint={hint} error={error} required={required} id={fieldId}>
        <div className="relative">
          {leftIcon && <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">{leftIcon}</div>}
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              "h-11 w-full rounded-[var(--radius-control)] border bg-[var(--color-surface)] px-3.5 text-body text-[var(--color-text)] placeholder:text-slate-400",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)]",
              error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              props.disabled && "bg-slate-50 text-slate-400 cursor-not-allowed",
              className
            )}
            {...props}
          />
          {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
        </div>
      </FieldWrap>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, required, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrap label={label} hint={hint} error={error} required={required} id={fieldId}>
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            "w-full rounded-[var(--radius-control)] border bg-[var(--color-surface)] px-3.5 py-2.5 text-body text-[var(--color-text)] placeholder:text-slate-400",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] resize-none",
            error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
            className
          )}
          {...props}
        />
      </FieldWrap>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, required, className, options, placeholder, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrap label={label} hint={hint} error={error} required={required} id={fieldId}>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            className={cn(
              "h-11 w-full appearance-none rounded-[var(--radius-control)] border bg-[var(--color-surface)] pl-3.5 pr-9 text-body text-[var(--color-text)]",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)]",
              error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </FieldWrap>
    );
  }
);
Select.displayName = "Select";
