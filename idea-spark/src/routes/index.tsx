import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  Rocket,
  Globe,
  BarChart3,
  ShieldCheck,
  Lightbulb,
  DollarSign,
  Map,
  Brain,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")(  {
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
  {
    quote: "Saved me 3 months of building the wrong thing.",
    name: "Arjun S.",
    role: "Founder, Indore",
    avatarGradient: "linear-gradient(135deg, #10b981, #0d9488)",
  },
  {
    quote: "Pitch-ready analysis in under a minute. Investors were impressed.",
    name: "Priya K.",
    role: "First-time founder, Delhi",
    avatarGradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
  },
  {
    quote: "Finally found the gap in the SaaS market I was missing.",
    name: "Rahul M.",
    role: "Freelancer, Bangalore",
    avatarGradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
];

const TICKER_ITEMS = [
  "🔥 WhatsApp CRM for kirana — HOT",
  "⚠️  Hyperlocal delivery tier-2 — CAUTION",
  "❌  Generic AI chatbot SaaS — DEAD",
  "🔥 EdTech for vernacular languages — HOT",
  "⚠️  NFT marketplace India — CAUTION",
  "🔥 B2B invoicing for SMEs — HOT",
  "❌  Another to-do list app — DEAD",
  "🔥 Rural fintech via UPI — HOT",
];

/* What the AI analyses — 7 sections */
const AI_ANALYSES = [
  { icon: BarChart3,  label: "Market Size",        desc: "TAM / SAM / SOM sizing with real numbers",   color: "#10b981" },
  { icon: Users,      label: "Competitor Scan",     desc: "Live web search for existing players",        color: "#6366f1" },
  { icon: TrendingUp, label: "Trend Analysis",      desc: "Google Trends + news signals for timing",     color: "#f59e0b" },
  { icon: ShieldCheck,label: "Moat Assessment",     desc: "Network effects, IP, switching costs",         color: "#ec4899" },
  { icon: DollarSign, label: "Revenue Models",      desc: "Monetisation options ranked by viability",    color: "#34d399" },
  { icon: Map,        label: "Go-to-Market",        desc: "First 100 customers acquisition strategy",   color: "#fb923c" },
  { icon: Lightbulb,  label: "MVP Roadmap",         desc: "What to build first to de-risk fastest",     color: "#a78bfa" },
];

/* Typing ideas for the textarea placeholder */
const TYPING_IDEAS = [
  "An app that helps kirana stores manage inventory via WhatsApp...",
  "A SaaS tool that auto-generates invoices for Indian freelancers...",
  "An AI tutor for Class 10 students in Hindi and regional languages...",
  "A platform connecting rural artisans with urban buyers via video...",
  "A B2B marketplace for restaurant ingredient sourcing in tier-2 cities...",
];

/* Simulated streaming AI output lines */
const AI_STREAM_LINES = [
  { delay: 0,    text: "🔍  Searching web for competitors..." },
  { delay: 900,  text: "📊  Sizing the market (TAM/SAM/SOM)..." },
  { delay: 1800, text: "⚡  Analysing timing & trend signals..." },
  { delay: 2700, text: "🛡️  Evaluating competitive moat..." },
  { delay: 3500, text: "✅  Verdict: HOT IDEA — Score 8.3/10" },
];

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 1800, trigger: boolean = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

/* ── Typing placeholder hook ── */
function useTypingPlaceholder(ideas: string[], speed = 45, pause = 2000) {
  const [placeholder, setPlaceholder] = useState("");
  const [ideaIdx, setIdeaIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ideas[ideaIdx];
    if (!deleting) {
      if (charIdx < current.length) {
        const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), pause);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdeaIdx((i) => (i + 1) % ideas.length);
      }
    }
  }, [charIdx, deleting, ideaIdx, ideas, speed, pause]);

  useEffect(() => {
    setPlaceholder(ideas[ideaIdx].slice(0, charIdx));
  }, [charIdx, ideaIdx, ideas]);

  return placeholder;
}

