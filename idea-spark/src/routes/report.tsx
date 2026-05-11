import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Share2, Check, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "Your Validation Report — BeforeYouBuild" }] }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-6 py-12 flex-1 space-y-10">
        {/* Verdict banner */}
        <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-surface p-8 shadow-glow">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <Flame className="h-3.5 w-3.5" /> HOT IDEA
              </span>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Strong demand, weak incumbents, perfect timing.</h1>
              <p className="mt-2 text-muted-foreground">Your idea sits in a fragmented ₹40B+ market with no dominant player.</p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-md border border-border/80 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-primary" /> Validated by BeforeYouBuild
            </span>
          </div>
        </section>

        {/* Scores */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreCard label="Market Size" score={8} />
          <ScoreCard label="Competition" score={7} />
          <ScoreCard label="Timing" score={9} />
          <ScoreCard label="Buildability" score={8} />
        </section>

        <Section title="A. The Problem">
          <P><b>What pain this solves:</b> Kirana store owners lose 8–12% of monthly revenue to stockouts and dead inventory because they track stock on paper.</P>
          <P><b>Who feels it daily:</b> Rajesh, 42, runs a kirana in Indore. Every evening he manually tallies notebook entries and forgets which SKUs are running low.</P>
          <P><b>Current solutions:</b> Notebook + memory, or Khatabook (which doesn't track inventory).</P>
        </Section>

        <Section title="B. Ideal Customer">
          <P><b>Profile:</b> Owners of single-store kiranas/groceries doing ₹2–8L/month.</P>
          <P><b>Online hangouts:</b> WhatsApp distributor groups, Facebook kirana communities, regional YouTube.</P>
          <P><b>Currently uses:</b> Paper register, basic Excel, sometimes Vyapar.</P>
          <P><b>Why current solutions suck:</b> Too generic, not WhatsApp-native, English-only UIs.</P>
        </Section>

        <Section title="C. Market Size">
          <div className="grid md:grid-cols-3 gap-4">
            <Stat label="TAM" value="₹40,000 Cr" sub="13M kirana stores in India" />
            <Stat label="SAM" value="₹6,000 Cr" sub="2M digitally-active stores" />
            <Stat label="SOM" value="₹120 Cr" sub="40K reachable in 24 months" />
          </div>
          <P className="mt-4"><b>India context:</b> Post-UPI, kiranas are digitally fluent on WhatsApp but underserved by SaaS.</P>
        </Section>

        <Section title="D. Top 3 Competitors">
          <CompRow name="Vyapar" what="Billing + inventory desktop/app" weakness="Not WhatsApp-native, learning curve" />
          <CompRow name="Khatabook" what="Ledger / khata tracking" weakness="No inventory, no SKU intelligence" />
          <CompRow name="Dukaan" what="D2C storefront builder" weakness="Targets online sellers, not in-store ops" />
          <P className="mt-3"><b>Your unfair advantage:</b> Conversational WhatsApp UX in Hindi + voice notes.</P>
        </Section>

        <Section title="E. How to Build the MVP">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-primary shrink-0" /> WhatsApp Business API + Twilio for messaging</li>
            <li className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Add/remove stock by typing or voice note</li>
            <li className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Daily low-stock summary at 8pm</li>
          </ul>
          <P className="mt-3 text-muted-foreground">Stack: Supabase + Node + WhatsApp Cloud API. Estimated build time: 3 weeks.</P>
        </Section>

        <Section title="F. How to Get Your First 100 Users">
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Walk into 50 kiranas in your city. Onboard 10 in person.</li>
            <li>Post a 60-sec Hindi demo on Instagram Reels & YouTube Shorts.</li>
            <li>Join 20 WhatsApp distributor groups; share value-first content.</li>
            <li>Partner with 2 local FMCG distributors for referral.</li>
            <li>Run a ₹0 onboarding offer for 30 days, capped at 100 stores.</li>
          </ol>
        </Section>

        <Section title="G. Final Verdict">
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
            <div className="text-2xl font-bold text-primary">GO ✅</div>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>• Massive underserved segment with high willingness to pay.</li>
              <li>• No incumbent owns the WhatsApp-native angle.</li>
              <li>• Buildable solo in under a month.</li>
            </ul>
          </div>
        </Section>

        {/* Share */}
        <section className="rounded-2xl border border-border/80 bg-surface p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-soft">
          <div>
            <h3 className="text-lg font-semibold">Share your validation report</h3>
            <p className="text-sm text-muted-foreground">Carries the "Validated by BeforeYouBuild" watermark.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition">
            <Share2 className="h-4 w-4" /> Get shareable link
          </button>
        </section>

        <div className="text-center">
          <Link to="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            Validate another idea <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gradient-emerald">{score}</span>
        <span className="text-sm text-muted-foreground">/10</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-background overflow-hidden">
        <div className="h-full bg-gradient-emerald" style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-surface p-6 shadow-soft">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-foreground/90 ${className}`}>{children}</p>;
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-background/40 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function CompRow({ name, what, weakness }: { name: string; what: string; weakness: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground">{what}</div>
      </div>
      <div className="text-sm text-warning">Weakness: {weakness}</div>
    </div>
  );
}
