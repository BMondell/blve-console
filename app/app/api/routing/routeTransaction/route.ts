/**
 * BLVΞ Route Transaction API Endpoint
 * 
 * POST /api/routing/routeTransaction
 * 
 * Deterministically routes economic impact from transactions to the correct
 * org, sub-org, and member. All routing is transparent and auditable.
 * 
 * Request Body:
 * {
 *   memberId: string
 *   merchantId: string
 *   amount: number
 *   timestamp: string (ISO 8601)
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   routing?: {
 *     id: string (uuid)
 *     memberId: string
 *     merchantId: string
 *     orgId: string
 *     subOrgId?: string
 *     amount: number
 *     routedAmount: number
 *     routingPercentage: number
 *     timestamp: string
 *   }
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { applyRoutingRules } from "@/lib/routing/routingLogic";
import { insertRoutingRecord } from "@/lib/routing/routingDb";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { memberId, merchantId, amount, timestamp } = body;

    // ─────────────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────────────
    if (!memberId || typeof memberId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing memberId" },
        { status: 400 }
      );
    }

    if (!merchantId || typeof merchantId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing merchantId" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing amount (must be positive)" },
        { status: 400 }
      );
    }

    if (!timestamp || typeof timestamp !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing timestamp" },
        { status: 400 }
      );
    }

    // Validate timestamp is valid ISO 8601
    const parsedDate = new Date(timestamp);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid timestamp format (must be ISO 8601)" },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // APPLY ROUTING RULES
    // ─────────────────────────────────────────────────────────────────
    const routingCalculation = await applyRoutingRules(
      memberId,
      merchantId,
      amount,
      timestamp
    );

    if (!routingCalculation) {
      return NextResponse.json(
        { success: false, error: "Failed to calculate routing" },
        { status: 500 }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // INSERT ROUTING RECORD
    // ─────────────────────────────────────────────────────────────────
    const insertResult = await insertRoutingRecord({
      memberId: routingCalculation.memberId,
      merchantId: routingCalculation.merchantId,
      orgId: routingCalculation.orgId,
      subOrgId: routingCalculation.subOrgId,
      amount: routingCalculation.transactionAmount,
      routedAmount: routingCalculation.routedAmount,
      timestamp: routingCalculation.timestamp,
    });

    if (!insertResult.success || !insertResult.routing) {
      return NextResponse.json(
        { success: false, error: insertResult.error || "Failed to store routing record" },
        { status: 500 }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // RETURN FULL ROUTING BREAKDOWN
    // ─────────────────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        routing: {
          id: insertResult.routing.id,
          memberId: insertResult.routing.memberId,
          merchantId: insertResult.routing.merchantId,
          orgId: insertResult.routing.orgId,
          subOrgId: insertResult.routing.subOrgId,
          amount: insertResult.routing.amount,
          routedAmount: insertResult.routing.routedAmount,
          routingPercentage: (
            (insertResult.routing.routedAmount / insertResult.routing.amount) *
            100
          ).toFixed(2),
          timestamp: insertResult.routing.timestamp,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Exception in routeTransaction:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for retrieving routing information
 * 
 * Query Parameters:
 * - memberId: Get routing records for a specific member
 * - orgId: Get routing records for a specific organization
 * - merchantId: Get routing records for a specific merchant
 * - summary: Set to "true" to get summary statistics instead of records
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const orgId = searchParams.get("orgId");
    const merchantId = searchParams.get("merchantId");
    const summary = searchParams.get("summary") === "true";

    if (!memberId && !orgId && !merchantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Provide at least one query parameter: memberId, orgId, or merchantId",
        },
        { status: 400 }
      );
    }

    // Import database utilities
    const {
      getRoutingRecordsByMember,
      getRoutingRecordsByOrg,
      getRoutingRecordsByMerchant,
      getRoutingSummaryByMember,
      getRoutingSummaryByOrg,
    } = await import("@/lib/routing/routingDb");

    let records: any[] = [];
    let summaryData = null;

    if (memberId) {
      if (summary) {
        summaryData = await getRoutingSummaryByMember(memberId);
      } else {
        records = await getRoutingRecordsByMember(memberId);
      }
    } else if (orgId) {
      if (summary) {
        summaryData = await getRoutingSummaryByOrg(orgId);
      } else {
        records = await getRoutingRecordsByOrg(orgId);
      }
    } else if (merchantId) {
      records = await getRoutingRecordsByMerchant(merchantId);
    }

    return NextResponse.json(
      {
        success: true,
        data: summary ? summaryData : records,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Exception in GET routing:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
