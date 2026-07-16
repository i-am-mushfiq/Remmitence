import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Headset,
  Gauge,
  Send,
  Receipt,
  PiggyBank,
  UserPlus,
  Users,
  Gem,
  PlaneTakeoff,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { PublicHeader } from "../../components/layout/PublicHeader";
import { PublicFooter } from "../../components/layout/PublicFooter";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { HeroMockup } from "./HeroMockup";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "BNM-Licensed MSB" },
  { icon: Lock, label: "AES-256 Encrypted" },
  { icon: Headset, label: "Bengali Support, 24/7" },
  { icon: Gauge, label: "FX Rate to 4 Decimals" },
];

const FEATURES = [
  {
    icon: Send,
    title: "Seamless Remittance",
    tone: "primary" as const,
    description: "Send earnings from Malaysia to a beneficiary's bank account, MFS wallet, or a cash-pickup point — with live FX rates and transparent fees.",
  },
  {
    icon: Receipt,
    title: "Local Bill Management",
    tone: "primary" as const,
    description: "Pay electricity, gas, water, internet and mobile top-up for your family home in Bangladesh, directly from the app.",
  },
  {
    icon: PiggyBank,
    title: "Savings & DPS",
    tone: "accent" as const,
    description: "Open a Bangladeshi savings account and enrol in a Deposit Pension Scheme with recurring auto-contributions from Malaysia.",
  },
  {
    icon: Gem,
    title: "Consolidated Nest Egg",
    tone: "accent" as const,
    description: "One dashboard tying remittance, bills and savings together — so you always know exactly what you've built back home.",
  },
];

