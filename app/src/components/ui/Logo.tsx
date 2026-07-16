import logoUrl from "../../assets/logo.png";
import { cn } from "../../lib/cn";

export function Logo({ className, height = 28 }: { className?: string; height?: number }) {
  return <img src={logoUrl} alt="RemmiNext" height={height} className={cn("w-auto object-contain", className)} style={{ height }} />;
}
