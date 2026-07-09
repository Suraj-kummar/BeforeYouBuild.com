import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouterState();
  const path = router.location.pathname;

  // Detect scroll for stronger glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", hash: "how", label: "How it works" },
    { to: "/pricing", hash: "", label: "Pricing" },
    { to: "/history", hash: "", label: "My Reports" },
    { to: "/login", hash: "", label: "Login" },
  ];

  const isActive = (linkTo: string) => {
    if (linkTo === "/") return false; // "How it works" is a hash link, never "active"
    return path === linkTo || path.startsWith(linkTo + "/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/40 glass print:hidden transition-all duration-300 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="BeforeYouBuild"
            className="h-8 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
            style={{ maxWidth: 200 }}
            onError={(e) => {
              // Fallback if logo fails to load
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.style.display = "flex";
            }}
          />
          {/* Text fallback */}
          <span
            className="hidden items-center gap-1.5 font-bold text-base tracking-tight"
            style={{ display: "none" }}
          >
            <span className="text-foreground">BeforeYou</span>
            <span className="text-primary">Build</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash || undefined}
              className={`relative pb-[2px] transition-colors hover:text-foreground ${
                isActive(link.to)
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
              {/* Active underline indicator */}
              {isActive(link.to) && (
                <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-gradient-emerald rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className={`hidden md:inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              path === "/app"
                ? "bg-primary/15 border border-primary/40 text-primary"
                : "bg-gradient-emerald text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow"
            }`}
          >
            Validate Idea
          </Link>
          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-surface/95 backdrop-blur px-5 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash || undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              {isActive(link.to) && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              )}
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border/40 mt-2">
            <Link
              to="/app"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-lg bg-gradient-emerald px-4 py-2.5 text-center text-sm font-semibold text-background shadow-glow-sm"
            >
              Validate Idea →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
