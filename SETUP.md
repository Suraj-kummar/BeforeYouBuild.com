# BeforeYouBuild.com — Setup Guide

> **Status:** App is fully coded. You just need to wire up API keys + Supabase tables.
> Takes ~20 minutes end-to-end.

---

## Step 1 — Supabase Database Tables

The app uses 3 tables. Run this SQL in your Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Click **SQL Editor** → **New Query**
3. Paste the entire contents of [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
4. Click **Run**

You should see "Success. No rows returned." — tables are created. ✅

---

## Step 2 — Supabase Auth Setup

Enable the login providers:

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** → add your OAuth Client ID + Secret (from [Google Cloud Console](https://console.cloud.google.com))
3. Enable **Email** (magic link is on by default)

Add redirect URLs:
- **Site URL:** `http://localhost:8080` (dev) or your production URL
- **Redirect URLs:** `http://localhost:8080/**`

---

## Step 3 — Get Your API Keys

### Supabase Service Role Key
> ⚠️ This bypasses Row Level Security — keep it secret server-side only

1. Supabase Dashboard → **Project Settings** → **API**
2. Copy the **service_role** key (under "Project API keys")
3. Paste into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com) → **API Keys**
2. Create a new key
3. Paste into `.env.local` as `ANTHROPIC_API_KEY`

---

## Step 4 — Stripe Setup

### 4a. Get Stripe API Keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) (use **Test mode** for dev — toggle in top-left)
2. **Developers** → **API keys**
3. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
4. Copy **Secret key** → `STRIPE_SECRET_KEY`

### 4b. Create Products + Prices
1. Stripe Dashboard → **Products** → **Add product**
2. Create **"BeforeYouBuild Pro"**:
   - Price: ₹499.00 / month
   - Currency: INR
   - Billing: Recurring
   - Copy the **Price ID** (starts with `price_`) → `STRIPE_PRO_PRICE_ID`
3. Create **"BeforeYouBuild Startup"**:
   - Price: ₹1499.00 / month
   - Copy the **Price ID** → `STRIPE_STARTUP_PRICE_ID`

### 4c. Set Up Webhooks (Local Dev)
Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
# Install (Windows — via scoop or download from stripe.com/docs/stripe-cli)
scoop install stripe

# Login
stripe login

# Listen and forward to your local server
stripe listen --forward-to localhost:8080/api/stripe-webhook
```

The CLI will print:
```
Your webhook signing secret is whsec_xxxxxxxxxxxx
```

Copy that → `STRIPE_WEBHOOK_SECRET` in `.env.local`

**Events to enable in production webhook:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Step 5 — Fill in .env.local

Open `idea-spark/.env.local` and fill in all the values from the steps above.

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_your-service-role-key
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-key
STRIPE_PRO_PRICE_ID=price_your-pro-price-id
STRIPE_STARTUP_PRICE_ID=price_your-startup-price-id
```

---

## Step 6 — Run the App

```bash
cd idea-spark
bun install   # if you haven't already
bun run dev
```

Open [http://localhost:8080](http://localhost:8080) 🎉

---

## Step 7 — Test End-to-End

### Free flow
- [ ] Submit an idea (no login) → see report with demo data
- [ ] Sign in with Google/magic link → submit idea → see full report
- [ ] Go to `/history` → see the saved report

### Stripe flow (Test Mode)
- [ ] Go to `/pricing` → click "Go Pro"
- [ ] Complete Stripe test checkout with card `4242 4242 4242 4242`
- [ ] Get redirected to `/checkout/success`
- [ ] Check Supabase `subscriptions` table — row should have `plan = 'pro'`
- [ ] Go back to `/report` — paywall sections should be unlocked

### PDF Export
- [ ] On a Pro account, open any report
- [ ] Click **Export PDF** — browser print dialog opens with clean white layout
- [ ] All 7 sections visible (no paywall overlay)

---

## Production Deployment (Cloudflare Workers)

```bash
# Build
bun run build

# Deploy
bunx wrangler deploy
```

Set all env vars in Cloudflare Dashboard → Workers → your worker → **Settings** → **Variables**.

Update `STRIPE_WEBHOOK_SECRET` to your production webhook's secret from Stripe Dashboard → Webhooks.

---

## Feature Summary

| Feature | Status | Where |
|---|---|---|
| AI Validation (Claude + web search) | ✅ Built | `/app` |
| 10-section validation report | ✅ Built | `/report` |
| Shareable report links | ✅ Built | `/report/:id` |
| Report paywall (free = 2 sections) | ✅ Built | `report.$id.tsx` |
| Supabase Auth (Google + Magic Link) | ✅ Built | `/login` |
| Free tier (2 validations/month) | ✅ Built | `app.tsx` |
| Report history | ✅ Built | `/history` |
| Stripe payments (Pro + Startup) | ✅ Built | `/pricing` → Stripe |
| Stripe webhook → DB update | ✅ Built | `/api/stripe-webhook` |
| Checkout success/cancel pages | ✅ Built | `/checkout/success` |
| PDF export (print CSS) | ✅ Built | `styles.css` |
| PDF export button | ✅ Built | Pro users on `/report` |
| Supabase DB tables | ✅ Migration ready | `supabase/migrations/` |
