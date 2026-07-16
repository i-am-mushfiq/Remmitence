import { CalendarClock, Pause, Play, X, Send } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatDate, formatMyr, relativeFutureLabel } from "../../lib/format";

export default function RecurringTransfersPage() {
  const recurring = useStore((s) => s.recurringRemittances);
  const pause = useStore((s) => s.pauseRecurringRemittance);
  const resume = useStore((s) => s.resumeRecurringRemittance);
  const cancel = useStore((s) => s.cancelRecurringRemittance);
  const { push } = useToast();

  return (
    <div>
      <PageHeader title="Scheduled Transfers" description="View, pause, or cancel your recurring remittances" back="/send" />

      {recurring.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<CalendarClock size={22} />}
              title="No scheduled transfers"
              description="Set up a recurring transfer from the Send Money flow to automate your monthly remittance."
              action={
                <Button icon={<Send size={16} />} onClick={() => (window.location.href = "/send")}>
                  Send Money
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {recurring.map((r) => (
            <Card key={r.id}>
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-small font-semibold text-[var(--color-text)]">{r.beneficiaryName}</p>
                    <Badge tone={r.status === "active" ? "success" : r.status === "paused" ? "warning" : "neutral"}>{r.status}</Badge>
                  </div>
                  <p className="mt-1 text-small text-[var(--color-text-secondary)]">
                    {formatMyr(r.amountMyr)} &middot; {r.frequency === "monthly" ? "Monthly" : "Weekly"}
                  </p>
                  <p className="text-tiny font-normal text-[var(--color-text-secondary)]">
                    Next run: {relativeFutureLabel(r.nextRunDate)} ({formatDate(r.nextRunDate)})
                    {r.endDate && ` · Ends ${formatDate(r.endDate)}`}
                    {r.occurrencesLeft && ` · ${r.occurrencesLeft} transfers left`}
                  </p>
                </div>
                {r.status !== "cancelled" && (
                  <div className="flex shrink-0 gap-2">
                    {r.status === "active" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Pause size={14} />}
                        onClick={() => {
                          pause(r.id);
                          push({ variant: "info", title: "Transfer paused" });
                        }}
                      >
                        Pause
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Play size={14} />}
                        onClick={() => {
                          resume(r.id);
                          push({ variant: "success", title: "Transfer resumed" });
                        }}
                      >
                        Resume
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<X size={14} />}
                      onClick={() => {
                        cancel(r.id);
                        push({ variant: "info", title: "Recurring transfer cancelled" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
