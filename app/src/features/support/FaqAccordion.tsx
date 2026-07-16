import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export function FaqAccordion({ items }: { items: { question: string; answer: string; category: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {items.map((item, i) => (
        <div key={i}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left sm:px-5">
            <span className="text-small font-medium text-[var(--color-text)]">{item.question}</span>
            <ChevronDown size={16} className={cn("shrink-0 text-[var(--color-text-secondary)] transition-transform", openIdx === i && "rotate-180")} />
          </button>
          {openIdx === i && <p className="animate-slide-up px-4 pb-4 text-small font-normal text-[var(--color-text-secondary)] sm:px-5">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}
