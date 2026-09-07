import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Search,
  Target,
  TrendingUp,
  Flame,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Users,
  Zap,
  Star,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeforeYouBuild — Validate your startup idea in 60 seconds" },
      {
        name: "description",
        content:
          "AI-powered market research for founders. Know if your startup idea is worth building before you write a single line of code.",
      },
      {
        property: "og:title",
        content: "BeforeYouBuild — Validate your startup idea in 60 seconds",
      },
      {
        property: "og:description",
        content:
          "Stop wasting months on ideas nobody wants. Get an AI market validation report instantly.",
      },
    ],
  }),
  component: Landing,
});

const SAMPLE_REPORTS = [
  {
    verdict: "hot" as const,
    title: "WhatsApp inventory for kirana stores",
    line: "₹40B+ TAM in India, fragmented competition, perfect timing post-UPI.",
    scores: { mkt: 9, comp: 7, time: 9, build: 8 },
  },
  {
    verdict: "caution" as const,
    title: "Another food delivery app for tier-2",
    line: "Saturated category. Survivable only with sharp niche + serious capital.",
    scores: { mkt: 7, comp: 4, time: 6, build: 6 },
  },
  {
    verdict: "dead" as const,
    title: "Generic AI resume builder",
    line: "50+ free tools exist. Zero defensibility. Don't build this.",
    scores: { mkt: 5, comp: 2, time: 4, build: 9 },
  },
];

const HOW_STEPS = [
  {
    n: "01",
    icon: Search,
    title: "Describe your idea",
    desc: "One clear paragraph. The more specific, the sharper the report.",
  },
  {
    n: "02",
    icon: TrendingUp,
    title: "AI researches the market",
    desc: "We search the web, analyse competitors, and size the market in real time.",
  },
  {
    n: "03",
    icon: Target,
    title: "Get your verdict",
    desc: "HOT 🔥, CAUTION ⚠️, or DEAD ❌ — with the receipts to back it up.",
  },
];

const SOCIAL_PROOF = [
  { quote: "Saved me 3 months of building the wrong thing.", name: "Arjun S.", role: "Founder, Indore" },
  { quote: "Pitch-ready analysis in under a minute. Investors were impressed.", name: "Priya K.", role: "First-time founder, Delhi" },
  { quote: "Finally found the gap in the SaaS market I was missing.", name: "Rahul M.", role: "Freelancer, Bangalore" },
];

