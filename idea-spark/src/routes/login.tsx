import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { signInWithGoogle, signInWithEmail } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — BeforeYouBuild" },
      {
        name: "description",
        content: "Sign in to validate your startup ideas and access your reports.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoadingGoogle(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoadingEmail(true);
    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link.");
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNav />

      <main className="flex-1 grid place-items-center px-5 py-16">
        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0 bg-hero-glow opacity-50" />

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-border/60 bg-surface p-8 shadow-soft">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-emerald text-background shadow-glow-sm">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="font-display text-lg font-bold">
                Before<span className="text-gradient-emerald">You</span>Build
              </span>
            </div>

            {sent ? (
              /* ── Magic link sent ── */
              <div className="text-center py-4">
                <div className="text-5xl mb-4">📬</div>
                <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a magic link to{" "}
                  <span className="text-foreground font-medium">{email}</span>.
                  Click it to sign in — no password needed.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">Sign in to validate</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Free tier — 2 validations/month. No credit card.
                </p>

                {/* Google */}
                <button
                  id="google-signin-btn"
                  onClick={handleGoogle}
                  disabled={loadingGoogle || loadingEmail}
                  className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-background py-3 text-sm font-medium hover:border-primary/30 hover:bg-surface transition-all disabled:opacity-50"
                >
                  {loadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                {/* Email magic link */}
                <form onSubmit={handleEmail} className="space-y-3">
                  <div>
                    <label htmlFor="email-input" className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Email address
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <button
                    id="magic-link-btn"
                    type="submit"
                    disabled={loadingEmail || loadingGoogle || !email.trim()}
                    className="w-full rounded-xl bg-gradient-emerald py-3 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow disabled:opacity-40 transition-all"
                  >
                    {loadingEmail ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </span>
                    ) : (
                      "Send magic link →"
                    )}
                  </button>
                </form>

                {/* Error */}
                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                {/* Footer note */}
                <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
                  By continuing you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </>
            )}
          </div>

          {/* Back home */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
