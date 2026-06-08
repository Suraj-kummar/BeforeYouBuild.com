import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Guard against missing env vars in development
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[BeforeYouBuild] Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-key"
);

export type AuthUser = Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"];

export type PlanId = "free" | "pro" | "startup";

export interface Subscription {
  plan: PlanId;
  status: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/app`,
    },
  });
  if (error) throw error;
}

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/app`,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ── Subscription helpers ──────────────────────────────────────────────────────

/**
 * Fetch the current user's subscription from Supabase.
 * Returns a default free-tier object if none exists.
 */
export async function getUserSubscription(userId: string): Promise<Subscription> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, stripe_customer_id, stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[BeforeYouBuild] Could not fetch subscription:", error.message);
  }

  // Default to free if no record found
  return data ?? {
    plan: "free" as PlanId,
    status: "active",
    current_period_end: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
  };
}

// ── Usage tracking helpers ────────────────────────────────────────────────────

const FREE_TIER_LIMIT = 2;

/**
 * Returns how many validations the user has used in the current calendar month.
 */
export async function getMonthlyUsageCount(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("validation_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("used_at", startOfMonth.toISOString());

  if (error) {
    console.warn("[BeforeYouBuild] Could not fetch usage:", error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * Records one validation usage event for the user.
 */
export async function recordValidationUsage(userId: string): Promise<void> {
  const { error } = await supabase
    .from("validation_usage")
    .insert({ user_id: userId });

  if (error) {
    console.warn("[BeforeYouBuild] Could not record usage:", error.message);
  }
}

/**
 * Returns true if a free-tier user has exceeded their monthly limit.
 */
export async function hasExceededFreeLimit(userId: string): Promise<boolean> {
  const count = await getMonthlyUsageCount(userId);
  return count >= FREE_TIER_LIMIT;
}

export { FREE_TIER_LIMIT };

// ── Report save / history helpers ─────────────────────────────────────────────

export interface SavedReport {
  id: string;
  idea: string;
  verdict: "HOT" | "CAUTION" | "DEAD";
  created_at: string;
  is_public: boolean;
}

export interface SavedReportFull extends SavedReport {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: any;
}

/**
 * Save a validation report to Supabase and return its shareable ID.
 */
export async function saveReport(
  userId: string,
  idea: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: any,
  verdict: "HOT" | "CAUTION" | "DEAD"
): Promise<string | null> {
  const { data, error } = await supabase
    .from("reports")
    .insert({ user_id: userId, idea, report, verdict, is_public: true })
    .select("id")
    .single();

  if (error) {
    console.warn("[BeforeYouBuild] Could not save report:", error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Fetch a single public report by ID (for shareable links — no auth needed).
 */
export async function getReportById(id: string): Promise<SavedReportFull | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("id, idea, verdict, report, created_at, is_public")
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    console.warn("[BeforeYouBuild] Could not fetch report:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch a user's report history (max 30, newest first).
 */
export async function getUserReports(
  userId: string,
  limit = 30
): Promise<SavedReport[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("id, idea, verdict, created_at, is_public")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[BeforeYouBuild] Could not fetch reports:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Delete a report (only the owner can do this via RLS).
 */
export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) {
    console.warn("[BeforeYouBuild] Could not delete report:", error.message);
  }
}

