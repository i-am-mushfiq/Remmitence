import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center w-full" aria-label="Progress">
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-tiny font-semibold transition-colors",
                  state === "done" && "bg-[var(--color-accent)] text-white",
                  state === "active" && "bg-[var(--color-primary)] text-white",
                  state === "upcoming" && "bg-slate-100 text-slate-400"
                )}
              >
                {state === "done" ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden sm:block text-tiny whitespace-nowrap",
                  state === "upcoming" ? "text-slate-400" : "text-[var(--color-text)] font-medium"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1 rounded transition-colors", i < current ? "bg-[var(--color-accent)]" : "bg-slate-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
