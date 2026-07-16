import { useMemo, useState } from "react";
import { LifeBuoy, Phone, MessageCircle, Plus, Search } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Tabs } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { useStore } from "../../store/useStore";
import { NewTicketDrawer } from "./NewTicketDrawer";
import { TicketDetailDrawer } from "./TicketDetailDrawer";
import { FaqAccordion } from "./FaqAccordion";
import { FAQ_ITEMS } from "./faqData";
import { formatDate } from "../../lib/format";
import type { SupportTicket } from "../../types";

export default function SupportPage() {
  const tickets = useStore((s) => s.tickets);
  const [tab, setTab] = useState("tickets");
  const [newOpen, setNewOpen] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [faqQuery, setFaqQuery] = useState("");

  const filteredFaq = useMemo(
    () => FAQ_ITEMS.filter((f) => f.question.toLowerCase().includes(faqQuery.toLowerCase()) || f.answer.toLowerCase().includes(faqQuery.toLowerCase())),
    [faqQuery]
  );

  return (
    <div>
      <PageHeader
        title="Support"
        description="Get help with remittance, bills, savings and account queries"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setNewOpen(true)}>
            New Case
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-small font-semibold text-[var(--color-text)]">Call Support</p>
              <p className="text-tiny font-normal text-[var(--color-text-secondary)]">+60 3-2777 8899 &middot; 9am–9pm daily</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-small font-semibold text-[var(--color-text)]">Live Chat</p>
              <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Available in Bengali, English & Bahasa Malaysia</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { label: "My Cases", value: "tickets", count: tickets.length },
          { label: "FAQ", value: "faq" },
        ]}
      />

      {tab === "tickets" ? (
        <div className="mt-5 space-y-3">
          {tickets.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon={<LifeBuoy size={22} />}
                  title="No support cases"
                  description="If something's not right, raise a case and we'll get back to you within your SLA window."
                  action={
                    <Button icon={<Plus size={16} />} onClick={() => setNewOpen(true)}>
                      New Case
                    </Button>
                  }
                />
              </CardBody>
            </Card>
          ) : (
            tickets.map((t) => (
              <Card key={t.id}>
                <button onClick={() => setSelected(t)} className="block w-full text-left">
                  <CardBody className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-small font-semibold text-[var(--color-text)]">{t.reference}</p>
                        <Badge tone={t.status === "resolved" ? "success" : t.status === "in_progress" ? "warning" : "info"}>{t.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="truncate text-small text-[var(--color-text-secondary)]">{t.subject}</p>
                      <p className="text-tiny font-normal text-slate-400">Opened {formatDate(t.createdAt)}</p>
                    </div>
                  </CardBody>
                </button>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="mt-5">
          <Input placeholder="Search FAQs" value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} leftIcon={<Search size={16} />} className="mb-4" />
          <FaqAccordion items={filteredFaq} />
        </div>
      )}

      <NewTicketDrawer open={newOpen} onClose={() => setNewOpen(false)} />
      <TicketDetailDrawer ticket={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