function Landing() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [countStarted, setCountStarted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useReveal();

  useEffect(() => {
    const timer = setTimeout(() => setCountStarted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const ideasCount = useCountUp(2847, 2000, countStarted);
  const typingPlaceholder = useTypingPlaceholder(TYPING_IDEAS);

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
      <section className="relative overflow-hidden" ref={heroRef}>
        {/* Layered backgrounds */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-mesh" />
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

        {/* Animated blobs */}
        <div
          className="pointer-events-none absolute top-[-120px] left-[-80px] h-[500px] w-[500px] rounded-full opacity-[0.07] animate-blob"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-[-80px] right-[-60px] h-[400px] w-[400px] rounded-full opacity-[0.05] animate-blob"
          style={{ background: "radial-gradient(circle, #34d399, transparent 70%)", animationDelay: "3s" }}
        />

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

          {/* Live counter */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 px-5 py-2.5 backdrop-blur animate-fade-up delay-300">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground tabular-nums">
                {ideasCount.toLocaleString("en-IN")}
              </span>{" "}
              ideas validated and counting
            </span>
          </div>

          {/* Input form — with typing placeholder */}
          <form onSubmit={submit} className="mx-auto mt-8 max-w-2xl animate-fade-up delay-300">
            <div className="group rounded-2xl border border-border/60 bg-surface/80 p-2 shadow-soft backdrop-blur-sm transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-glow">
              <textarea
                id="hero-idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={typingPlaceholder + "█"}
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

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/60 animate-fade-up delay-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" /> Results in 60 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" /> 2 free validations/month
            </span>
          </div>

          {/* Powered-by AI badge strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up delay-600">
            <span className="text-xs text-muted-foreground/40 mr-1">Powered by</span>
            {[
              { label: "Claude AI", icon: <Brain className="h-3 w-3" />, color: "#f97316" },
              { label: "Real-time web search", icon: <Globe className="h-3 w-3" />, color: "#10b981" },
              { label: "Live market data", icon: <BarChart3 className="h-3 w-3" />, color: "#6366f1" },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-surface/60 px-3 py-1 text-xs text-muted-foreground/70 backdrop-blur"
              >
                <span style={{ color: b.color }}>{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE TICKER ── */}
      <div className="relative overflow-hidden border-y border-border/40 bg-surface/40 py-3">
        <div className="flex gap-12 animate-ticker whitespace-nowrap w-max">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-xs text-muted-foreground/70 font-mono">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── AI LIVE PREVIEW ── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          {/* Left: copy */}
          <div className="reveal-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary mb-5">
              <Brain className="h-3.5 w-3.5" />
              Watch the AI think
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The AI works like a{" "}
              <span className="text-shimmer">senior analyst</span>
              <br />— in real time.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              No templates. No canned answers. Claude searches the live web, sizes your market, maps your competitors, and writes a custom verdict — fresh every time.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Live competitor scan via real-time web search",
                "India-specific TAM/SAM/SOM market sizing",
                "Timing score based on trend signals",
                "Honest verdict — even if it's brutal",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: animated AI terminal mockup */}
          <div className="reveal-right">
            <AITerminal />
          </div>
        </div>
      </section>

      {/* ── WHAT AI ANALYSES ── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="mb-12 text-center reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            7 sections. Every report.
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            What the AI analyses for you
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Every validation runs the same rigorous 7-point framework — no shortcuts.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {AI_ANALYSES.map(({ icon: Icon, label, desc, color }, i) => (
            <div
              key={label}
              className="reveal group rounded-2xl border border-border/50 bg-surface/60 p-5 hover:border-primary/30 hover:shadow-glow-sm hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <p className="font-semibold text-sm mb-1">{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}

          {/* +1 placeholder — upgrade teaser */}
          <div className="reveal group rounded-2xl border border-dashed border-border/40 bg-surface/20 p-5 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-all duration-300 cursor-default" style={{ transitionDelay: `${AI_ANALYSES.length * 60}ms` }}>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="font-semibold text-sm">+ More on Pro</p>
            <p className="text-xs text-muted-foreground mt-1">Deeper competitor teardowns & PDF export</p>
          </div>
        </div>
      </section>

      {/* ── SAMPLE REPORTS ── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="mb-12 text-center reveal">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Sample validation reports
          </h2>
          <p className="mt-3 text-muted-foreground">
            Honest verdicts. Real data. No fluff.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {SAMPLE_REPORTS.map((r, i) => (
            <div key={r.title} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <SampleCard {...r} />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="mx-auto w-full max-w-6xl px-5 py-20 scroll-mt-20">
        <div className="mb-12 text-center reveal">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-3 text-muted-foreground">From idea to verdict in under a minute.</p>
        </div>

        <div className="relative grid gap-5 md:grid-cols-3">
          <div className="hidden md:block absolute top-[40px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px border-t border-dashed border-border/60" />
          {HOW_STEPS.map((s, i) => (
            <div key={s.n} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              <StepCard {...s} />
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF QUOTES ── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="mb-10 text-center reveal">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Founders love it</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {SOCIAL_PROOF.map((q, i) => (
            <div key={q.name} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <QuoteCard {...q} />
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="mx-auto w-full max-w-4xl px-5 py-16">
        <div className="rounded-3xl border border-border/60 bg-surface p-8 md:p-12 shadow-card reveal">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Who is this for?</h2>
            <p className="mt-3 text-muted-foreground">Real founders, real problems.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: "🎓",
                title: "College students",
                desc: "Have a startup idea but don't know if it's worth building before dropping semesters on it.",
                gradient: "from-blue-500/10 to-purple-500/5",
              },
              {
                emoji: "🚀",
                title: "First-time founders",
                desc: "Before your next investor pitch, validate your assumptions with real market data.",
                gradient: "from-emerald-500/10 to-teal-500/5",
              },
              {
                emoji: "💼",
                title: "Freelancers & SaaS builders",
                desc: "Unsure about competition? Get clarity on your niche before writing a single line.",
                gradient: "from-amber-500/10 to-orange-500/5",
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className={`reveal group rounded-2xl border border-border/40 bg-gradient-to-br ${c.gradient} p-6 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{c.emoji}</div>
                <h3 className="font-semibold text-base mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-surface p-10 text-center shadow-glow cta-spin-border">
          <div className="pointer-events-none absolute inset-0 bg-gradient-emerald-subtle rounded-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-radial-glow rounded-3xl" />
          <div className="absolute top-6 right-8 text-2xl animate-float opacity-60 select-none">
            <Rocket className="h-8 w-8 text-primary/50" />
          </div>
          <div className="absolute bottom-6 left-8 text-lg animate-float opacity-40 select-none" style={{ animationDelay: "1.5s" }}>
            <Sparkles className="h-6 w-6 text-primary/40" />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Don't build the wrong thing.</h3>
            <p className="mt-3 text-muted-foreground">Validate first. Build second. Win sooner.</p>
            <Link
              to="/app"
              id="cta-validate-btn"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-7 py-3.5 text-sm font-semibold text-background shadow-glow hover:opacity-90 hover:shadow-glow transition-all duration-200"
            >
              Validate your idea now <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">Free tier · No credit card · 60 seconds</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ──────────────────────────────────────────────
   AI Terminal mockup component
   Loops through simulated AI stream lines
────────────────────────────────────────────── */
function AITerminal() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    setVisibleLines([]);
    const timers: ReturnType<typeof setTimeout>[] = [];

    AI_STREAM_LINES.forEach(({ delay }, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, delay));
    });

    // Restart loop after all lines shown + pause
    const resetDelay = AI_STREAM_LINES[AI_STREAM_LINES.length - 1].delay + 2800;
    timers.push(setTimeout(() => {
      setLoop((l) => l + 1);
    }, resetDelay));

    return () => timers.forEach(clearTimeout);
  }, [loop]);

  return (
    <div className="rounded-2xl border border-border/60 bg-[#0d0d0d] shadow-glow overflow-hidden font-mono text-sm">
      {/* Terminal top bar */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-surface/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-destructive/70" />
        <span className="h-3 w-3 rounded-full bg-warning/70" />
        <span className="h-3 w-3 rounded-full bg-primary/70" />
        <span className="ml-3 text-xs text-muted-foreground/50">AI Validation Engine — Claude 3.5</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-primary/70">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-5 space-y-3 min-h-[220px]">
        <p className="text-muted-foreground/40 text-xs mb-4">$ validate --idea "WhatsApp inventory for kirana stores"</p>
        {AI_STREAM_LINES.map(({ text }, i) => {
          const visible = visibleLines.includes(i);
          const isLast = i === AI_STREAM_LINES.length - 1;
          return (
            <div
              key={`${loop}-${i}`}
              className="flex items-center gap-2 transition-all duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(6px)",
              }}
            >
              {isLast ? (
                <span className="text-primary font-bold">{text}</span>
              ) : (
                <span className="text-muted-foreground/80">{text}</span>
              )}
              {/* Blinking cursor on last visible line */}
              {visible && visibleLines[visibleLines.length - 1] === i && !visibleLines.includes(AI_STREAM_LINES.length - 1) && (
                <span className="inline-block h-4 w-0.5 bg-primary animate-pulse ml-1" />
              )}
            </div>
          );
        })}

        {/* Final result block */}
        {visibleLines.includes(AI_STREAM_LINES.length - 1) && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/8 p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground/60">Overall Score</span>
              <span className="text-primary font-black text-lg">8.3<span className="text-xs text-muted-foreground/50">/10</span></span>
            </div>
            <div className="h-2 rounded-full bg-border/40 overflow-hidden">
              <div
                className="h-full rounded-full bar-fill-anim"
                style={{ "--bar-target": "83%", background: "#10b981" } as React.CSSProperties}
              />
            </div>
            <p className="mt-3 text-xs text-primary/80 font-semibold">🔥 HOT IDEA — Build this. Market is ready.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────── */

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

  const cardRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group rounded-2xl border border-border/60 bg-surface p-6 shadow-card hover:border-primary/30 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.cls}`}>
        {config.icon} {config.label}
      </span>
      <h3 className="mt-4 text-base font-semibold leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{line}</p>
      <div className="mt-5 space-y-2.5">
        {scoreItems.map(({ label, val }) => {
          const pct = (val / 10) * 100;
          const color = val >= 8 ? "#10b981" : val >= 5 ? "#f59e0b" : "#ef4444";
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold" style={{ color }}>{val}/10</span>
              </div>
              <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-full rounded-full bar-fill-anim"
                  style={{
                    "--bar-target": `${pct}%`,
                    background: color,
                    animationPlayState: animated ? "running" : "paused",
                    animationDelay: animated ? "0.1s" : "0s",
                  } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCard({ n, icon: Icon, title, desc }: { n: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-border/60 bg-surface p-6 shadow-card hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/20 group-hover:bg-primary/25 group-hover:shadow-glow-sm group-hover:scale-110 transition-all duration-300">
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-mono text-xs text-muted-foreground/50 font-bold">{n}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function QuoteCard({ quote, name, role, avatarGradient }: { quote: string; name: string; role: string; avatarGradient: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [starsVisible, setStarsVisible] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setStarsVisible(true); obs.disconnect(); }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-border/40 bg-surface/50 p-6 shadow-card hover:border-border/70 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className="h-3.5 w-3.5 fill-primary text-primary star-anim"
            style={starsVisible ? { animationDelay: `${s * 60}ms` } : { opacity: 0, animation: "none" }}
          />
        ))}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">"{quote}"</p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-full grid place-items-center text-xs font-bold text-white shrink-0"
          style={{ background: avatarGradient }}
        >
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
