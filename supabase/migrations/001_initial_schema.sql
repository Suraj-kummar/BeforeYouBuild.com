-- ============================================================
-- BeforeYouBuild.com — Supabase Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Enable UUID extension ────────────────────────────────────
create extension if not exists "pgcrypto";

-- ══════════════════════════════════════════════════════════════
-- TABLE: subscriptions
-- Tracks each user's Stripe subscription status.
-- One row per user. Upserted by the Stripe webhook handler.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  plan                    text not null default 'free'
                            check (plan in ('free', 'pro', 'startup')),
  status                  text not null default 'active'
                            check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint subscriptions_user_id_key unique (user_id)
);

-- Index for fast user lookups
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions(stripe_subscription_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- ── RLS for subscriptions ────────────────────────────────────
alter table public.subscriptions enable row level security;

-- Users can read their own subscription
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Service role (webhook) can upsert anything
-- (No insert/update policy needed for anon/user — handled via service role key)


-- ══════════════════════════════════════════════════════════════
-- TABLE: reports
-- Stores saved validation reports for history + shareable links.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  idea        text not null,
  verdict     text not null check (verdict in ('HOT', 'CAUTION', 'DEAD')),
  report      jsonb not null,
  is_public   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Index for user history fetches
create index if not exists reports_user_id_idx on public.reports(user_id);
create index if not exists reports_created_at_idx on public.reports(created_at desc);
-- Index for public shareable link lookups
create index if not exists reports_public_idx on public.reports(id) where is_public = true;

-- ── RLS for reports ──────────────────────────────────────────
alter table public.reports enable row level security;

-- Anyone can read public reports (for shareable links — no login needed)
create policy "Anyone can view public reports"
  on public.reports for select
  using (is_public = true);

-- Users can read all their own reports (including private ones)
create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = user_id);

-- Users can insert their own reports
create policy "Users can insert own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

-- Users can delete their own reports
create policy "Users can delete own reports"
  on public.reports for delete
  using (auth.uid() = user_id);

-- Users can update their own reports (e.g. toggle is_public)
create policy "Users can update own reports"
  on public.reports for update
  using (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════
-- TABLE: validation_usage
-- Tracks monthly validation usage for free-tier limits.
-- Free tier = 2 validations per calendar month.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.validation_usage (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  used_at   timestamptz not null default now()
);

-- Index for monthly count queries
create index if not exists validation_usage_user_id_idx on public.validation_usage(user_id);
create index if not exists validation_usage_used_at_idx on public.validation_usage(used_at);
-- Composite index for the exact query pattern used in the app
create index if not exists validation_usage_user_month_idx
  on public.validation_usage(user_id, used_at desc);

-- ── RLS for validation_usage ─────────────────────────────────
alter table public.validation_usage enable row level security;

-- Users can view their own usage
create policy "Users can view own usage"
  on public.validation_usage for select
  using (auth.uid() = user_id);

-- Users can insert their own usage events
create policy "Users can insert own usage"
  on public.validation_usage for insert
  with check (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════
-- DONE ✅
-- Tables created:
--   public.subscriptions  — Stripe subscription tracking
--   public.reports        — Saved validation reports + shareable links
--   public.validation_usage — Free tier monthly usage tracking
-- ══════════════════════════════════════════════════════════════
