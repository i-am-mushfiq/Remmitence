import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X, WifiOff } from "lucide-react";
import { Button } from "../components/ui/Button";

/**
 * Mounted once at the app root. Surfaces two states from the generated
 * service worker: a new version is ready to activate, or the app has just
 * become available offline for the first time.
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh && !offlineReady) return null;

  const dismiss = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-100 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-modal)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lift)] animate-slide-up">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          {needRefresh ? <RefreshCw size={16} /> : <WifiOff size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-small font-semibold text-[var(--color-text)]">
            {needRefresh ? "Update available" : "Ready to work offline"}
          </p>
          <p className="mt-0.5 text-tiny font-normal text-[var(--color-text-secondary)]">
            {needRefresh ? "A new version of RemmiNext has been downloaded." : "RemmiNext is now cached on this device."}
          </p>
          {needRefresh && (
            <Button size="sm" className="mt-2.5" onClick={() => updateServiceWorker(true)}>
              Reload to update
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
