import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Validate — BeforeYouBuild" }] }),
  component: AppPage,
});

const STEPS = [
  "Searching the web...",
  "Analyzing competitors...",
  "Estimating market size...",
  "Generating your report...",
];

function AppPage() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem("byb:idea");
    if (saved) setIdea(saved);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStep((s) => (s < STEPS.length - 1 ? s + 1 : s)), 1200);
    return () => clearInterval(t);
  }, [loading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setStep(0);
    sessionStorage.setItem("byb:idea", idea);
    // Simulate processing then go to report (AI wiring comes later)
    setTimeout(() => navigate({ to: "/report" }), 5200);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl px-6 py-16 flex-1">
        <h1 className="text-4xl font-bold tracking-tight">Validate your idea</h1>
        <p className="mt-2 text-muted-foreground">Be specific. Mention the user, the pain, and the channel.</p>

        <form onSubmit={submit} className="mt-8">
          <div className="rounded-2xl border border-border/80 bg-surface p-2 shadow-soft focus-within:border-primary/60 focus-within:shadow-glow transition">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={loading}
              placeholder="E.g. An app that helps small restaurant owners in India manage their inventory using WhatsApp"
              rows={6}
              className="w-full resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground/70 disabled:opacity-60"
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-xs text-muted-foreground">{idea.length} characters</span>
              <button
                type="submit"
                disabled={loading || !idea.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-50 transition"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Validating...</> : <>Validate Now <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </form>

        {loading && (
          <div className="mt-10 rounded-2xl border border-border/80 bg-surface p-6 shadow-soft">
            <ul className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className={`grid h-6 w-6 place-items-center rounded-full border ${i < step ? "bg-primary/20 border-primary text-primary" : i === step ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                    {i < step ? "✓" : i === step ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
                  </span>
                  <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
