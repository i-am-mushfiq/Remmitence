import { useState } from "react";
import { Send } from "lucide-react";
import { Drawer } from "../../components/ui/Drawer";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { formatDateTime, formatDate } from "../../lib/format";
import type { SupportTicket } from "../../types";

export function TicketDetailDrawer({ ticket, onClose }: { ticket: SupportTicket | null; onClose: () => void }) {
  const replyToTicket = useStore((s) => s.replyToTicket);
  const [message, setMessage] = useState("");

  if (!ticket) return null;

  const statusTone = ticket.status === "resolved" ? "success" : ticket.status === "in_progress" ? "warning" : "info";

  return (
    <Drawer open={!!ticket} onClose={onClose} title={ticket.reference}>
      <div className="flex items-center gap-2">
        <Badge tone={statusTone}>{ticket.status.replace("_", " ")}</Badge>
        <span className="text-tiny font-normal text-[var(--color-text-secondary)]">SLA target: {formatDate(ticket.slaTarget)}</span>
      </div>
      <p className="mt-3 text-h3 text-[var(--color-text)]">{ticket.subject}</p>

      <div className="mt-5 space-y-4">
        {ticket.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-[var(--radius-control)] px-3.5 py-2.5 ${m.from === "user" ? "bg-[var(--color-primary)] text-white" : "bg-slate-100 text-[var(--color-text)]"}`}>
              <p className="text-small">{m.text}</p>
              <p className={`mt-1 text-tiny ${m.from === "user" ? "text-white/70" : "text-slate-400"}`}>{formatDateTime(m.at)}</p>
            </div>
          </div>
        ))}
      </div>

      {ticket.status !== "resolved" && (
        <div className="mt-5 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message&hellip;"
            className="h-11 flex-1 rounded-[var(--radius-control)] border border-[var(--color-border)] px-3.5 text-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)]"
          />
          <Button
            icon={<Send size={16} />}
            disabled={!message}
            onClick={() => {
              replyToTicket(ticket.id, message);
              setMessage("");
            }}
          >
            Send
          </Button>
        </div>
      )}
    </Drawer>
  );
}
