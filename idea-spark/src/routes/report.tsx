import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Share2, Check, ArrowLeft, Download, TrendingUp, FlaskConical } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ReportContent } from "@/routes/report.$id";
import { useSubscription } from "@/hooks/useSubscription";
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
    { name: "Vyapar", weakness: "Not WhatsApp-native, steep learning curve, English UI", threatLevel: "HIGH" },
    { name: "Khatabook", weakness: "Only does ledger/khata — zero inventory or SKU intelligence", threatLevel: "MEDIUM" },
    { name: "Dukaan", weakness: "Targets online D2C sellers, not in-store kirana operations", threatLevel: "LOW" },
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
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const { isPaid } = useSubscription();

  useEffect(() => {
    const raw = sessionStorage.getItem("byb:report");
    const savedIdea = sessionStorage.getItem("byb:idea") ?? "";
    const reportId = sessionStorage.getItem("byb:reportId");
    setIdea(savedIdea);

    // Build shareable URL if we have a saved report ID
    if (reportId) {
      setShareUrl(`${window.location.origin}/report/${reportId}`);
    }

    if (raw) {
      try { setReport(JSON.parse(raw)); }
      catch {
        setReport(DEMO_REPORT);
        setIsDemo(true);
      }
    } else {
      setReport(DEMO_REPORT);
      setIsDemo(true);
    }
  }, []);

  const shareReport = async () => {
    const url = shareUrl ?? window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-5 py-12 flex-1 space-y-6">

        {/* Demo mode banner */}
        {isDemo && (
          <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 flex items-center gap-3 print:hidden">
            <FlaskConical className="h-4 w-4 text-warning shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-warning">Demo report</span>
              <span className="text-sm text-warning/80 ml-2">This is a sample validation — not your real idea.</span>
            </div>
            <Link
              to="/app"
              className="shrink-0 text-xs font-semibold text-warning hover:underline"
            >
              Validate your idea →
            </Link>
          </div>
        )}

        {/* Back + actions */}
        <div className="flex items-center justify-between print:hidden">
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
              {copied ? "Link copied!" : "Share report"}
            </button>
            {isPaid && (
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
            )}
          </div>
        </div>

        {/* Idea chip */}
        {idea && (
          <div className="rounded-xl border border-border/40 bg-surface/50 px-4 py-3 text-sm text-muted-foreground">
            <span className="text-muted-foreground/50 text-xs font-medium uppercase tracking-wider mr-2">Idea:</span>
            {idea}
          </div>
        )}

        {/* Shareable link chip */}
        {shareUrl && (
          <div
            onClick={shareReport}
            className="cursor-pointer rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Share2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-primary/80 font-medium text-xs truncate">{shareUrl}</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors shrink-0">
              {copied ? "✅ Copied!" : "Click to copy"}
            </span>
          </div>
        )}

        {/* Report content with blur gate */}
        <ReportContent report={report} isPaid={isPaid} idea={idea} />

        {/* Validate another */}
        <div className="text-center py-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Validate another idea <span className="text-primary">→</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
