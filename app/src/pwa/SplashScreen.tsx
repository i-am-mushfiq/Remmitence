import { useEffect, useState } from "react";
import { Logo } from "../components/ui/Logo";

/**
 * Branded full-screen splash shown briefly on cold launch when running as
 * an installed app (Android TWA / home-screen PWA). Never shown in a
 * regular browser tab.
 */
export function SplashScreen({ onDone, minDurationMs = 900 }: { onDone: () => void; minDurationMs?: number }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), minDurationMs);
    const doneTimer = setTimeout(onDone, minDurationMs + 250);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [minDurationMs, onDone]);

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[var(--color-bg)] transition-opacity duration-250 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-scale-in">
        <Logo height={40} />
      </div>
      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-[var(--color-primary)]"
            style={{ animation: `pulse-dot 1.1s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
