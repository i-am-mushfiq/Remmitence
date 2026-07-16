import { Share2, Repeat, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuccessOverlay } from "../../../components/ui/SuccessOverlay";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/Toast";
import { formatBdt, formatMyr } from "../../../lib/format";
import type { Transaction } from "../../../types";

export function SuccessStep({ txn, onSendAnother }: { txn: Transaction; onSendAnother: () => void }) {
  const navigate = useNavigate();
  const { push } = useToast();

  return (
    <SuccessOverlay open title="Transfer Sent!" description={`${formatMyr(txn.totalAmountMyr)} is on its way to ${txn.beneficiaryName}.`}>
      <div className="rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left">
        <div className="flex justify-between py-1 text-small">
          <span className="text-[var(--color-text-secondary)]">Reference</span>
          <span className="font-semibold text-[var(--color-text)]">{txn.reference}</span>
        </div>
        <div className="flex justify-between py-1 text-small">
          <span className="text-[var(--color-text-secondary)]">Recipient gets</span>
          <span className="font-semibold text-[var(--color-accent)]">{formatBdt(txn.receiveAmountBdt)}</span>
        </div>
      </div>
      <Button
        fullWidth
        variant="secondary"
        icon={<Share2 size={16} />}
        onClick={() => push({ variant: "success", title: "Receipt shared", description: "A copy of your digital receipt was sent to your email." })}
      >
        Share Receipt
      </Button>
      <Button fullWidth variant="ghost" icon={<Repeat size={16} />} onClick={onSendAnother}>
        Send Another Transfer
      </Button>
      <Button fullWidth icon={<Home size={16} />} onClick={() => navigate("/")}>
        Back to Dashboard
      </Button>
    </SuccessOverlay>
  );
}
