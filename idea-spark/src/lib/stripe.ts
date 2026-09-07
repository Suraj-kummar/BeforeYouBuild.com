/**
 * src/lib/stripe.ts
 *
 * Server-side Stripe helpers:
 *  - createCheckoutSession  → creates a Stripe Checkout session and returns the URL
 *  - handleStripeWebhook    → verifies + processes Stripe webhook events
 *
 * IMPORTANT: This file must only be imported in server functions (createServerFn).
 * Never import it in client-side code — it uses secret keys.
 */

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// ── Stripe client (server-side only) ─────────────────────────────────────────

function getStripeClient(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || secret === "sk_test_placeholder") {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Add it to .env.local — get it from dashboard.stripe.com → Developers → API keys"
    );
  }
  return new Stripe(secret, { apiVersion: "2026-05-27.dahlia" });
}

// ── Supabase service-role client (for webhook writes) ─────────────────────────

function getServiceSupabase() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey || serviceKey === "your-service-role-key") {
    // In webhook context this is critical — anon key won't bypass RLS
    throw new Error(
      "[BeforeYouBuild] SUPABASE_SERVICE_ROLE_KEY is not configured. " +
      "Webhook writes will fail if RLS is enabled on the subscriptions table. " +
      "Get it from: Supabase Dashboard → Project Settings → API → service_role key."
    );
  }

  return createClient(url, serviceKey);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type PlanId = "free" | "pro" | "startup";

export interface CheckoutInput {
  userId: string;
  email: string;
  plan: "pro" | "startup";
  /** full URL of the running app, e.g. http://localhost:8080 */
  origin: string;
}

// ── createCheckoutSession ────────────────────────────────────────────────────

/**
 * Creates a Stripe Checkout Session for the given user and plan.
 * Returns the hosted checkout URL to redirect the browser to.
 */
export async function createCheckoutSession(
  input: CheckoutInput
): Promise<{ url: string }> {
  const stripe = getStripeClient();
  const supabase = getServiceSupabase();

  // Map plan → Stripe Price ID
  const priceId =
    input.plan === "pro"
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_STARTUP_PRICE_ID;

  if (!priceId || priceId.startsWith("price_placeholder")) {
    throw new Error(
      `STRIPE_${input.plan.toUpperCase()}_PRICE_ID is not configured. ` +
        `Create a product in your Stripe Dashboard and set the env var.`
    );
  }

  // Check if user already has a Stripe customer ID
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", input.userId)
    .maybeSingle();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: existingSub?.stripe_customer_id ?? undefined,
    customer_email: existingSub?.stripe_customer_id ? undefined : input.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/checkout/cancel`,
    metadata: {
      userId: input.userId,
      plan: input.plan,
    },
    subscription_data: {
      metadata: {
        userId: input.userId,
        plan: input.plan,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { url: session.url };
}

// ── handleStripeWebhook ──────────────────────────────────────────────────────

/**
 * Processes incoming Stripe webhook events.
 * Verifies the signature and updates the subscriptions table in Supabase.
 */
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ received: boolean }> {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret === "whsec_placeholder") {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not configured. Get it from Stripe Dashboard → Webhooks."
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`);
  }

  const supabase = getServiceSupabase();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(stripe, supabase, session);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(supabase, sub);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(supabase, sub);
      break;
    }
    default:
      // Ignore other events
      break;
  }

  return { received: true };
}

// ── Private helpers ──────────────────────────────────────────────────────────

async function handleCheckoutComplete(
  stripe: Stripe,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  const plan = (session.metadata?.plan ?? "free") as PlanId;
  if (!userId) return;

  // Fetch the subscription object to get period_end
  const subscriptionId = session.subscription as string;
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscriptionId,
      plan,
      status: "active",
      current_period_end: new Date(
        (stripeSub.items.data[0]?.current_period_end ?? 0) * 1000
      ).toISOString(),
    },
    { onConflict: "user_id" }
  );
}

async function handleSubscriptionUpdate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sub: Stripe.Subscription
) {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  const plan = (sub.metadata?.plan ?? "free") as PlanId;
  const status = sub.status === "active" ? "active" : sub.status;

  await supabase
    .from("subscriptions")
    .update({
      plan,
      status,
      current_period_end: new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
}

async function handleSubscriptionDeleted(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sub: Stripe.Subscription
) {
  await supabase
    .from("subscriptions")
    .update({ plan: "free", status: "canceled" })
    .eq("stripe_subscription_id", sub.id);
}

