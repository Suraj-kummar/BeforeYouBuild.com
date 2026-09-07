/**
 * src/hooks/useSubscription.ts
 *
 * React hook that fetches and caches the current user's subscription plan.
 * Automatically re-fetches when the auth state changes.
 */

import { useEffect, useState } from "react";
import { supabase, getUserSubscription, type Subscription, type PlanId } from "@/lib/supabase";

export interface UseSubscriptionResult {
  plan: PlanId;
  subscription: Subscription | null;
  isLoading: boolean;
  isPro: boolean;
  isStartup: boolean;
  isPaid: boolean;
  refetch: () => void;
}

const DEFAULT_FREE: Subscription = {
  plan: "free",
  status: "active",
  current_period_end: null,
  stripe_customer_id: null,
  stripe_subscription_id: null,
};

export function useSubscription(): UseSubscriptionResult {
  // Cache key for memoization
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetch = async (uid: string) => {
    setIsLoading(true);
    try {
      const sub = await getUserSubscription(uid);
      setSubscription(sub);
    } catch {
      setSubscription(DEFAULT_FREE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load current session on mount
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        fetch(uid);
      } else {
        setSubscription(DEFAULT_FREE);
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        fetch(uid);
      } else {
        setSubscription(DEFAULT_FREE);
        setIsLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const plan = subscription?.plan ?? "free";

  return {
    plan,
    subscription,
    isLoading,
    isPro: plan === "pro",
    isStartup: plan === "startup",
    isPaid: plan === "pro" || plan === "startup",
    refetch: () => {
      if (userId) fetch(userId);
    },
  };
}

