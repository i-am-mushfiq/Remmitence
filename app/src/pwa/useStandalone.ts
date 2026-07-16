import { useEffect, useState } from "react";

/**
 * True when the app is running installed (Android TWA / "Add to Home
 * Screen" PWA), as opposed to a regular browser tab. Used to swap the
 * marketing website for a native-feeling app entry flow — the website
 * itself is untouched for regular browser visitors.
 */
export function useStandalone(): boolean {
  const [standalone, setStandalone] = useState(() => detectStandalone());

  useEffect(() => {
    const mql = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setStandalone(detectStandalone());
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return standalone;
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const isDisplayModeStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  const isTwa = document.referrer.startsWith("android-app://");
  return isDisplayModeStandalone || isIosStandalone || isTwa;
}
