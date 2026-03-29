/**
 * BLVΞ useRouting Hook
 * 
 * Client-side hook for interacting with the routing API.
 * Provides methods for routing transactions and fetching routing data.
 */

import { useState, useCallback } from "react";

export interface RoutingResponse {
  id: string;
  memberId: string;
  merchantId: string;
  orgId: string;
  subOrgId?: string;
  amount: number;
  routedAmount: number;
  routingPercentage: string;
  timestamp: string;
}

export interface RoutingError {
  success: false;
  error: string;
}

export interface RoutingSuccess {
  success: true;
  routing: RoutingResponse;
}

export interface RoutingSummary {
  totalAmount: number;
  totalRouted: number;
  transactionCount: number;
}

export function useRouting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Route a transaction
   */
  const routeTransaction = useCallback(
    async (
      memberId: string,
      merchantId: string,
      amount: number,
      timestamp: string
    ): Promise<RoutingSuccess | RoutingError> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/routing/routeTransaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId,
            merchantId,
            amount,
            timestamp,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to route transaction");
          return { success: false, error: data.error || "Failed to route transaction" };
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get routing records for a member
   */
  const getMemberRouting = useCallback(
    async (memberId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/routing/routeTransaction?memberId=${memberId}`,
          { method: "GET" }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch routing records");
          return null;
        }

        return data.data || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get routing records for an organization
   */
  const getOrgRouting = useCallback(async (orgId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/routing/routeTransaction?orgId=${orgId}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch routing records");
        return null;
      }

      return data.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get routing summary for a member
   */
  const getMemberRoutingSummary = useCallback(
    async (memberId: string): Promise<RoutingSummary | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/routing/routeTransaction?memberId=${memberId}&summary=true`,
          { method: "GET" }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch routing summary");
          return null;
        }

        return data.data || null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get routing summary for an organization
   */
  const getOrgRoutingSummary = useCallback(
    async (orgId: string): Promise<RoutingSummary | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/routing/routeTransaction?orgId=${orgId}&summary=true`,
          { method: "GET" }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch routing summary");
          return null;
        }

        return data.data || null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    routeTransaction,
    getMemberRouting,
    getOrgRouting,
    getMemberRoutingSummary,
    getOrgRoutingSummary,
  };
}
