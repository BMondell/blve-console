/**
 * BLVΞ Routing Logic Engine
 *
 * Core routing logic for deterministically calculating economic impact
 * from transactions. All calculations are transparent and auditable.
 */

import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Server-side Supabase client (admin)
// ─────────────────────────────────────────────────────────────

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables for routing logic");
}

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

export interface MemberOrgInfo {
  memberId: string;
  orgId: string;
  subOrgId?: string;
  orgName: string;
  subOrgName?: string;
}

export interface RoutingCalculation {
  memberId: string;
  merchantId: string;
  orgId: string;
  subOrgId?: string;
  transactionAmount: number;
  routedAmount: number;
  routingPercentage: number;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// Member Org Lookup
// ─────────────────────────────────────────────────────────────

export async function getMemberOrgInfo(
  memberId: string
): Promise<MemberOrgInfo | null> {
  try {
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from("members")
      .select("id, org_id")
      .eq("id", memberId)
      .single();

    if (memberError || !memberData) {
      console.error("Member not found:", memberError);
      return null;
    }

    const orgId = memberData.org_id;

    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id, name, parent_org_id")
      .eq("id", orgId)
      .single();

    if (orgError || !orgData) {
      console.error("Organization not found:", orgError);
      return null;
    }

    const subOrgId = orgData.parent_org_id ? orgId : undefined;
    const actualOrgId = orgData.parent_org_id || orgId;

    let parentOrgData: { id: string; name: string } | null = null;
    if (orgData.parent_org_id) {
      const { data: parentData } = await supabaseAdmin
        .from("organizations")
        .select("id, name")
        .eq("id", actualOrgId)
        .single();
      parentOrgData = parentData;
    }

    return {
      memberId,
      orgId: actualOrgId,
      subOrgId,
      orgName: parentOrgData?.name || orgData.name,
      subOrgName: subOrgId ? orgData.name : undefined,
    };
  } catch (error) {
    console.error("Exception fetching member org info:", error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Routing Calculation
// ─────────────────────────────────────────────────────────────

export function calculateRouting(
  transactionAmount: number,
  memberOrgInfo: MemberOrgInfo
): RoutingCalculation {
  const baseRoutingPercentage = 0.1;
  const routedAmount = transactionAmount * baseRoutingPercentage;

  return {
    memberId: memberOrgInfo.memberId,
    merchantId: "",
    orgId: memberOrgInfo.orgId,
    subOrgId: memberOrgInfo.subOrgId,
    transactionAmount,
    routedAmount,
    routingPercentage: baseRoutingPercentage * 100,
    timestamp: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// Apply Routing Rules
// ─────────────────────────────────────────────────────────────

export async function applyRoutingRules(
  memberId: string,
  merchantId: string,
  amount: number,
  timestamp: string
): Promise<RoutingCalculation | null> {
  try {
    const memberOrgInfo = await getMemberOrgInfo(memberId);
    if (!memberOrgInfo) {
      console.error("Could not determine member org info");
      return null;
    }

    const routing = calculateRouting(amount, memberOrgInfo);
    routing.merchantId = merchantId;
    routing.timestamp = timestamp;

    return routing;
  } catch (error) {
    console.error("Exception applying routing rules:", error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Org Routing Summary
// ─────────────────────────────────────────────────────────────

export async function getOrgRoutingImpact(orgId: string): Promise<{
  totalTransactionAmount: number;
  totalRoutedAmount: number;
  averageRoutingPercentage: number;
  transactionCount: number;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("amount, routed_amount")
      .eq("org_id", orgId);

    if (error || !data) {
      console.error("Error fetching org routing impact:", error);
      return {
        totalTransactionAmount: 0,
        totalRoutedAmount: 0,
        averageRoutingPercentage: 0,
        transactionCount: 0,
      };
    }

    const totalTransactionAmount = data.reduce(
      (sum, r: any) => sum + r.amount,
      0
    );
    const totalRoutedAmount = data.reduce(
      (sum, r: any) => sum + r.routed_amount,
      0
    );
    const averageRoutingPercentage =
      totalTransactionAmount > 0
        ? (totalRoutedAmount / totalTransactionAmount) * 100
        : 0;

    return {
      totalTransactionAmount,
      totalRoutedAmount,
      averageRoutingPercentage,
      transactionCount: data.length,
    };
  } catch (error) {
    console.error("Exception getting org routing impact:", error);
    return {
      totalTransactionAmount: 0,
      totalRoutedAmount: 0,
      averageRoutingPercentage: 0,
      transactionCount: 0,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Member Routing Summary
// ─────────────────────────────────────────────────────────────

export async function getMemberRoutingImpact(memberId: string): Promise<{
  totalTransactionAmount: number;
  totalRoutedAmount: number;
  averageRoutingPercentage: number;
  transactionCount: number;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("amount, routed_amount")
      .eq("member_id", memberId);

    if (error || !data) {
      console.error("Error fetching member routing impact:", error);
      return {
        totalTransactionAmount: 0,
        totalRoutedAmount: 0,
        averageRoutingPercentage: 0,
        transactionCount: 0,
      };
    }

    const totalTransactionAmount = data.reduce(
      (sum, r: any) => sum + r.amount,
      0
    );
    const totalRoutedAmount = data.reduce(
      (sum, r: any) => sum + r.routed_amount,
      0
    );
    const averageRoutingPercentage =
      totalTransactionAmount > 0
        ? (totalRoutedAmount / totalTransactionAmount) * 100
        : 0;

    return {
      totalTransactionAmount,
      totalRoutedAmount,
      averageRoutingPercentage,
      transactionCount: data.length,
    };
  } catch (error) {
    console.error("Exception getting member routing impact:", error);
    return {
      totalTransactionAmount: 0,
      totalRoutedAmount: 0,
      averageRoutingPercentage: 0,
      transactionCount: 0,
    };
  }
}
