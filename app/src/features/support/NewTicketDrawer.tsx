import { useState } from "react";
import { Drawer } from "../../components/ui/Drawer";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";

export function NewTicketDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createTicket = useStore((s) => s.createTicket);
  const transactions = useStore((s) => s.transactions);
  const { push } = useToast();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [relatedTxn, setRelatedTxn] = useState("");

  const reset = () => {
    setSubject("");
    setMessage("");
    setRelatedTxn("");
  };

  const handleSubmit = () => {
    const ticket = createTicket(subject, message, relatedTxn || undefined);
    push({ variant: "success", title: "Support case created", description: `Reference ${ticket.reference}. We'll respond within your SLA window.` });
    onClose();
    setTimeout(reset, 300);
  };

  return (
    <Drawer open={open} onClose={onClose} title="Report an Issue">
      <div className="space-y-4">
        <Input label="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Briefly describe your issue" />
        <Select
          label="Related transaction (optional)"
          placeholder="None"
          options={transactions.slice(0, 10).map((t) => ({ label: `${t.reference} — ${t.kind.replace("_", " ")}`, value: t.id }))}
          value={relatedTxn}
          onChange={(e) => setRelatedTxn(e.target.value)}
        />
        <Textarea label="Describe the issue" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Include as much detail as possible" />
        <p className="text-tiny font-normal text-[var(--color-text-secondary)]">You'll receive a case reference and target resolution SLA once submitted.</p>
        <Button fullWidth disabled={!subject || !message} onClick={handleSubmit}>
          Submit Case
        </Button>
      </div>
    </Drawer>
  );
}
