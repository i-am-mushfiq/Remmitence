import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "../components/ui/Button";

const DISMISS_KEY = "remminext-install-prompt-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as { standalone?: boolean }).standalone === true;
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/**
 * Mounted once at the app root. Shows a native "Install App" banner on
 * Chromium browsers (Android/desktop) via beforeinstallprompt, and a manual
 * "Add to Home Screen" tip on iOS Safari, which never fires that event.
 */
export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosTip, setShowIosTip] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "1");

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIos()) {
      const t = setTimeout(() => setShowIosTip(true), 2500);
      return () => {
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        clearTimeout(t);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [dismissed]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    setDeferredEvent(null);
    setShowIosTip(false);
  };

  if (dismissed || (!deferredEvent && !showIosTip)) return null;

  return (
    <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+8px)] z-100 flex justify-center px-4">
      <div className="flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-modal)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lift)] animate-slide-up">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          {deferredEvent ? <Download size={16} /> : <Share size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-small font-semibold text-[var(--color-text)]">Install RemmiNext</p>
          <p className="mt-0.5 text-tiny font-normal text-[var(--color-text-secondary)]">
            {deferredEvent ? "Add it to your home screen for faster, full-screen access." : 'Tap the Share icon, then "Add to Home Screen".'}
          </p>
          {deferredEvent && (
            <Button
              size="sm"
              className="mt-2.5"
              onClick={async () => {
                await deferredEvent.prompt();
                await deferredEvent.userChoice;
                setDeferredEvent(null);
              }}
            >
              Install
            </Button>
          )}
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 rounded p-0.5 text-[var(--color-text-secondary)] hover:bg-slate-100">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