function Landing() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    sessionStorage.setItem("byb:idea", idea);
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-mesh" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            AI-powered market validation · Powered by Claude
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tighter animate-fade-up delay-100">
            Know if your startup idea is{" "}
            <span className="text-shimmer">worth building</span>.
            <br />
            <span className="text-muted-foreground">In 60 seconds.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-up delay-200">
            Stop wasting months on ideas nobody wants. Get an AI-powered market
            validation report — competitor analysis, market size, MVP roadmap —
            before you write a single line of code.
          </p>

          {/* Input form */}
          <form
            onSubmit={submit}
            className="mx-auto mt-10 max-w-2xl animate-fade-up delay-300"
          >
            <div className="group rounded-2xl border border-border/60 bg-surface/80 p-2 shadow-soft backdrop-blur-sm transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-glow">
              <textarea
                id="hero-idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="E.g. An app that helps small restaurant owners in India manage their inventory using WhatsApp..."
                rows={3}
                className="w-full resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground/50"
              />
              <div className="flex items-center justify-between px-2 pb-1.5">
                <span className="text-xs text-muted-foreground/60">
                  Be specific. The sharper the idea, the sharper the report.
                </span>
                <button
                  type="submit"
                  id="hero-validate-btn"
                  disabled={!idea.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow disabled:opacity-40 transition-all duration-200"
                >
                  Validate My Idea <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Social proof */}
          <p className="mt-6 text-sm text-muted-foreground animate-fade-up delay-400">
            Join{" "}
            <span className="font-semibold text-foreground">500+ founders</span>{" "}
            who validated before building.
          </p>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/60 animate-fade-up delay-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Results in 60 seconds</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> 2 free validations/month</span>
          </div>
        </div>
      </section>

      {/* ── SAMPLE REPORTS ── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Sample validation reports
          </h2>
          <p className="mt-3 text-muted-foreground">
            Honest verdicts. Real data. No fluff.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {SAMPLE_REPORTS.map((r) => (
            <SampleCard key={r.title} {...r} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how"
        className="mx-auto w-full max-w-6xl px-5 py-20 scroll-mt-20"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            From idea to verdict in under a minute.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_STEPS.map((s) => (
            <StepCard key={s.n} {...s} />
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF QUOTES ── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {SOCIAL_PROOF.map((q) => (
            <QuoteCard key={q.name} {...q} />
          ))}
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="mx-auto w-full max-w-4xl px-5 py-16">
        <div className="rounded-3xl border border-border/60 bg-surface p-8 md:p-12 shadow-card">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Who is this for?</h2>
            <p className="mt-3 text-muted-foreground">Real founders, real problems.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { emoji: "🎓", title: "College students", desc: "Have a startup idea but don't know if it's worth building before dropping semesters on it." },
              { emoji: "🚀", title: "First-time founders", desc: "Before your next investor pitch, validate your assumptions with real market data." },
              { emoji: "💼", title: "Freelancers & SaaS builders", desc: "Unsure about competition? Get clarity on your niche before writing a single line." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border/40 bg-background/40 p-6">
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h3 className="font-semibold text-base mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface p-10 text-center shadow-glow">
          <div className="pointer-events-none absolute inset-0 bg-gradient-emerald-subtle" />
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              Don't build the wrong thing.
            </h3>
            <p className="mt-3 text-muted-foreground">
              Validate first. Build second. Win sooner.
            </p>
            <Link
              to="/app"
              id="cta-validate-btn"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-7 py-3.5 text-sm font-semibold text-background shadow-glow hover:opacity-90 hover:shadow-glow transition-all duration-200"
            >
              Validate your idea now <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              Free tier · No credit card · 60 seconds
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ── Sub-components ── */

function SampleCard({
  verdict,
  title,
  line,
  scores,
}: {
  verdict: "hot" | "caution" | "dead";
  title: string;
  line: string;
  scores: { mkt: number; comp: number; time: number; build: number };
}) {
  const config = {
    hot: {
      label: "HOT IDEA",
      icon: <Flame className="h-4 w-4" />,
      cls: "bg-primary/15 text-primary border-primary/30",
    },
    caution: {
      label: "PROCEED WITH CAUTION",
      icon: <AlertTriangle className="h-4 w-4" />,
      cls: "bg-warning/15 text-warning border-warning/30",
    },
    dead: {
      label: "DEAD ON ARRIVAL",
      icon: <XCircle className="h-4 w-4" />,
      cls: "bg-destructive/15 text-destructive border-destructive/30",
    },
  }[verdict];

  const scoreItems = [
    { label: "Mkt", val: scores.mkt },
    { label: "Comp", val: scores.comp },
    { label: "Time", val: scores.time },
    { label: "Build", val: scores.build },
  ];

  return (
    <div className="group rounded-2xl border border-border/60 bg-surface p-6 shadow-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 cursor-pointer">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.cls}`}
      >
        {config.icon} {config.label}
      </span>
      <h3 className="mt-4 text-base font-semibold leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{line}</p>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {scoreItems.map(({ label, val }) => (
          <div
            key={label}
            className="rounded-lg bg-background/60 border border-border/40 py-2 text-center"
          >
            <div className="text-xs text-muted-foreground">{label}</div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                val >= 8
                  ? "text-primary"
                  : val >= 5
                  ? "text-warning"
                  : "text-destructive"
              }`}
            >
              {val}/10
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  desc,
}: {
  n: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-card hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/20">
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-mono text-xs text-muted-foreground/50 font-bold">{n}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function QuoteCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-surface/50 p-6 shadow-card">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">"{quote}"</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-emerald grid place-items-center text-xs font-bold text-background">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
