import { Check } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-emerald text-primary-foreground">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="font-display font-semibold text-foreground">BeforeYouBuild</span>
          <span className="ml-2">© {new Date().getFullYear()}</span>
        </div>
        <p>Built by a student, priced for founders.</p>
      </div>
    </footer>
  );
}
