-- BeforeYouBuild — Stripe subscriptions schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query

-- ── Subscriptions table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan                    TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'startup')) DEFAULT 'free',
  status                  TEXT NOT NULL DEFAULT 'active',  -- active | canceled | past_due
  current_period_end      TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);

-- ── Validation usage tracking ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS validation_usage (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS validation_usage_user_idx ON validation_usage (user_id);

-- ── Row Level Security ────────────────────────────────────────────────────
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_usage ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only read their own usage
CREATE POLICY "Users can read own usage"
  ON validation_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (used by server functions / webhook)
CREATE POLICY "Service role full access on subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on usage"
  ON validation_usage FOR ALL
  USING (auth.role() = 'service_role');

-- ── Auto-update updated_at ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
