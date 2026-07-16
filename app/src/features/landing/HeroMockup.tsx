import { Send, Receipt, PiggyBank, Landmark, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ProgressRing } from "../../components/ui/ProgressRing";

export function HeroMockup() {
  return (
    <div className="relative mx-auto h-[480px] w-[300px] sm:h-[560px] sm:w-[340px]">
      {/* Decorative blob */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[var(--color-primary-soft)] to-slate-100 sm:size-[500px]" />

      {/* Phone frame */}
      <div className="absolute left-1/2 top-0 h-full w-[260px] -translate-x-1/2 rounded-[2.5rem] border-[6px] border-slate-900 bg-slate-900 shadow-[var(--shadow-lift)] sm:w-[290px]">
        <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-slate-900" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-[var(--color-bg)]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-tiny font-semibold text-[var(--color-text)]">
            <span>9:41</span>
            <span className="tracking-widest">●●●●</span>
          </div>

          {/* Mini balance card */}
          <div className="mx-3 mt-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#003d80] p-3.5 text-white">
            <p className="text-[10px] font-medium text-white/75">Nest Egg Total</p>
            <p className="mt-0.5 text-base font-bold tabular">৳2,08,620</p>
            <div className="mt-2.5 flex justify-between border-t border-white/15 pt-2 text-[9px] font-medium text-white/75">
              <span>Liquid ৳1,84,620</span>
              <span>+ DPS</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mx-3 mt-3 grid grid-cols-4 gap-2">
            {[
              { icon: Send, label: "Send" },
              { icon: Receipt, label: "Bills" },
              { icon: PiggyBank, label: "Save" },
              { icon: Landmark, label: "DPS" },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1 rounded-lg bg-[var(--color-surface)] py-2 shadow-sm">
                <div className="flex size-6 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <a.icon size={12} />
                </div>
                <span className="text-[8px] font-medium text-[var(--color-text-secondary)]">{a.label}</span>
              </div>
            ))}
          </div>

          {/* Mini transaction rows */}
          <div className="mx-3 mt-3 space-y-2">
            {[
              { name: "Shirin Akter", amt: "RM506.00" },
              { name: "DESCO", amt: "RM44.00" },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-2.5 py-2 shadow-sm">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <ArrowUpRight size={11} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-semibold text-[var(--color-text)]">{t.name}</p>
                  <p className="text-[8px] font-normal text-[var(--color-text-secondary)]">Completed</p>
                </div>
                <span className="text-[9px] font-semibold tabular text-[var(--color-text)]">{t.amt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating: Nest Egg goal card */}
      <div className="absolute -right-2 top-10 flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-lift)] sm:-right-6 sm:top-16">
        <ProgressRing percent={8} size={40} strokeWidth={5}>
          <span className="text-[10px] font-bold text-[var(--color-text)]">8%</span>
        </ProgressRing>
        <div>
          <p className="text-[9px] font-medium text-[var(--color-text-secondary)]">Nest Egg Goal</p>
          <p className="text-tiny font-bold text-[var(--color-text)]">৳25,00,000</p>
        </div>
      </div>

      {/* Floating: FX rate pill */}
      <div className="absolute -left-3 top-[100px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[10px] font-semibold text-[var(--color-primary)] shadow-[var(--shadow-lift)] sm:-left-8 sm:top-[130px]">
        1 MYR = 19.8452 BDT
      </div>

      {/* Floating: latest transaction card */}
      <div className="absolute -left-4 bottom-16 w-44 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-lift)] sm:-left-10 sm:bottom-24 sm:w-48">
        <p className="text-[9px] font-semibold text-[var(--color-text)]">Transfer Sent!</p>
        <div className="mt-1.5 flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-[var(--color-accent)]" />
          <div className="min-w-0">
            <p className="truncate text-[9px] font-medium text-[var(--color-text)]">to Shirin Akter</p>
            <p className="text-[8px] font-normal text-[var(--color-text-secondary)]">৳9,922.60 · Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
