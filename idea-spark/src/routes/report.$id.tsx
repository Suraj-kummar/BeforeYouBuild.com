/**
 * src/routes/report.$id.tsx
 *
 * Public shareable report page — /report/abc123
 * Anyone can view this link, no login needed.
 * Free users see 3 sections. Pro users (or report owner) see all 7.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Flame, AlertTriangle, XCircle, Share2, Check,
  ArrowLeft, Lock, Zap, CheckCircle2, TrendingUp, Download,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getReportById, type SavedReportFull } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";
import type { ValidationReport } from "@/lib/validate";

export const Route = createFileRoute("/report/$id")({
  head: () => ({
    meta: [{ title: "Idea Validation Report — BeforeYouBuild" }],
  }),
  component: SharedReportPage,
});

function SharedReportPage() {
  const { id } = Route.useParams();
  const [saved, setSaved] = useState<SavedReportFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isPaid } = useSubscription();

  useEffect(() => {
    getReportById(id).then((data) => {
      if (!data) setNotFound(true);
      else setSaved(data);
      setLoading(false);
    });
  }, [id]);

  const shareReport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound || !saved) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h1 className="text-2xl font-bold mb-2">Report not found</h1>
            <p className="text-muted-foreground mb-6">This link may have expired or been deleted.</p>
            <Link to="/app" className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-5 py-3 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90">
              Validate your own idea <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const report = saved.report as ValidationReport;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-5 py-12 flex-1 space-y-6">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> BeforeYouBuild
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={shareReport}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs font-medium hover:border-primary/30 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Share"}
            </button>
            {isPaid && (
              <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs font-medium hover:border-primary/30 transition-colors">
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
            )}
          </div>
        </div>

        {/* Idea */}
        <div className="rounded-xl border border-border/40 bg-surface/50 px-4 py-3 text-sm text-muted-foreground">
          <span className="text-muted-foreground/50 text-xs font-medium uppercase tracking-wider mr-2">Idea:</span>
          {saved.idea}
        </div>

        <ReportContent report={report} isPaid={isPaid} />

        {/* Share banner */}
        <section className="rounded-2xl border border-border/60 bg-surface p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-soft">
          <div>
            <h3 className="text-lg font-semibold">Validate your own idea</h3>
            <p className="text-sm text-muted-foreground mt-1">Free. Takes 60 seconds. Powered by Claude AI + live web search.</p>
          </div>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow transition-all shrink-0"
          >
            Try it free <TrendingUp className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

// ── ReportContent — shared between /report and /report/$id ────────────────────

export function ReportContent({
  report,
  isPaid,
  idea,
}: {
  report: ValidationReport;
  isPaid: boolean;
  idea?: string;
}) {
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
    <>
      {/* A. VERDICT */}
      <section id="verdict" className={`relative overflow-hidden rounded-3xl border p-8 shadow-glow animate-scale-in ${verdictConfig.cls}`}>
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${verdictConfig.badge}`}>
              {verdictConfig.icon} {verdictConfig.label}
            </span>
            <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">{report.verdictReason}</h1>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" /> Validated by BeforeYouBuild
          </span>
        </div>
      </section>

      {/* B. SCORES — always visible */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Market Size", score: report.scores.market },
          { label: "Competition", score: report.scores.competition },
          { label: "Timing", score: report.scores.timing },
          { label: "Buildability", score: report.scores.buildability },
        ].map((s) => <ScoreCard key={s.label} {...s} />)}
      </section>

      {/* C. THE PROBLEM — always visible */}
      <Section id="problem" title="A. The Problem" icon="🎯">
        <FieldRow label="What pain this solves" value={report.problem.description} />
        <FieldRow label="Who feels it daily" value={report.problem.whoFeelsIt} />
        <FieldRow label="Current solutions" value={report.problem.currentSolutions} />
        <FieldRow label="Payment moment" value={report.problem.paymentMoment} />
      </Section>

      {/* D. IDEAL CUSTOMER — always visible (3 free sections done) */}
      <Section id="customer" title="B. Ideal Customer" icon="👤">
        <FieldRow label="Profile" value={report.idealCustomer.profile} />
        <FieldRow label="Online hangouts" value={report.idealCustomer.onlineHangouts} />
        <FieldRow label="Currently uses" value={report.idealCustomer.currentTools} />
        <FieldRow label="Why current tools suck" value={report.idealCustomer.whyCurrentSuck} />
      </Section>

      {/* === PAYWALL below this line for free users === */}

      {/* E. MARKET SIZE */}
      {isPaid ? (
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
      ) : (
        <LockedSection title="C. Market Size (TAM / SAM / SOM)" icon="📊" teaser="₹40,000 Cr TAM · 2M reachable stores · India-first context" />
      )}

      {/* F. COMPETITORS */}
      {isPaid ? (
        <Section id="competitors" title="D. Top 3 Competitors" icon="⚔️">
          <div className="space-y-3">
            {report.competitors.map((c) => <CompetitorRow key={c.name} {...c} />)}
          </div>
        </Section>
      ) : (
        <LockedSection title="D. Top 3 Competitors" icon="⚔️" teaser="Who you're up against, their weaknesses, and threat levels" />
      )}

      {/* G. MVP BLUEPRINT */}
      {isPaid ? (
        <Section id="mvp" title="E. How to Build the MVP" icon="🛠️">
          <ul className="space-y-3">
            {report.mvpFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary text-xs font-bold mt-0.5">{i + 1}</span>
                <span className="text-sm text-foreground/80 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <LockedSection title="E. How to Build the MVP" icon="🛠️" teaser="3 core features, tech stack, and estimated build time" />
      )}

      {/* H. FIRST 100 USERS */}
      {isPaid ? (
        <Section id="gtm" title="F. How to Get First 100 Users" icon="🚀">
          <ol className="space-y-3">
            {report.first100Users.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mt-0.5">{i + 1}</span>
                <span className="text-sm text-foreground/80 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      ) : (
        <LockedSection title="F. How to Get First 100 Users" icon="🚀" teaser="5 India-specific distribution steps to your first paying customers" />
      )}

      {/* I. FINAL VERDICT */}
      {isPaid ? (
        <Section id="final-verdict" title="G. Final Verdict" icon="🏁">
          <div className={`rounded-2xl border p-6 ${report.finalVerdict.decision === "GO" ? "border-primary/30 bg-primary/10" : "border-destructive/30 bg-destructive/10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-3xl font-black ${report.finalVerdict.decision === "GO" ? "text-primary" : "text-destructive"}`}>
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
      ) : (
        <LockedSection title="G. Final Verdict — GO or NO-GO" icon="🏁" teaser="The bottom line: should you build this? 3 bullet reasons why." />
      )}

      {/* UPGRADE CTA for free users */}
      {!isPaid && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-glow">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-emerald flex items-center justify-center shadow-glow">
              <Zap className="h-7 w-7 text-background" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-2">Unlock the full report</h3>
          <p className="text-muted-foreground mb-2">You&apos;re seeing <strong className="text-foreground">2 of 7 sections</strong>. Upgrade to Pro to unlock:</p>
          <ul className="text-sm text-muted-foreground mb-6 space-y-1">
            {["📊 Market Size (TAM/SAM/SOM)", "⚔️ Competitor Analysis", "🛠️ MVP Blueprint", "🚀 First 100 Users Playbook", "🏁 Final GO / NO-GO Verdict"].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-8 py-3.5 text-base font-bold text-background shadow-glow hover:opacity-90 hover:shadow-glow transition-all"
          >
            Unlock for ₹499/month <Lock className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground/60">Cancel anytime · 2 free validations always available</p>
        </div>
      )}
    </>
  );
}

