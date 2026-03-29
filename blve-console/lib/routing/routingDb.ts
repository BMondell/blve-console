/**
 * BLVΞ Routing Database Utilities
 * 
 * Server-side utilities for interacting with the routing table in Supabase.
 * Handles all database operations related to transaction routing and attribution.
 */

import { createClient } from "@supabase/supabase-js";

// Create a server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface RoutingRecord {
  id: string;
  memberId: string;
  merchantId: string;
  orgId: string;
  subOrgId?: string;
  amount: number;
  routedAmount: number;
  timestamp: string;
  createdAt: string;
}

export interface RoutingInput {
  memberId: string;
  merchantId: string;
  amount: number;
  timestamp: string;
}

export interface RoutingResult {
  success: boolean;
  routing?: RoutingRecord;
  error?: string;
}

/**
 * Insert a routing record into the database
 */
export async function insertRoutingRecord(
  record: Omit<RoutingRecord, "id" | "createdAt">
): Promise<RoutingResult> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .insert([
        {
          member_id: record.memberId,
          merchant_id: record.merchantId,
          org_id: record.orgId,
          sub_org_id: record.subOrgId || null,
          amount: record.amount,
          routed_amount: record.routedAmount,
          timestamp: record.timestamp,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting routing record:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      routing: {
        id: data.id,
        memberId: data.member_id,
        merchantId: data.merchant_id,
        orgId: data.org_id,
        subOrgId: data.sub_org_id,
        amount: data.amount,
        routedAmount: data.routed_amount,
        timestamp: data.timestamp,
        createdAt: data.created_at,
      },
    };
  } catch (error) {
    console.error("Exception inserting routing record:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get routing records for a specific member
 */
export async function getRoutingRecordsByMember(
  memberId: string
): Promise<RoutingRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("*")
      .eq("member_id", memberId)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching routing records:", error);
      return [];
    }

    return (data || []).map((record: any) => ({
      id: record.id,
      memberId: record.member_id,
      merchantId: record.merchant_id,
      orgId: record.org_id,
      subOrgId: record.sub_org_id,
      amount: record.amount,
      routedAmount: record.routed_amount,
      timestamp: record.timestamp,
      createdAt: record.created_at,
    }));
  } catch (error) {
    console.error("Exception fetching routing records:", error);
    return [];
  }
}

/**
 * Get routing records for a specific organization
 */
export async function getRoutingRecordsByOrg(
  orgId: string
): Promise<RoutingRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("*")
      .eq("org_id", orgId)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching routing records by org:", error);
      return [];
    }

    return (data || []).map((record: any) => ({
      id: record.id,
      memberId: record.member_id,
      merchantId: record.merchant_id,
      orgId: record.org_id,
      subOrgId: record.sub_org_id,
      amount: record.amount,
      routedAmount: record.routed_amount,
      timestamp: record.timestamp,
      createdAt: record.created_at,
    }));
  } catch (error) {
    console.error("Exception fetching routing records by org:", error);
    return [];
  }
}

/**
 * Get routing records for a specific merchant
 */
export async function getRoutingRecordsByMerchant(
  merchantId: string
): Promise<RoutingRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("*")
      .eq("merchant_id", merchantId)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching routing records by merchant:", error);
      return [];
    }

    return (data || []).map((record: any) => ({
      id: record.id,
      memberId: record.member_id,
      merchantId: record.merchant_id,
      orgId: record.org_id,
      subOrgId: record.sub_org_id,
      amount: record.amount,
      routedAmount: record.routed_amount,
      timestamp: record.timestamp,
      createdAt: record.created_at,
    }));
  } catch (error) {
    console.error("Exception fetching routing records by merchant:", error);
    return [];
  }
}

/**
 * Get routing summary for a specific member
 */
export async function getRoutingSummaryByMember(
  memberId: string
): Promise<{
  totalAmount: number;
  totalRouted: number;
  transactionCount: number;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("amount, routed_amount")
      .eq("member_id", memberId);

    if (error) {
      console.error("Error fetching routing summary:", error);
      return { totalAmount: 0, totalRouted: 0, transactionCount: 0 };
    }

    const records = data || [];
    const totalAmount = records.reduce((sum, r: any) => sum + r.amount, 0);
    const totalRouted = records.reduce((sum, r: any) => sum + r.routed_amount, 0);

    return {
      totalAmount,
      totalRouted,
      transactionCount: records.length,
    };
  } catch (error) {
    console.error("Exception fetching routing summary:", error);
    return { totalAmount: 0, totalRouted: 0, transactionCount: 0 };
  }
}

/**
 * Get routing summary for a specific organization
 */
export async function getRoutingSummaryByOrg(
  orgId: string
): Promise<{
  totalAmount: number;
  totalRouted: number;
  transactionCount: number;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("routing")
      .select("amount, routed_amount")
      .eq("org_id", orgId);

    if (error) {
      console.error("Error fetching org routing summary:", error);
      return { totalAmount: 0, totalRouted: 0, transactionCount: 0 };
    }

    const records = data || [];
    const totalAmount = records.reduce((sum, r: any) => sum + r.amount, 0);
    const totalRouted = records.reduce((sum, r: any) => sum + r.routed_amount, 0);

    return {
      totalAmount,
      totalRouted,
      transactionCount: records.length,
    };
  } catch (error) {
    console.error("Exception fetching org routing summary:", error);
    return { totalAmount: 0, totalRouted: 0, transactionCount: 0 };
  }
}
