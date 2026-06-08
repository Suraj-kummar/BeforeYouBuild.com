import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/checkout/cancel")({
  head: () => ({
    meta: [
      { title: "Checkout Cancelled — BeforeYouBuild" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutCancel,
});

function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-lg w-full text-center animate-fade-up">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-surface border border-border/60 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            No worries — you&apos;re still on Free
          </h1>
          <p className="text-muted-foreground text-base mb-8 leading-relaxed max-w-sm mx-auto">
            You cancelled before completing payment. Your account is unchanged and
            you still have access to your free validations.
          </p>

          {/* Reminder card */}
          <div className="rounded-2xl border border-border/60 bg-surface p-6 mb-8 text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              What you&apos;d get on Pro
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "Unlimited idea validations",
                "PDF export for every report",
                "Saved report history",
                "Priority Claude AI model",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-primary">→</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground/60">
              Only ₹499/month. Cancel anytime.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pricing"
              id="retry-upgrade-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-6 py-3 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow transition-all"
            >
              Try again <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/app"
              id="back-to-app-btn"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-6 py-3 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back to app
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
