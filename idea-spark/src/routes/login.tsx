import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — BeforeYouBuild" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 grid place-items-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-surface p-8 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-emerald text-primary-foreground shadow-glow">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <span className="font-display text-lg font-bold">BeforeYouBuild</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Sign in to validate</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free tier. No credit card.</p>

          <button className="mt-6 w-full rounded-lg border border-border bg-background py-2.5 text-sm font-medium hover:border-primary/40 transition">
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-3">
            <input type="email" placeholder="you@example.com" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60" />
            <button type="button" className="w-full rounded-lg bg-gradient-emerald py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition">
              Send magic link
            </button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            By continuing you agree to our terms. <Link to="/" className="text-primary hover:underline">Back home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
