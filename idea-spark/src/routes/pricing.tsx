import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BeforeYouBuild" },
      { name: "description", content: "Simple pricing for founders. Free, Pro, and Startup plans." },
    ],
  }),
  component: Pricing,
});

const tiers = [
  { name: "Free", price: "₹0", period: "/forever", desc: "Try it. See if it's for you.", features: ["2 validations / month", "Full report", "Web view only"], cta: "Start free", featured: false },
  { name: "Pro", price: "₹499", period: "/month", desc: "For serious founders shipping fast.", features: ["Unlimited validations", "PDF export", "Saved history", "Priority AI model"], cta: "Go Pro", featured: true },
  { name: "Startup", price: "₹1,499", period: "/month", desc: "For teams and accelerators.", features: ["Everything in Pro", "Team access (5 seats)", "Priority support", "API access"], cta: "Contact us", featured: false },
];

function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-6 py-16 flex-1">
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary text-center mb-10 inline-block mx-auto">
          Built by a student, priced for founders.
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground text-center">Validate more, build smarter.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-7 shadow-soft ${t.featured ? "border-primary/50 bg-surface shadow-glow" : "border-border/80 bg-surface"}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-emerald px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link
                to="/login"
                className={`mt-7 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${t.featured ? "bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-95" : "border border-border bg-background hover:border-primary/40"}`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
