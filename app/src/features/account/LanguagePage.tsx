import { Check } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { cn } from "../../lib/cn";
import type { Language } from "../../types";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "en", label: "English", native: "English" },
  { code: "ms", label: "Bahasa Malaysia", native: "Bahasa Malaysia" },
];

export default function LanguagePage() {
  const language = useStore((s) => s.user.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const { push } = useToast();

  return (
    <div>
      <PageHeader title="Language" description="Choose your preferred app language" back="/account" />
      <Card className="divide-y divide-[var(--color-border)] overflow-hidden">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => {
              setLanguage(l.code);
              push({ variant: "success", title: `Language set to ${l.label}` });
            }}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50"
          >
            <div>
              <p className="text-small font-semibold text-[var(--color-text)]">{l.native}</p>
              <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{l.label}</p>
            </div>
            <div className={cn("flex size-6 items-center justify-center rounded-full", language === l.code ? "bg-[var(--color-primary)] text-white" : "border-2 border-slate-200")}>
              {language === l.code && <Check size={14} />}
            </div>
          </button>
        ))}
      </Card>
      <p className="mt-3 text-tiny font-normal text-[var(--color-text-secondary)]">
        This prototype's interface remains in English; a language switch would translate labels and content across the entire app in production.
      </p>
    </div>
  );
}
