import { useRef, useState } from "react";
import { cn } from "../../lib/cn";

export function OTPInput({ length = 6, onComplete, error }: { length?: number; onComplete: (code: string) => void; error?: string }) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[idx] = digit;
    setValues(next);
    if (digit && idx < length - 1) refs.current[idx + 1]?.focus();
    if (next.every((v) => v !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setValues(next);
    if (pasted.length === length) onComplete(pasted);
    else refs.current[pasted.length]?.focus();
  };

  return (
    <div>
      <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              "h-13 w-11 sm:w-12 rounded-[var(--radius-control)] border text-center text-h3 font-semibold text-[var(--color-text)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)]",
              error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-tiny text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
