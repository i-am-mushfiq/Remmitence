import { useMemo, useState } from "react";
import { Landmark, ChevronRight, ChevronLeft } from "lucide-react";
import { Drawer } from "../../components/ui/Drawer";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { StepUpAuthModal } from "../../components/shared/StepUpAuthModal";
import { SuccessOverlay } from "../../components/ui/SuccessOverlay";
import { useStore } from "../../store/useStore";
import { formatBdt, formatFxRate, formatMyr } from "../../lib/format";
import type { DpsScheme } from "../../types";

export function DpsEnrollFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const schemes = useStore((s) => s.dpsSchemes);
  const fxRate = useStore((s) => s.fxRate);
  const enrollDps = useStore((s) => s.enrollDps);
  const allBeneficiaries = useStore((s) => s.beneficiaries);
  const beneficiaries = allBeneficiaries.filter((b) => b.isActive);

  const [bankFilter, setBankFilter] = useState("all");
  const [selected, setSelected] = useState<DpsScheme | null>(null);
  const [nominee, setNominee] = useState(beneficiaries[0]?.fullName ?? "");
  const [otpOpen, setOtpOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const banks = useMemo(() => Array.from(new Set(schemes.map((s) => s.partnerBank))), [schemes]);
  const filtered = schemes.filter((s) => bankFilter === "all" || s.partnerBank === bankFilter);

  const autoContributionMyr = selected ? Math.round((selected.monthlyInstallmentBdt / fxRate) * 1.02 * 100) / 100 : 0;

  const close = () => {
    onClose();
    setTimeout(() => {
      setSelected(null);
      setSuccess(false);
    }, 300);
  };

  const handleEnroll = () => {
    if (!selected) return;
    enrollDps({ scheme: selected, nominee, autoContributionMyr });
    setOtpOpen(false);
    setSuccess(true);
  };

  return (
    <>
      <Drawer open={open && !success} onClose={close} title={selected ? "Enrol in DPS Scheme" : "DPS Product Catalogue"}>
        {!selected ? (
          <div>
            <Select
              label="Filter by partner bank"
              options={[{ label: "All banks", value: "all" }, ...banks.map((b) => ({ label: b, value: b }))]}
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
            />
            <div className="mt-4 space-y-3">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="flex w-full items-center gap-3.5 rounded-[var(--radius-control)] border border-[var(--color-border)] p-4 text-left transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]/40"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Landmark size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-semibold text-[var(--color-text)]">{s.schemeName}</p>
                    <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{s.partnerBank}</p>
                    <p className="mt-1 text-tiny font-medium text-[var(--color-text)]">
                      {formatBdt(s.monthlyInstallmentBdt, { compact: true })}/mo &middot; {s.tenureYears}yr &middot; {s.indicativeRatePct}% indicative
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-[var(--color-text-secondary)]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => setSelected(null)} className="mb-4 flex items-center gap-1 text-tiny font-semibold text-[var(--color-primary)] hover:underline">
              <ChevronLeft size={14} /> Back to catalogue
            </button>

            <div className="rounded-[var(--radius-control)] bg-slate-50 p-4">
              <p className="text-small font-semibold text-[var(--color-text)]">{selected.schemeName}</p>
              <p className="text-tiny font-normal text-[var(--color-text-secondary)]">{selected.partnerBank}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-tiny">
                <div>
                  <p className="text-[var(--color-text-secondary)]">Tenure</p>
                  <p className="font-semibold text-[var(--color-text)]">{selected.tenureYears} years</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)]">Monthly instalment</p>
                  <p className="font-semibold text-[var(--color-text)]">{formatBdt(selected.monthlyInstallmentBdt)}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)]">Indicative rate</p>
                  <p className="font-semibold text-[var(--color-text)]">{selected.indicativeRatePct}% p.a.</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)]">Min. eligibility</p>
                  <p className="font-semibold text-[var(--color-text)]">{selected.minEligibility}</p>
                </div>
              </div>
              <p className="mt-3 text-tiny font-normal italic text-[var(--color-text-secondary)]">Indicative maturity value, not guaranteed and subject to partner bank terms.</p>
            </div>

            <div className="mt-5 space-y-4">
              <Select
                label="Nominee"
                required
                options={beneficiaries.map((b) => ({ label: `${b.fullName}${b.relationship ? ` (${b.relationship})` : ""}`, value: b.fullName }))}
                value={nominee}
                onChange={(e) => setNominee(e.target.value)}
                hint="Required by Bangladeshi banking regulation"
              />

              <div className="rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
                <p className="text-small font-semibold text-[var(--color-text)]">Recurring auto-contribution</p>
                <div className="mt-2 flex justify-between text-tiny">
                  <span className="text-[var(--color-text-secondary)]">Monthly debit (with FX buffer)</span>
                  <span className="tabular font-semibold text-[var(--color-text)]">{formatMyr(autoContributionMyr)}</span>
                </div>
                <div className="mt-1 flex justify-between text-tiny">
                  <span className="text-[var(--color-text-secondary)]">At current rate</span>
                  <span className="tabular font-semibold text-[var(--color-text)]">1 MYR = {formatFxRate(fxRate)} BDT</span>
                </div>
              </div>

              <Button fullWidth disabled={!nominee} onClick={() => setOtpOpen(true)}>
                Submit Enrolment
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <StepUpAuthModal open={otpOpen} onClose={() => setOtpOpen(false)} onVerified={handleEnroll} />

      <SuccessOverlay open={success} title="DPS Enrolment Submitted!" description={selected ? `Your ${selected.schemeName} application was sent to ${selected.partnerBank}.` : ""}>
        <Button fullWidth onClick={close}>
          Done
        </Button>
      </SuccessOverlay>
    </>
  );
}
