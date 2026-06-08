import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Flame, AlertTriangle, XCircle, Clock, Trash2,
  Share2, Check, Plus, Lock, History,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase, getUserReports, deleteReport, type SavedReport } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "My Reports — BeforeYouBuild" },
      { name: "description", content: "Your saved idea validation reports." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { isPaid, isLoading: subLoading } = useSubscription();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      setLoggedIn(!!uid);
      if (uid) {
        const list = await getUserReports(uid, isPaid ? 30 : 5);
        setReports(list);
      }
      setLoading(false);
    });
  }, [isPaid]);

  // Not logged in
  if (!loading && !loggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center px-5 py-16">
          <div className="max-w-md w-full text-center animate-fade-up">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-surface border border-border/60 flex items-center justify-center">
                <History className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-black mb-3">Your report history</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to see all your saved validation reports and shareable links.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-6 py-3 text-sm font-bold text-background shadow-glow-sm hover:opacity-90 transition-all"
            >
              Sign in to view history
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-5 py-12 flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Reports</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {loading ? "Loading…" : `${reports.length} idea${reports.length !== 1 ? "s" : ""} validated`}
            </p>
          </div>
          <Link
            to="/app"
            id="new-validation-btn"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-4 py-2.5 text-sm font-semibold text-background shadow-glow-sm hover:opacity-90 hover:shadow-glow transition-all"
          >
            <Plus className="h-4 w-4" /> New validation
          </Link>
        </div>

        {/* Free tier limit banner */}
        {!subLoading && !isPaid && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">Free plan: last 5 reports shown</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upgrade to Pro to unlock full history (30 reports) + PDF export.
                </p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-gradient-emerald px-4 py-2 text-xs font-bold text-background shadow-glow-sm hover:opacity-90 transition-all"
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border/40 bg-surface p-5 animate-pulse">
                <div className="h-4 bg-muted-foreground/10 rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted-foreground/10 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="text-center py-20 animate-fade-up">
            <div className="flex justify-center mb-5">
              <div className="h-20 w-20 rounded-2xl bg-surface border border-border/60 flex items-center justify-center">
                <History className="h-10 w-10 text-muted-foreground/40" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">No validations yet</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Validate your first idea — it takes 60 seconds.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-6 py-3 text-sm font-bold text-background shadow-glow-sm hover:opacity-90 transition-all"
            >
              <Plus className="h-4 w-4" /> Validate an idea
            </Link>
          </div>
        )}

        {/* Report list */}
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onDelete={async () => {
                  await deleteReport(r.id);
                  setReports((prev) => prev.filter((x) => x.id !== r.id));
                }}
              />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

// ── ReportCard ────────────────────────────────────────────────────────────────

function ReportCard({
  report,
  onDelete,
}: {
  report: SavedReport;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/report/${report.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const verdictIcon = {
    HOT: <Flame className="h-4 w-4 text-primary" />,
    CAUTION: <AlertTriangle className="h-4 w-4 text-warning" />,
    DEAD: <XCircle className="h-4 w-4 text-destructive" />,
  }[report.verdict];

  const verdictLabel = {
    HOT: "text-primary bg-primary/10 border-primary/20",
    CAUTION: "text-warning bg-warning/10 border-warning/20",
    DEAD: "text-destructive bg-destructive/10 border-destructive/20",
  }[report.verdict];

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
  };

  return (
    <div className="group rounded-2xl border border-border/60 bg-surface p-5 shadow-card hover:border-primary/30 hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Left: idea + meta */}
        <div className="flex-1 min-w-0">
          <Link
            to="/report/$id"
            params={{ id: report.id }}
            className="block"
          >
            <p className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {report.idea}
            </p>
          </Link>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {/* Verdict badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${verdictLabel}`}>
              {verdictIcon} {report.verdict}
            </span>
            {/* Time */}
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {timeAgo(report.created_at)}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Share */}
          <button
            onClick={handleCopy}
            title="Copy shareable link"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 bg-background hover:border-primary/40 hover:text-primary transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
          {/* Delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onDelete}
                className="text-xs text-destructive border border-destructive/30 bg-destructive/10 rounded-lg px-2 py-1 hover:bg-destructive/20 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-muted-foreground rounded-lg px-2 py-1 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete report"
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 bg-background hover:border-destructive/40 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Shareable link row */}
      <div
        onClick={handleCopy}
        className="mt-3 cursor-pointer rounded-lg border border-border/30 bg-background/40 px-3 py-2 text-xs text-muted-foreground/60 hover:text-muted-foreground hover:border-primary/20 transition-colors truncate"
      >
        {shareUrl}
      </div>
    </div>
  );
}
