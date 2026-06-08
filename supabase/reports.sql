-- BeforeYouBuild — Reports table for saved history & shareable links
-- Run this in Supabase Dashboard → SQL Editor AFTER schema.sql

CREATE TABLE IF NOT EXISTS reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea        TEXT NOT NULL,
  report      JSONB NOT NULL,
  verdict     TEXT CHECK (verdict IN ('HOT', 'CAUTION', 'DEAD')),
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reports_user_id_idx    ON reports (user_id);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports (created_at DESC);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Anyone can read public reports (shareable links work without login)
CREATE POLICY "Public reports are readable by anyone"
  ON reports FOR SELECT
  USING (is_public = true);

-- Users can read their own private reports too
CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reports
CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  USING (auth.uid() = user_id);

-- Service role full access (used by server functions)
CREATE POLICY "Service role full access on reports"
  ON reports FOR ALL
  USING (auth.role() = 'service_role');
