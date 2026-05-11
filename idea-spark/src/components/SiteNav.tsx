import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-emerald text-primary-foreground shadow-glow">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          BeforeYouBuild
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" hash="how" className="hover:text-foreground transition-colors">How it works</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
        </nav>
        <Link
          to="/app"
          className="hidden md:inline-flex items-center rounded-md bg-gradient-emerald px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition"
        >
          Validate Idea
        </Link>
      </div>
    </header>
  );
}
