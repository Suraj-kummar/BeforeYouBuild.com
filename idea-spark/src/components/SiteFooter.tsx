import { Link } from "@tanstack/react-router";
import { Twitter, Github, ArrowRight } from "lucide-react";
import { useState } from "react";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Cosmetic only — no backend needed
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto max-w-6xl px-5 py-12">

        {/* Newsletter row */}
        <div className="mb-10 rounded-2xl border border-border/50 bg-surface/60 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-sm text-foreground">
              🚀 Get weekly founder tips
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Market insights, validation frameworks, and real startup teardowns.
            </p>
          </div>
          {subscribed ? (
            <p className="text-sm text-primary font-semibold animate-fade-up">
              ✅ You're in! Watch your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                id="footer-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="flex-1 md:w-56 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
              />
              <button
                type="submit"
                id="footer-subscribe-btn"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-emerald px-4 py-2 text-xs font-semibold text-background shadow-glow-sm hover:opacity-90 transition-all whitespace-nowrap"
              >
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/">
              <img
                src="/logo.png"
                alt="BeforeYouBuild"
                className="h-7 w-auto object-contain"
                style={{ maxWidth: 180 }}
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered market validation for startup founders. Know before you build.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Built by a student, priced for founders. 🇮🇳
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <p className="font-medium text-foreground">Product</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/" hash="how" className="hover:text-foreground transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="hover:text-foreground transition-colors">
                    Validate idea
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-foreground">Company</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/login" className="hover:text-foreground transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BeforeYouBuild. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="h-8 w-8 grid place-items-center rounded-lg border border-border/40 hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com/Suraj-kummar"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="h-8 w-8 grid place-items-center rounded-lg border border-border/40 hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
