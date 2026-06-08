/**
 * src/lib/checkout.ts
 *
 * TanStack Start server functions for Stripe checkout.
 * These are the entry points called by client components.
 */

import { createServerFn } from "@tanstack/react-start";
import { createCheckoutSession, handleStripeWebhook } from "./stripe";

// ── Start Checkout Session ────────────────────────────────────────────────────

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { userId: string; email: string; plan: "pro" | "startup" }) => data
  )
  .handler(async ({ data }) => {
    // origin must be reconstructed on server — use env or a known base URL
    const origin =
      process.env.APP_URL ??
      process.env.VITE_APP_URL ??
      "http://localhost:8080";

    return createCheckoutSession({
      userId: data.userId,
      email: data.email,
      plan: data.plan,
      origin,
    });
  });

// ── Stripe Webhook Handler ────────────────────────────────────────────────────

export const processWebhook = createServerFn({ method: "POST" })
  .inputValidator((data: { body: string; signature: string }) => data)
  .handler(async ({ data }) => {
    return handleStripeWebhook(data.body, data.signature);
  });
