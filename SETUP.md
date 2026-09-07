# BeforeYouBuild.com â€” Setup Guide

> **Status:** App is fully coded. You just need to wire up API keys + Supabase tables.
> Takes ~20 minutes end-to-end.

---

## Step 1 â€” Supabase Database Tables

The app uses 3 tables. Run this SQL in your Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) â†’ your project
2. Click **SQL Editor** â†’ **New Query**
3. Paste the entire contents of [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
4. Click **Run**

You should see "Success. No rows returned." â€” tables are created. âœ…

---

## Step 2 â€” Supabase Auth Setup

Enable the login providers:

1. Supabase Dashboard â†’ **Authentication** â†’ **Providers**
2. Enable **Google** â†’ add your OAuth Client ID + Secret (from [Google Cloud Console](https://console.cloud.google.com))
3. Enable **Email** (magic link is on by default)

Add redirect URLs:
- **Site URL:** `http://localhost:8080` (dev) or your production URL
- **Redirect URLs:** `http://localhost:8080/**`

---

## Step 3 â€” Get Your API Keys

### Supabase Service Role Key
> âš ï¸ This bypasses Row Level Security â€” keep it secret server-side only

1. Supabase Dashboard â†’ **Project Settings** â†’ **API**
2. Copy the **service_role** key (under "Project API keys")
3. Paste into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com) â†’ **API Keys**
2. Create a new key
3. Paste into `.env.local` as `ANTHROPIC_API_KEY`

---

## Step 4 â€” Stripe Setup

### 4a. Get Stripe API Keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) (use **Test mode** for dev â€” toggle in top-left)
2. **Developers** â†’ **API keys**
3. Copy **Publishable key** â†’ `VITE_STRIPE_PUBLISHABLE_KEY`
4. Copy **Secret key** â†’ `STRIPE_SECRET_KEY`

### 4b. Create Products + Prices
1. Stripe Dashboard â†’ **Products** â†’ **Add product**
2. Create **"BeforeYouBuild Pro"**:
   - Price: â‚¹499.00 / month
   - Currency: INR
   - Billing: Recurring
   - Copy the **Price ID** (starts with `price_`) â†’ `STRIPE_PRO_PRICE_ID`
3. Create **"BeforeYouBuild Startup"**:
   - Price: â‚¹1499.00 / month
   - Copy the **Price ID** â†’ `STRIPE_STARTUP_PRICE_ID`

### 4c. Set Up Webhooks (Local Dev)
Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
# Install (Windows â€” via scoop or download from stripe.com/docs/stripe-cli)
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

Copy that â†’ `STRIPE_WEBHOOK_SECRET` in `.env.local`

**Events to enable in production webhook:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Step 5 â€” Fill in .env.local

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

## Step 6 â€” Run the App

```bash
cd idea-spark
bun install   # if you haven't already
bun run dev
```

Open [http://localhost:8080](http://localhost:8080) ðŸŽ‰

---

## Step 7 â€” Test End-to-End

### Free flow
- [ ] Submit an idea (no login) â†’ see report with demo data
- [ ] Sign in with Google/magic link â†’ submit idea â†’ see full report
- [ ] Go to `/history` â†’ see the saved report

### Stripe flow (Test Mode)
- [ ] Go to `/pricing` â†’ click "Go Pro"
- [ ] Complete Stripe test checkout with card `4242 4242 4242 4242`
- [ ] Get redirected to `/checkout/success`
- [ ] Check Supabase `subscriptions` table â€” row should have `plan = 'pro'`
- [ ] Go back to `/report` â€” paywall sections should be unlocked

### PDF Export
- [ ] On a Pro account, open any report
- [ ] Click **Export PDF** â€” browser print dialog opens with clean white layout
- [ ] All 7 sections visible (no paywall overlay)

---

## Production Deployment (Cloudflare Workers)

```bash
# Build
bun run build

# Deploy
bunx wrangler deploy
```

Set all env vars in Cloudflare Dashboard â†’ Workers â†’ your worker â†’ **Settings** â†’ **Variables**.

Update `STRIPE_WEBHOOK_SECRET` to your production webhook's secret from Stripe Dashboard â†’ Webhooks.

---

## Feature Summary

| Feature | Status | Where |
|---|---|---|
| AI Validation (Claude + web search) | âœ… Built | `/app` |
| 10-section validation report | âœ… Built | `/report` |
| Shareable report links | âœ… Built | `/report/:id` |
| Report paywall (free = 2 sections) | âœ… Built | `report.$id.tsx` |
| Supabase Auth (Google + Magic Link) | âœ… Built | `/login` |
| Free tier (2 validations/month) | âœ… Built | `app.tsx` |
| Report history | âœ… Built | `/history` |
| Stripe payments (Pro + Startup) | âœ… Built | `/pricing` â†’ Stripe |
| Stripe webhook â†’ DB update | âœ… Built | `/api/stripe-webhook` |
| Checkout success/cancel pages | âœ… Built | `/checkout/success` |
| PDF export (print CSS) | âœ… Built | `styles.css` |
| PDF export button | âœ… Built | Pro users on `/report` |
| Supabase DB tables | âœ… Migration ready | `supabase/migrations/` |

## Stripe Test Card Numbers

Use these cards in Stripe test mode:

| Card | Scenario |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | 3D Secure required |

Use any future expiry (e.g. `12/34`) and any 3-digit CVC.

