/**
 * Apply routing rules and return full breakdown
 */
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
