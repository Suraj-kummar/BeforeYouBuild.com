import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Search, Target, TrendingUp, Flame, AlertTriangle, XCircle } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeforeYouBuild — Validate your startup idea in 60 seconds" },
      { name: "description", content: "AI-powered market research for founders. Know if your startup idea is worth building before you write a single line of code." },
      { property: "og:title", content: "BeforeYouBuild — Validate your startup idea in 60 seconds" },
      { property: "og:description", content: "Stop wasting months on ideas nobody wants. Get an AI market validation report instantly." },
    ],
  }),
  component: Landing,
});

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
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered market validation
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tighter">
            Know if your startup idea is{" "}
            <span className="text-gradient-emerald">worth building</span>.
            <br />
            In 60 seconds.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Stop wasting months on ideas nobody wants. Get an AI-powered market
            validation report before you write a single line of code.
          </p>

          <form onSubmit={submit} className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-border/80 bg-surface/80 p-2 shadow-soft backdrop-blur focus-within:border-primary/60 focus-within:shadow-glow transition">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your startup idea..."
                rows={3}
                className="w-full resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground/70"
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-xs text-muted-foreground">Be specific. The sharper the idea, the sharper the report.</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition"
                >
                  Validate My Idea <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Join <span className="text-foreground font-medium">500+ founders</span> who validated before building.
          </p>
        </div>
      </section>

      {/* Sample reports */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sample validation reports</h2>
          <p className="mt-3 text-muted-foreground">Honest verdicts. Real data. No fluff.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <SampleCard
            verdict="hot"
            title="WhatsApp inventory for kirana stores"
            line="₹40B+ TAM in India, fragmented competition, perfect timing post-UPI."
          />
          <SampleCard
            verdict="caution"
            title="Another food delivery app for tier-2"
            line="Saturated category. Survivable only with sharp niche + capital."
          />
          <SampleCard
            verdict="dead"
            title="Generic AI resume builder"
            line="50+ free tools. Zero defensibility. Don't build this."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-6xl px-6 py-20 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-3 text-muted-foreground">From idea to verdict in under a minute.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Step n="01" icon={<Search className="h-5 w-5" />} title="Describe your idea" desc="One paragraph. The clearer, the better." />
          <Step n="02" icon={<TrendingUp className="h-5 w-5" />} title="AI researches the market" desc="Web search, competitors, market sizing, timing." />
          <Step n="03" icon={<Target className="h-5 w-5" />} title="Get your verdict" desc="HOT, CAUTION, or DEAD — with the receipts." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface p-10 text-center shadow-soft">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Don't build the wrong thing.</h3>
            <p className="mt-3 text-muted-foreground">Validate first. Build second. Win sooner.</p>
            <Link
              to="/app"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition"
            >
              Validate your idea now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SampleCard({ verdict, title, line }: { verdict: "hot" | "caution" | "dead"; title: string; line: string }) {
  const map = {
    hot: { label: "HOT IDEA", icon: <Flame className="h-4 w-4" />, cls: "bg-primary/15 text-primary border-primary/30" },
    caution: { label: "PROCEED WITH CAUTION", icon: <AlertTriangle className="h-4 w-4" />, cls: "bg-warning/15 text-warning border-warning/30" },
    dead: { label: "DEAD ON ARRIVAL", icon: <XCircle className="h-4 w-4" />, cls: "bg-destructive/15 text-destructive border-destructive/30" },
  }[verdict];
  return (
    <div className="group rounded-2xl border border-border/80 bg-surface p-6 shadow-soft hover:border-primary/40 transition">
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${map.cls}`}>
        {map.icon} {map.label}
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{line}</p>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[7, 6, 8, 9].map((s, i) => (
          <div key={i} className="rounded-md bg-background/60 border border-border/60 py-2 text-center">
            <div className="text-xs text-muted-foreground">{["Mkt", "Comp", "Time", "Build"][i]}</div>
            <div className="text-sm font-semibold">{s}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step({ n, icon, title, desc }: { n: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">{icon}</span>
        <span className="font-mono text-xs text-muted-foreground">{n}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
