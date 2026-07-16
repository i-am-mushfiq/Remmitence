import { useParams, useNavigate } from "react-router-dom";
import { Download, MessageSquareWarning, XCircle, ArrowUpRight, Receipt as ReceiptIcon, PiggyBank, Landmark } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";
import { formatBdt, formatDateTime, formatFxRate, formatMyr } from "../../lib/format";
import type { Transaction } from "../../types";

const KIND_ICON: Record<Transaction["kind"], React.ElementType> = {
  remittance: ArrowUpRight,
  bill: ReceiptIcon,
  savings_topup: PiggyBank,
  dps_contribution: Landmark,
};

const KIND_LABEL: Record<Transaction["kind"], string> = {
  remittance: "Remittance",
  bill: "Bill Payment",
  savings_topup: "Savings Top-up",
  dps_contribution: "DPS Contribution",
};

const STATUS_FLOW: Transaction["status"][] = ["initiated", "funds_received", "processing", "completed"];

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const txn = useStore((s) => s.transactions.find((t) => t.id === id));
  const cancelTransaction = useStore((s) => s.cancelTransaction);
  const createTicket = useStore((s) => s.createTicket);
  const { push } = useToast();

  if (!txn) {
    return (
      <div>
        <PageHeader title="Transaction not found" back="/" />
        <Card>
          <CardBody>This transaction reference could not be found.</CardBody>
        </Card>
      </div>
    );
  }

  const Icon = KIND_ICON[txn.kind];
  const title = txn.kind === "remittance" ? txn.beneficiaryName : txn.kind === "bill" ? txn.billerName : txn.beneficiaryName;
  const canCancel = txn.status === "initiated" || txn.status === "funds_received";
  const currentStepIdx = STATUS_FLOW.indexOf(txn.status);

  return (
    <div>
      <PageHeader title="Transaction Details" back />

      <Card>
        <CardBody className="flex flex-col items-center py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Icon size={24} />
          </div>
          <p className="mt-3 text-h2 tabular text-[var(--color-text)]">{formatMyr(txn.totalAmountMyr)}</p>
          <p className="text-small font-normal text-[var(--color-text-secondary)]">{KIND_LABEL[txn.kind]} to {title}</p>
          <div className="mt-3">
            <StatusBadge status={txn.status} />
          </div>
        </CardBody>
      </Card>

      {["failed", "cancelled", "refunded"].indexOf(txn.status) === -1 && (
        <Card className="mt-4">
          <CardBody>
            <p className="mb-4 text-small font-semibold text-[var(--color-text)]">Status Timeline</p>
            <div className="flex items-center">
              {STATUS_FLOW.map((s, i) => (
                <div key={s} className="flex flex-1 items-center last:flex-none">
                  <div className={`size-3 shrink-0 rounded-full ${i <= currentStepIdx ? "bg-[var(--color-accent)]" : "bg-slate-200"}`} />
                  {i < STATUS_FLOW.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${i < currentStepIdx ? "bg-[var(--color-accent)]" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-tiny font-normal text-[var(--color-text-secondary)]">
              <span>Initiated</span>
              <span>Funded</span>
              <span>Processing</span>
              <span>Completed</span>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="mt-4">
        <CardBody className="divide-y divide-[var(--color-border)]">
          <DetailRow label="Reference" value={txn.reference} />
          <DetailRow label="Date & time" value={formatDateTime(txn.createdAt)} />
          <DetailRow label="Send amount" value={formatMyr(txn.sendAmountMyr)} />
          <DetailRow label="Exchange rate" value={`1 MYR = ${formatFxRate(txn.fxRate)} BDT`} />
          <DetailRow label="Commission" value={formatMyr(txn.commissionMyr)} />
          <DetailRow label="Total debited" value={formatMyr(txn.totalAmountMyr)} strong />
          <DetailRow label="Recipient received" value={formatBdt(txn.receiveAmountBdt)} strong />
          {txn.incentiveBdt && <DetailRow label="Govt. incentive" value={formatBdt(txn.incentiveBdt)} />}
          {txn.payoutMethod && <DetailRow label="Payout method" value={txn.payoutMethod.replace("_", " ")} />}
          {txn.fundingMethod && <DetailRow label="Funding method" value={txn.fundingMethod.replace("_", " ")} />}
          {txn.notes && <DetailRow label="Notes" value={txn.notes} />}
        </CardBody>
      </Card>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          icon={<Download size={16} />}
          onClick={() => push({ variant: "success", title: "Receipt downloaded", description: `${txn.reference}.pdf saved.` })}
        >
          Download Receipt
        </Button>
        <Button
          variant="ghost"
          icon={<MessageSquareWarning size={16} />}
          onClick={() => {
            createTicket(`Issue with transaction ${txn.reference}`, `I'd like to report an issue with transaction ${txn.reference}.`, txn.id);
            push({ variant: "success", title: "Support case created", description: "Our team will follow up shortly." });
            navigate("/support");
          }}
        >
          Report an Issue
        </Button>
        {canCancel && (
          <Button
            variant="danger"
            icon={<XCircle size={16} />}
            onClick={() => {
              cancelTransaction(txn.id);
              push({ variant: "info", title: "Transaction cancelled" });
            }}
          >
            Cancel Transaction
          </Button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-small text-[var(--color-text-secondary)]">{label}</span>
      <span className={`tabular text-small capitalize ${strong ? "font-bold" : "font-medium"} text-[var(--color-text)]`}>{value}</span>
    </div>
  );
}
