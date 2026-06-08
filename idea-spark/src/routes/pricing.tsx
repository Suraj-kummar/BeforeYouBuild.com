import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Zap, Users, Globe, ArrowRight, Loader2, Crown } from "lucide-react";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useSubscription } from "@/hooks/useSubscription";
import { startCheckout } from "@/lib/checkout";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BeforeYouBuild" },
      {
        name: "description",
        content:
          "Simple pricing for founders. Validate ideas for free or go unlimited with Pro.",
      },
    ],
  }),
  component: Pricing,
});

const TIERS = [
  {
    name: "Free",
    price: "₹0",
    period: "/forever",
    desc: "Try it. No credit card. See if it's for you.",
    icon: <Zap className="h-5 w-5" />,
    features: [
      "2 validations per month",
      "Full AI market report",
      "All 7 report sections",
      "Web view only",
    ],
    missing: ["PDF export", "Saved history", "Priority AI"],
    cta: "Start free",
    plan: "free" as const,
    featured: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    desc: "For serious founders shipping fast.",
    icon: <Zap className="h-5 w-5 fill-current" />,
    features: [
      "Unlimited validations",
      "PDF export",
      "Saved history (30 reports)",
      "Priority AI model",
      "All Free features",
    ],
    missing: ["Team access", "API access"],
    cta: "Go Pro",
    plan: "pro" as const,
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Startup",
    price: "₹1,499",
    period: "/month",
    desc: "For teams, accelerators, and cohorts.",
    icon: <Users className="h-5 w-5" />,
    features: [
      "Everything in Pro",
      "Team access (5 seats)",
      "API access",
      "Priority support (2h SLA)",
      "Custom branding on reports",
    ],
    missing: [],
    cta: "Get Startup",
    plan: "startup" as const,
    featured: false,
    badge: null,
  },
];

const FAQ = [
  {
    q: "Is the free tier actually free?",
    a: "Yes. 2 full validations per month, no credit card required. If you hit the limit, either wait for next month or upgrade.",
  },
  {
    q: "How accurate are the reports?",
    a: "Claude searches the web in real time for each validation. Reports include real competitor data, market sizing, and India-specific context. They're directionally accurate — always pair with your own research.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. No questions asked.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes! Email us with your college ID for a 50% discount on Pro. Built by a student, for students.",
  },
];

function Pricing() {
  const { plan: currentPlan, isLoading: subLoading } = useSubscription();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1 mx-auto w-full max-w-6xl px-5 py-16">
        {/* Banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Globe className="h-4 w-4" />
            Built by a student, priced for founders 🇮🇳
          </div>
        </div>

        {/* Current plan badge */}
        {!subLoading && currentPlan !== "free" && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-glow-sm">
              <Crown className="h-4 w-4" />
              You&apos;re on the{" "}
              <span className="capitalize">{currentPlan}</span> plan
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple pricing.
            <br />
            <span className="text-gradient-emerald">No surprises.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Validate your first 2 ideas for free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              currentPlan={currentPlan}
            />
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Full comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-surface/60">
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Feature</th>
                  {TIERS.map((t) => (
                    <th key={t.name} className={`px-6 py-4 font-semibold ${t.featured ? "text-primary" : "text-foreground"}`}>
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Validations/month", vals: ["2", "Unlimited", "Unlimited"] },
                  { label: "Full AI report", vals: ["✅", "✅", "✅"] },
                  { label: "PDF export", vals: ["❌", "✅", "✅"] },
                  { label: "Saved history", vals: ["❌", "30 reports", "Unlimited"] },
                  { label: "Priority AI model", vals: ["❌", "✅", "✅"] },
                  { label: "Team access", vals: ["❌", "❌", "5 seats"] },
                  { label: "API access", vals: ["❌", "❌", "✅"] },
                  { label: "Support", vals: ["Community", "Email", "2h SLA"] },
                ].map((row, i) => (
                  <tr key={row.label} className={`border-b border-border/40 ${i % 2 === 0 ? "bg-surface/20" : ""}`}>
                    <td className="px-6 py-3.5 text-muted-foreground font-medium">{row.label}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className={`px-6 py-3.5 text-center ${TIERS[j].featured ? "text-foreground" : "text-muted-foreground"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently asked</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-border/60 bg-surface p-6"
              >
                <h3 className="font-semibold text-base mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Still unsure? Start free — no card needed.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-6 py-3 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow transition-all"
          >
            Try it free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// ── PricingCard ───────────────────────────────────────────────────────────────

function PricingCard({
  tier,
  currentPlan,
}: {
  tier: (typeof TIERS)[number];
  currentPlan: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isCurrentPlan = currentPlan === tier.plan;

  const handleUpgrade = async () => {
    // Free tier — just go to app
    if (tier.plan === "free") {
      navigate({ to: "/app" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check auth first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        // Not logged in — go to login first
        navigate({ to: "/login" });
        return;
      }

      const { user } = sessionData.session;

      const result = await startCheckout({
        data: {
          userId: user.id,
          email: user.email ?? "",
          plan: tier.plan as "pro" | "startup",
        },
      });

      // Redirect browser to Stripe Checkout
      window.location.href = result.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // Check if it's a config error (keys not set yet)
      if (msg.includes("not configured") || msg.includes("placeholder")) {
        setError("Stripe keys not set yet — add them to .env.local to enable payments.");
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 ${
        tier.featured
          ? "border-primary/40 bg-surface shadow-glow"
          : "border-border/60 bg-surface"
      }`}
    >
      {tier.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-emerald px-4 py-1 text-xs font-bold text-background shadow-glow-sm">
          {tier.badge}
        </span>
      )}

      {/* Current plan indicator */}
      {isCurrentPlan && (
        <span className="absolute -top-3.5 right-4 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-xs font-semibold text-primary">
          Your plan
        </span>
      )}

      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${
          tier.featured
            ? "bg-gradient-emerald text-background"
            : "bg-surface-elevated text-primary"
        }`}
      >
        {tier.icon}
      </div>

      <h3 className="text-xl font-bold">{tier.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-black">{tier.price}</span>
        <span className="text-sm text-muted-foreground">{tier.period}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>

      <ul className="mt-6 space-y-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0" />
            <span>{f}</span>
          </li>
        ))}
        {tier.missing.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground/40">
            <span className="h-4 w-4 shrink-0 text-center text-xs">—</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}

      <button
        id={`upgrade-${tier.plan}-btn`}
        onClick={handleUpgrade}
        disabled={loading || isCurrentPlan}
        className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed ${
          isCurrentPlan
            ? "border border-primary/30 bg-primary/10 text-primary cursor-default"
            : tier.featured
            ? "bg-gradient-emerald text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow disabled:opacity-50"
            : "border border-border/60 bg-background hover:border-primary/40 hover:text-primary disabled:opacity-50"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : isCurrentPlan ? (
          <>
            <Check className="h-4 w-4" /> Current plan
          </>
        ) : (
          <>
            {tier.cta} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
