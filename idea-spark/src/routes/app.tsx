import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, Sparkles, Zap, Lock } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { validateIdea } from "@/lib/validate";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase, getMonthlyUsageCount, FREE_TIER_LIMIT, saveReport, recordValidationUsage } from "@/lib/supabase";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Validate — BeforeYouBuild" }] }),
  component: AppPage,
});

const STEPS = [
  { label: "Searching the web...", icon: "🌐" },
  { label: "Analysing competitors...", icon: "⚔️" },
  { label: "Estimating market size...", icon: "📊" },
  { label: "Generating your report...", icon: "✍️" },
];

const EXAMPLE_IDEAS = [
  "An app that helps small restaurant owners in India manage their inventory using WhatsApp",
  "A subscription service for curated Indian D2C products delivered monthly to diaspora abroad",
  "AI-powered legal document review for Indian startups and freelancers",
  "A peer-to-peer skill-sharing platform for college students in tier-2 cities",
];

function AppPage() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLoading, setUsageLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isPaid } = useSubscription();

  useEffect(() => {
    const saved = sessionStorage.getItem("byb:idea");
    if (saved) {
      setIdea(saved);
      setCharCount(saved.length);
    }
    textareaRef.current?.focus();

    // Load current month usage for free users
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user?.id;
      if (userId) {
        const count = await getMonthlyUsageCount(userId);
        setUsageCount(count);
      }
      setUsageLoading(false);
    });
  }, []);

  const hasHitFreeLimit = !isPaid && usageCount >= FREE_TIER_LIMIT;

  useEffect(() => {
    if (!loading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setStep(0);
    intervalRef.current = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
    setCharCount(e.target.value.length);
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setError(null);
    setLoading(true);
    sessionStorage.setItem("byb:idea", idea);

    try {
      const report = await validateIdea({ data: { idea } });
      sessionStorage.setItem("byb:report", JSON.stringify(report));
      sessionStorage.removeItem("byb:reportId");

      // Auto-save to Supabase if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (userId) {
        // Record usage for free-tier tracking
        await recordValidationUsage(userId);
        // Save report and store ID for shareable link
        const reportId = await saveReport(userId, idea, report, report.verdict);
        if (reportId) {
          sessionStorage.setItem("byb:reportId", reportId);
        }
      }

      navigate({ to: "/report" });
    } catch (err) {
      console.error("Validation error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message.includes("ANTHROPIC_API_KEY") || message.includes("not configured")) {
        sessionStorage.removeItem("byb:report");
        navigate({ to: "/report" });
        return;
      }
      setError(`Validation failed: ${message}. Please try again.`);
      setLoading(false);
    }
  };

  const useExample = (ex: string) => {
    setIdea(ex);
    setCharCount(ex.length);
    textareaRef.current?.focus();
  };

  // Show upgrade gate if free user has hit limit
  if (!usageLoading && hasHitFreeLimit) {
    return <FreeLimitGate usageCount={usageCount} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNav />

      <main className="flex-1 mx-auto w-full max-w-3xl px-5 py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            AI-powered · Powered by Claude
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Validate your idea
          </h1>
          <p className="mt-3 text-muted-foreground">
            Be specific. Mention the user, the pain, and the channel. The more
            detail you give, the sharper your report.
          </p>
          {/* Usage indicator for free users */}
          {!isPaid && !usageLoading && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              {FREE_TIER_LIMIT - usageCount} of {FREE_TIER_LIMIT} free validations remaining this month
              {usageCount > 0 && (
                <Link to="/pricing" className="text-primary hover:underline ml-1 font-medium">
                  Upgrade →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <div
            className={`rounded-2xl border bg-surface p-2 shadow-soft transition-all duration-300 focus-within:shadow-glow ${
              error
                ? "border-destructive/50"
                : "border-border/60 focus-within:border-primary/50"
            }`}
          >
            <textarea
              ref={textareaRef}
              id="validate-textarea"
              value={idea}
              onChange={handleChange}
              disabled={loading}
              placeholder="E.g. An app that helps small restaurant owners in India manage their inventory using WhatsApp instead of notebooks — they get low-stock alerts and can reorder via chat."
              rows={7}
              className="w-full resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground/40 disabled:opacity-50 leading-relaxed"
            />
            <div className="flex items-center justify-between border-t border-border/40 px-4 py-2">
              <span
                className={`text-xs transition-colors ${
                  charCount > 50 ? "text-primary" : "text-muted-foreground/50"
                }`}
              >
                {charCount} characters{" "}
                {charCount < 50 && "· add more detail for a better report"}
              </span>
              <button
                type="submit"
                id="validate-submit-btn"
                disabled={loading || !idea.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    Validate Now <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-destructive flex items-center gap-2">
              ⚠️ {error}
            </p>
          )}
        </form>

        {/* Example ideas */}
        {!loading && (
          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
              Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => useExample(ex)}
                  className="rounded-lg border border-border/50 bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-surface transition-all duration-200 text-left"
                >
                  {ex.slice(0, 50)}…
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-border/60 bg-surface p-6 shadow-soft animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 flex-1 rounded-full bg-background overflow-hidden">
                <div
                  className="h-full bg-gradient-emerald rounded-full transition-all duration-1000"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {Math.round(((step + 1) / STEPS.length) * 100)}%
              </span>
            </div>

            <ul className="space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.label} className="flex items-center gap-4">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl border text-sm transition-all duration-300 ${
                      i < step
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : i === step
                        ? "border-primary text-primary bg-primary/10 shadow-glow-sm"
                        : "border-border text-muted-foreground/40"
                    }`}
                  >
                    {i < step ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : i === step ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </span>
                  <div>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        i <= step ? "text-foreground" : "text-muted-foreground/40"
                      }`}
                    >
                      {s.icon} {s.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-muted-foreground/60 text-center">
              Searching the web and analysing real market data…
            </p>
          </div>
        )}

        {/* Tips */}
        {!loading && (
          <div className="mt-10 rounded-2xl border border-border/40 bg-surface/40 p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tips for a sharper report
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&rarr;</span>Name your target user specifically, e.g. &quot;small kirana owners in tier-2 India&quot;</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&rarr;</span>Describe the pain with numbers &mdash; &quot;they lose 10% revenue to stockouts&quot; is gold</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&rarr;</span>Mention what they currently use &mdash; &quot;they currently use notebooks or Khatabook&quot;</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&rarr;</span>Add your distribution angle &mdash; &quot;via WhatsApp groups or Instagram Reels&quot;</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

// ── FreeLimitGate ─────────────────────────────────────────────────────────────

function FreeLimitGate({ usageCount }: { usageCount: number }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNav />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-lg w-full text-center animate-fade-up">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-24 rounded-full bg-surface border border-border/60 flex items-center justify-center">
              <Lock className="h-10 w-10 text-muted-foreground" />
              <span className="absolute -top-2 -right-2 rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 text-xs font-bold text-primary">
                {usageCount}/{FREE_TIER_LIMIT}
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            You&apos;ve used your{" "}
            <span className="text-gradient-emerald">free validations</span>
          </h1>
          <p className="text-muted-foreground text-base mb-8 leading-relaxed max-w-sm mx-auto">
            You&apos;ve validated {usageCount} ideas this month. Upgrade to Pro for
            unlimited validations, PDF exports, and more.
          </p>

          {/* What you get */}
          <div className="rounded-2xl border border-primary/30 bg-surface p-6 mb-8 text-left shadow-glow">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4" /> Unlock with Pro — ₹499/month
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Unlimited idea validations",
                "PDF export for every report",
                "Saved report history (30 reports)",
                "Priority Claude AI model",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-foreground">
                  <span className="text-primary">✅</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pricing"
              id="upgrade-from-gate-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-8 py-4 text-base font-bold text-background shadow-glow hover:opacity-90 hover:shadow-glow transition-all"
            >
              Upgrade to Pro <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-6 py-4 text-base font-semibold hover:border-primary/40 hover:text-primary transition-all"
            >
              Back to home
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/60">
            Free tier resets on the 1st of each month. Cancel anytime.
          </p>
        </div>
      </main>
    </div>
  );
}
