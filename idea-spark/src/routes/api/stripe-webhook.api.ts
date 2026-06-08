/**
 * src/routes/api/stripe-webhook.ts
 *
 * POST /api/stripe-webhook
 *
 * Receives Stripe webhook events, verifies the signature, and updates
 * the subscriptions table in Supabase accordingly.
 *
 * Register this URL in your Stripe Dashboard → Webhooks:
 *   https://your-domain.com/api/stripe-webhook
 *
 * Events to enable:
 *   - checkout.session.completed
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { handleStripeWebhook } from "@/lib/stripe";

export const APIRoute = createAPIFileRoute("/api/stripe-webhook")({
  POST: async ({ request }) => {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Read raw body — IMPORTANT: do NOT parse as JSON first, Stripe needs the raw bytes
    const body = await request.text();

    try {
      const result = await handleStripeWebhook(body, signature);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook error";
      console.error("[Stripe Webhook]", message);
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
