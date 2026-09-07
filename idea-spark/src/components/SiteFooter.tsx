import { Link } from "@tanstack/react-router";
import { Twitter, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/">
              <img src="/logo.png" alt="BeforeYouBuild" className="h-7 w-auto object-contain" style={{ maxWidth: 180 }} />
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
                <li><Link to="/" hash="how" className="hover:text-foreground transition-colors">How it works</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Validate idea</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-foreground">Company</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground transition-colors">Sign in</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BeforeYouBuild. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://github.com/Suraj-kummar" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
