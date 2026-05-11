import { Link, useRouterState } from "@tanstack/react-router";
import { Check, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouterState();
  const path = router.location.pathname;

  const navLinks = [
    { to: "/", hash: "how", label: "How it works" },
    { to: "/pricing", hash: "", label: "Pricing" },
    { to: "/login", hash: "", label: "Login" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-emerald text-background shadow-glow-sm animate-pulse-glow">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <span>
            Before<span className="text-gradient-emerald">You</span>Build
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash || undefined}
              className={`transition-colors hover:text-foreground ${
                path === link.to && link.to !== "/"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-gradient-emerald px-4 py-2 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 transition-all hover:shadow-glow"
          >
            Validate Idea
          </Link>
          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-surface/95 backdrop-blur px-5 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash || undefined}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/app"
            onClick={() => setMobileOpen(false)}
            className="block w-full rounded-lg bg-gradient-emerald px-4 py-2.5 text-center text-sm font-semibold text-background shadow-glow-sm"
          >
            Validate Idea →
          </Link>
        </div>
      )}
    </header>
  );
}
