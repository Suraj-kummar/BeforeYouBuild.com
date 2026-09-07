// Checkout success page - confirms subscription and redirects to app
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "You're on Pro! â€” BeforeYouBuild" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) ?? "",
  }),
  component: CheckoutSuccess,
});

// Simple confetti particle
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="confetti-particle" style={style} />;
}

function CheckoutSuccess() {
  const { session_id } = useSearch({ from: "/checkout/success" });
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Generate confetti particles
    const colors = ["#10B981", "#34D399", "#6EE7B7", "#FBBF24", "#A78BFA", "#60A5FA"];
    const generated = Array.from({ length: 40 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60 - 10}%`,
      backgroundColor: colors[i % colors.length],
      width: `${Math.random() * 8 + 4}px`,
      height: `${Math.random() * 8 + 4}px`,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      animationDelay: `${Math.random() * 1.5}s`,
      animationDuration: `${Math.random() * 1 + 1.5}s`,
    }));
    setParticles(generated);
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <SiteNav />

      {/* Confetti layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-16">
        <div
          className={`max-w-lg w-full text-center transition-all duration-700 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center shadow-glow animate-pulse-glow">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            You&apos;re on{" "}
            <span className="text-gradient-emerald">Pro! ðŸŽ‰</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Unlimited validations, PDF exports, and priority AI are now unlocked.
            Go validate your next big idea.
          </p>

          {/* What's unlocked */}
          <div className="rounded-2xl border border-primary/30 bg-surface p-6 mb-8 text-left shadow-glow">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4" /> What&apos;s now unlocked
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "âœ… Unlimited idea validations",
                "âœ… PDF export for every report",
                "âœ… Saved report history (30 reports)",
                "âœ… Priority Claude AI model",
                "âœ… Email support",
              ].map((item) => (
                <li key={item} className="text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            to="/app"
            id="go-validate-btn"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-8 py-4 text-base font-bold text-background shadow-glow hover:opacity-90 hover:shadow-glow-lg transition-all duration-200"
          >
            Start validating <ArrowRight className="h-5 w-5" />
          </Link>

          {session_id && (
            <p className="mt-4 text-xs text-muted-foreground/50">
              Order ID: {session_id.slice(0, 20)}â€¦
            </p>
          )}
        </div>
      </main>

      <SiteFooter />

      <style>{`
        .confetti-particle {
          position: absolute;
          animation: confetti-fall linear forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