const STEPS = [
  { icon: UserPlus, title: "Register & Verify", description: "Sign up with your NID and Malaysian work permit. Digital KYC takes minutes." },
  { icon: Users, title: "Add a Beneficiary", description: "Save a bank account, MFS wallet, or cash-pickup recipient in Bangladesh." },
  { icon: Send, title: "Send, Pay & Save", description: "Remit earnings, settle household bills, and top up savings or DPS in one flow." },
  { icon: Gem, title: "Track Your Nest Egg", description: "Watch your consolidated position grow toward your return-to-Bangladesh goal." },
];

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-[var(--color-bg)]">
      <PublicHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-8">
          <div>
            <Badge tone="info" className="px-3 py-1 text-tiny">
              Malaysia &rarr; Bangladesh, done right
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-5xl">
              The Complete Way to
              <br />
              <span className="text-[#f97316]">Send, Pay &amp; Save</span>
              <br />
              for Your Family in Bangladesh
            </h1>
            <p className="mt-5 max-w-lg text-body text-[var(--color-text-secondary)]">
              Remit earnings, pay household bills, and build a Bangladeshi savings &amp; DPS nest egg — all from one trusted,
              BNM-licensed app built for Malaysia's Bangladeshi workforce.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" iconRight={<ArrowUpRight size={18} />}>
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-tiny font-medium text-[var(--color-text-secondary)]">
                  <b.icon size={15} className="text-[var(--color-primary)]" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 text-[var(--color-text)]">Four Pillars. One App.</h2>
          <p className="mt-3 text-body text-[var(--color-text-secondary)]">
            Every feature exists to answer one question: are you meaningfully better off than fragmented, uncoordinated channels?
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-transform hover:-translate-y-0.5">
              <CardBody className="flex items-start gap-4">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                    f.tone === "primary" ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  }`}
                >
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="text-h3 text-[var(--color-text)]">{f.title}</h3>
                  <p className="mt-1.5 text-small font-normal text-[var(--color-text-secondary)]">{f.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[var(--color-surface)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h1 text-[var(--color-text)]">How It Works</h2>
            <p className="mt-3 text-body text-[var(--color-text-secondary)]">From sign-up to your first transfer in under ten minutes.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <step.icon size={22} />
                </div>
                <span className="absolute left-1/2 top-0 flex size-6 -translate-x-1/2 -translate-y-2 items-center justify-center rounded-full bg-[#f97316] text-tiny font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-h3 text-[var(--color-text)]">{step.title}</h3>
                <p className="mt-1.5 text-small font-normal text-[var(--color-text-secondary)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nest Egg spotlight */}
      <section id="nest-egg" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 rounded-[var(--radius-modal)] bg-gradient-to-br from-[var(--color-primary)] to-[#003d80] p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <Badge tone="warning" className="bg-white/15 px-3 py-1 text-tiny text-white">
              Our defining feature
            </Badge>
            <h2 className="mt-4 text-h1 text-white">Never lose track of what you've built back home.</h2>
            <p className="mt-4 text-body text-white/80">
              The Nest Egg dashboard consolidates every Ringgit remitted, every bill paid, and every Taka saved into a single,
              always-current figure — culminating in a guided consolidation report the day you return to Bangladesh for good.
            </p>
            <ul className="mt-6 space-y-3">
              {["Category-wise breakdown & 12-month trend charts", "Goal setting with on-track / behind-schedule tracking", "On-demand Return Readiness Report, exportable as PDF"].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-small font-medium text-white/90">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-modal)] bg-white/10 p-6 backdrop-blur">
            <p className="text-tiny font-medium text-white/70">Nest Egg Total</p>
            <p className="mt-1 text-4xl font-bold tabular text-white">৳2,08,620</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <p className="text-tiny font-medium text-white/70">Liquid Balance</p>
                <p className="text-h3 tabular text-white">৳1,84,620</p>
              </div>
              <div>
                <p className="text-tiny font-medium text-white/70">DPS Contributed</p>
                <p className="text-h3 tabular text-white">৳24,000</p>
              </div>
              <div>
                <p className="text-tiny font-medium text-white/70">Goal Progress</p>
                <p className="text-h3 tabular text-white">8%</p>
              </div>
              <div>
                <p className="text-tiny font-medium text-white/70">Govt. Incentive</p>
                <p className="text-h3 tabular text-white">৳1,040</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section id="trust" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 text-[var(--color-text)]">Built on Compliance, From Day One</h2>
          <p className="mt-3 text-body text-[var(--color-text-secondary)]">
            Every transaction independently satisfies Malaysian and Bangladeshi regulation — before funds ever move.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card>
            <CardBody>
              <ShieldCheck size={22} className="text-[var(--color-primary)]" />
              <h3 className="mt-3 text-h3 text-[var(--color-text)]">Dual-Jurisdiction AML/CTF</h3>
              <p className="mt-1.5 text-small font-normal text-[var(--color-text-secondary)]">
                Sanctions, PEP and NTDBW screening on both the Malaysian sending side and the Bangladeshi receiving side, for every transaction.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Lock size={22} className="text-[var(--color-primary)]" />
              <h3 className="mt-3 text-h3 text-[var(--color-text)]">Bank-Grade Security</h3>
              <p className="mt-1.5 text-small font-normal text-[var(--color-text-secondary)]">
                TLS 1.2+ in transit, AES-256 at rest, and PCI DSS-compliant card processing. RemmiNext never stores raw card details.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <PlaneTakeoff size={22} className="text-[var(--color-primary)]" />
              <h3 className="mt-3 text-h3 text-[var(--color-text)]">A Dignified Return</h3>
              <p className="mt-1.5 text-small font-normal text-[var(--color-text-secondary)]">
                A guided Return-to-Bangladesh journey and final consolidation report, so your years here translate into a clear position at home.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Card className="border-0 bg-slate-50 shadow-none">
          <CardBody className="flex flex-col items-center gap-4 py-10 text-center">
            <Quote size={28} className="text-[var(--color-primary)]" />
            <p className="max-w-xl text-h3 font-normal text-[var(--color-text)]">
              "For the first time, I know exactly what I've sent, paid, and saved — instead of guessing across three different apps."
            </p>
            <div>
              <p className="text-small font-semibold text-[var(--color-text)]">Md. Rahim Uddin</p>
              <p className="text-tiny font-normal text-[var(--color-text-secondary)]">Manufacturing worker, Kluang, Johor</p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-[var(--radius-modal)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-[var(--shadow-card)]">
          <h2 className="text-h1 text-[var(--color-text)]">Ready to build your nest egg back home?</h2>
          <p className="max-w-md text-body text-[var(--color-text-secondary)]">Join RemmiNext today — verification takes minutes, and your first transfer can go out right after.</p>
          <Link to="/register">
            <Button size="lg" iconRight={<ArrowUpRight size={18} />}>
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
