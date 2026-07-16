import { useState } from "react";
import { Camera, CheckCircle2, RotateCcw, Loader2, IdCard } from "lucide-react";
import { cn } from "../../lib/cn";

export function CaptureCard({
  label,
  hint,
  aspect = "wide",
  onCaptured,
  icon,
}: {
  label: string;
  hint?: string;
  aspect?: "wide" | "square";
  onCaptured?: () => void;
  icon?: React.ReactNode;
}) {
  const [state, setState] = useState<"idle" | "capturing" | "done">("idle");

  const capture = () => {
    setState("capturing");
    setTimeout(() => {
      setState("done");
      onCaptured?.();
    }, 1100);
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-[var(--radius-control)] border-2 border-dashed p-6 text-center transition-colors",
          aspect === "wide" ? "aspect-video" : "aspect-square max-w-56 mx-auto",
          state === "done" ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]" : "border-slate-300 bg-slate-50"
        )}
      >
        {state === "idle" && (
          <>
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-[var(--color-text-secondary)] shadow-sm">
              {icon ?? <IdCard size={22} />}
            </div>
            <p className="text-small font-medium text-[var(--color-text)]">{label}</p>
            {hint && <p className="mt-1 max-w-xs text-tiny font-normal text-[var(--color-text-secondary)]">{hint}</p>}
            <button
              onClick={capture}
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-[var(--color-primary)] px-4 py-2 text-small font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              <Camera size={16} /> Capture
            </button>
          </>
        )}
        {state === "capturing" && (
          <>
            <Loader2 size={28} className="animate-spin text-[var(--color-primary)]" />
            <p className="mt-3 text-small font-medium text-[var(--color-text-secondary)]">Processing image&hellip;</p>
          </>
        )}
        {state === "done" && (
          <>
            <CheckCircle2 size={32} className="text-[var(--color-accent)]" />
            <p className="mt-2 text-small font-semibold text-[var(--color-text)]">{label} captured</p>
            <button
              onClick={capture}
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 text-tiny font-semibold text-[var(--color-primary)] hover:underline"
            >
              <RotateCcw size={13} /> Retake
            </button>
          </>
        )}
      </div>
    </div>
  );
}
