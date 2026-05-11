import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Flame,
  AlertTriangle,
  XCircle,
  Share2,
  Check,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { ValidationReport } from "@/lib/validate";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [{ title: "Your Validation Report — BeforeYouBuild" }],
  }),
  component: ReportPage,
});

// Fallback demo report (shown when no real report is in session)
const DEMO_REPORT: ValidationReport = {
  verdict: "HOT",
  verdictReason:
    "₹40B+ TAM in India, fragmented competition, and WhatsApp-native UX gives you an unfair advantage.",
  scores: { market: 9, competition: 7, timing: 9, buildability: 8 },
  problem: {
    description:
      "Kirana store owners lose 8–12% of monthly revenue to stockouts and dead inventory because they track stock on paper or in notebooks.",
    whoFeelsIt:
      "Rajesh, 42, runs a kirana in Indore. Every evening he manually tallies notebook entries and misses which SKUs are running low — leading to angry customers and lost sales.",
    currentSolutions:
      "Notebook + memory, Khatabook (which doesn't track inventory), or basic Excel sheets.",
    paymentMoment:
      'When they realise a customer walked out because a product was out of stock. "Kal aana" is losing them money daily.',
  },
  idealCustomer: {
    profile: "Single-store kirana/grocery owners doing ₹2–8L/month revenue.",
    onlineHangouts:
      "WhatsApp distributor groups, Facebook kirana communities, regional YouTube channels.",
    currentTools: "Paper register, basic Excel, sometimes Vyapar.",
    whyCurrentSuck:
      "Too generic, not WhatsApp-native, English-only UIs with steep learning curves.",
  },
  marketSize: {
    TAM: "₹40,000 Cr — 13M kirana stores across India",
    SAM: "₹6,000 Cr — 2M digitally-active stores with smartphone + WhatsApp",
    SOM: "₹120 Cr — 40,000 stores reachable in 24 months",
    indiaContext:
      "Post-UPI, kiranas are digitally fluent on WhatsApp but massively underserved by SaaS tools built for them.",
  },
  competitors: [
    {
      name: "Vyapar",
      weakness: "Not WhatsApp-native, steep learning curve, English UI",
      threatLevel: "HIGH",
    },
    {
      name: "Khatabook",
      weakness: "Only does ledger/khata — zero inventory or SKU intelligence",
      threatLevel: "MEDIUM",
    },
    {
      name: "Dukaan",
      weakness: "Targets online D2C sellers, not in-store kirana operations",
      threatLevel: "LOW",
    },
  ],
  mvpFeatures: [
    "WhatsApp Business API integration — add/remove stock by typing or voice note",
    "Daily automated low-stock summary at 8pm in Hindi",
    "Simple dashboard with top 20 fast-moving SKUs",
  ],
  first100Users: [
    "Walk into 50 kiranas in your city this week. Onboard 10 in person, hands-on.",
    "Post a 60-second Hindi demo on Instagram Reels and YouTube Shorts targeting kirana owners.",
    "Join 20 WhatsApp distributor groups and share value-first content (not spam).",
    "Partner with 2 local FMCG distributors for referrals — they talk to every store daily.",
    "Offer ₹0 onboarding for 30 days, capped at 100 stores. Create urgency.",
  ],
  finalVerdict: {
    decision: "GO",
    reasons: [
      "Massive underserved segment with high willingness to pay (₹299–499/month is real for these owners).",
      "No incumbent owns the WhatsApp-native angle — you have a clear wedge.",
      "Buildable solo in under a month with Supabase + Node + WhatsApp Cloud API.",
    ],
  },
};

function ReportPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [idea, setIdea] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("byb:report");
    const savedIdea = sessionStorage.getItem("byb:idea") ?? "";
    setIdea(savedIdea);
    if (raw) {
      try {
        setReport(JSON.parse(raw));
      } catch {
        setReport(DEMO_REPORT);
      }
    } else {
      setReport(DEMO_REPORT);
    }
  }, []);

  const shareReport = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: ignore */
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const verdictConfig = {
    HOT: {
      label: "🔥 HOT IDEA",
      cls: "border-primary/30 bg-primary/10",
      badge: "bg-primary/15 border-primary/30 text-primary",
      icon: <Flame className="h-5 w-5" />,
    },
    CAUTION: {
      label: "⚠️ PROCEED WITH CAUTION",
      cls: "border-warning/30 bg-warning/10",
      badge: "bg-warning/15 border-warning/30 text-warning",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    DEAD: {
      label: "❌ DEAD ON ARRIVAL",
      cls: "border-destructive/30 bg-destructive/10",
      badge: "bg-destructive/15 border-destructive/30 text-destructive",
      icon: <XCircle className="h-5 w-5" />,
    },
  }[report.verdict];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="mx-auto w-full max-w-4xl px-5 py-12 flex-1 space-y-6">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/app" })}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to ideas
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={shareReport}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs font-medium hover:border-primary/30 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Share"}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs font-medium hover:border-primary/30 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Idea being validated */}
        {idea && (
          <div className="rounded-xl border border-border/40 bg-surface/50 px-4 py-3 text-sm text-muted-foreground">
            <span className="text-muted-foreground/50 text-xs font-medium uppercase tracking-wider mr-2">Idea:</span>
            {idea}
          </div>
        )}

        {/* A. VERDICT BANNER */}
        <section
          id="verdict"
          className={`relative overflow-hidden rounded-3xl border p-8 shadow-glow animate-scale-in ${verdictConfig.cls}`}
        >
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${verdictConfig.badge}`}
              >
                {verdictConfig.icon} {verdictConfig.label}
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
                {report.verdictReason}
              </h1>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-primary" /> Validated by BeforeYouBuild
            </span>
          </div>
        </section>

        {/* B. SCORES */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Market Size", score: report.scores.market },
            { label: "Competition", score: report.scores.competition },
            { label: "Timing", score: report.scores.timing },
            { label: "Buildability", score: report.scores.buildability },
          ].map((s) => (
            <ScoreCard key={s.label} {...s} />
          ))}
        </section>

        {/* C. THE PROBLEM */}
        <Section id="problem" title="A. The Problem" icon="🎯">
          <FieldRow label="What pain this solves" value={report.problem.description} />
          <FieldRow label="Who feels it daily" value={report.problem.whoFeelsIt} />
          <FieldRow label="Current solutions" value={report.problem.currentSolutions} />
          <FieldRow label="Payment moment" value={report.problem.paymentMoment} />
        </Section>

        {/* D. IDEAL CUSTOMER */}
        <Section id="customer" title="B. Ideal Customer" icon="👤">
          <FieldRow label="Profile" value={report.idealCustomer.profile} />
          <FieldRow label="Online hangouts" value={report.idealCustomer.onlineHangouts} />
          <FieldRow label="Currently uses" value={report.idealCustomer.currentTools} />
          <FieldRow label="Why current tools suck" value={report.idealCustomer.whyCurrentSuck} />
        </Section>

        {/* E. MARKET SIZE */}
        <Section id="market" title="C. Market Size" icon="📊">
          <div className="grid md:grid-cols-3 gap-4">
            <MarketStat label="TAM" value={report.marketSize.TAM} />
            <MarketStat label="SAM" value={report.marketSize.SAM} />
            <MarketStat label="SOM" value={report.marketSize.SOM} />
          </div>
          <div className="mt-4 rounded-xl border border-border/40 bg-background/30 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">🇮🇳 India Context</p>
            <p className="text-sm text-foreground/80">{report.marketSize.indiaContext}</p>
          </div>
        </Section>

        {/* F. COMPETITORS */}
        <Section id="competitors" title="D. Top 3 Competitors" icon="⚔️">
          <div className="space-y-3">
            {report.competitors.map((c) => (
              <CompetitorRow key={c.name} {...c} />
            ))}
          </div>
        </Section>

        {/* G. HOW TO BUILD MVP */}
        <Section id="mvp" title="E. How to Build the MVP" icon="🛠️">
          <ul className="space-y-3">
            {report.mvpFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/80 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* H. FIRST 100 USERS */}
        <Section id="gtm" title="F. How to Get First 100 Users" icon="🚀">
          <ol className="space-y-3">
            {report.first100Users.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/80 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* I. FINAL VERDICT */}
        <Section id="final-verdict" title="G. Final Verdict" icon="🏁">
          <div
            className={`rounded-2xl border p-6 ${
              report.finalVerdict.decision === "GO"
                ? "border-primary/30 bg-primary/10"
                : "border-destructive/30 bg-destructive/10"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-3xl font-black ${
                  report.finalVerdict.decision === "GO"
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {report.finalVerdict.decision === "GO" ? "GO ✅" : "NO-GO ❌"}
              </span>
            </div>
            <ul className="space-y-2">
              {report.finalVerdict.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <span className="text-foreground/80">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* J. SHARE */}
        <section className="rounded-2xl border border-border/60 bg-surface p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-soft">
          <div>
            <h3 className="text-lg font-semibold">Share your validation report</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Carries the "Validated by BeforeYouBuild" watermark. Show it to your co-founders and investors.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={shareReport}
              id="share-report-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow transition-all"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Link copied!" : "Get shareable link"}
            </button>
          </div>
        </section>

        {/* Validate another */}
        <div className="text-center py-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Validate another idea <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Sub-components ── */

function ScoreCard({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8 ? "text-primary" : score >= 5 ? "text-warning" : "text-destructive";
  const barColor =
    score >= 8
      ? "bg-gradient-emerald"
      : score >= 5
      ? "bg-warning"
      : "bg-destructive";

  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-4xl font-black ${color}`}>{score}</span>
        <span className="text-sm text-muted-foreground">/10</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-background/60 overflow-hidden">
        <div
          className={`h-full rounded-full score-bar-fill ${barColor}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-border/60 bg-surface p-6 shadow-card"
    >
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/30 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <p className="text-sm text-foreground/80 leading-relaxed">{value}</p>
    </div>
  );
}

function MarketStat({ label, value }: { label: string; value: string }) {
  const [amt, ...rest] = value.split(" — ");
  return (
    <div className="rounded-xl border border-border/40 bg-background/40 p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold text-gradient-emerald">{amt}</div>
      {rest.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">{rest.join(" — ")}</div>
      )}
    </div>
  );
}

function CompetitorRow({
  name,
  weakness,
  threatLevel,
}: {
  name: string;
  weakness: string;
  threatLevel: "HIGH" | "MEDIUM" | "LOW";
}) {
  const threatCls = {
    HIGH: "text-destructive bg-destructive/10 border-destructive/20",
    MEDIUM: "text-warning bg-warning/10 border-warning/20",
    LOW: "text-primary bg-primary/10 border-primary/20",
  }[threatLevel];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/30 p-4">
      <div>
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Weakness: {weakness}
        </div>
      </div>
      <span
        className={`self-start md:self-auto shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${threatCls}`}
      >
        {threatLevel} threat
      </span>
    </div>
  );
}
