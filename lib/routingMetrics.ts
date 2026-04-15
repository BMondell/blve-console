export type RoutingMetrics = {
  offerAssignments24h: number;
  ruleHits24h: number;
  manualReviewQueueCount: number;
};

export async function getRoutingMetrics(): Promise<RoutingMetrics> {
  return {
    offerAssignments24h: 192,
    ruleHits24h: 1347,
    manualReviewQueueCount: 7,
  };
}