// ── Locked section placeholder ────────────────────────────────────────────────

function LockedSection({ title, icon, teaser }: { title: string; icon: string; teaser: string }) {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-surface overflow-hidden">
      {/* Blurred fake content */}
      <div className="p-6 blur-sm pointer-events-none select-none opacity-40">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><span>{icon}</span> {title}</h2>
        <div className="space-y-3">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
          <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
        </div>
      </div>
      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm">
        <Lock className="h-8 w-8 text-primary mb-3" />
        <p className="font-semibold text-sm mb-1">{title}</p>
        <p className="text-xs text-muted-foreground mb-4 text-center px-8">{teaser}</p>
        <Link to="/pricing" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-emerald px-4 py-2 text-xs font-bold text-background shadow-glow-sm hover:opacity-90 transition-all">
          Unlock with Pro — ₹499/mo
        </Link>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreCard({ label, score }: { label: string; score: number }) {
  const color = score >= 8 ? "text-primary" : score >= 5 ? "text-warning" : "text-destructive";
  const barColor = score >= 8 ? "bg-gradient-emerald" : score >= 5 ? "bg-warning" : "bg-destructive";
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-card">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-4xl font-black ${color}`}>{score}</span>
        <span className="text-sm text-muted-foreground">/10</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-background/60 overflow-hidden">
        <div className={`h-full rounded-full score-bar-fill ${barColor}`} style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  );
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl border border-border/60 bg-surface p-6 shadow-card">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><span>{icon}</span> {title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/30 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-sm text-foreground/80 leading-relaxed">{value}</p>
    </div>
  );
}

function MarketStat({ label, value }: { label: string; value: string }) {
  const [amt, ...rest] = value.split(" — ");
  return (
    <div className="rounded-xl border border-border/40 bg-background/40 p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{label}</div>
      <div className="text-2xl font-bold text-gradient-emerald">{amt}</div>
      {rest.length > 0 && <div className="text-xs text-muted-foreground mt-1">{rest.join(" — ")}</div>}
    </div>
  );
}

function CompetitorRow({ name, weakness, threatLevel }: { name: string; weakness: string; threatLevel: "HIGH" | "MEDIUM" | "LOW" }) {
  const threatCls = {
    HIGH: "text-destructive bg-destructive/10 border-destructive/20",
    MEDIUM: "text-warning bg-warning/10 border-warning/20",
    LOW: "text-primary bg-primary/10 border-primary/20",
  }[threatLevel];
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/30 p-4">
      <div>
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Weakness: {weakness}</div>
      </div>
      <span className={`self-start md:self-auto shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${threatCls}`}>
        {threatLevel} threat
      </span>
    </div>
  );
}
