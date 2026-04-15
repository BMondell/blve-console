import { RoutingMetrics } from "@/lib/routingMetrics";

export default function RoutingActivityPanel({ metrics }: { metrics: RoutingMetrics }) {
  return (
    <div className="bg-[#111418] border border-white/5 rounded-lg p-4 mt-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-white/45">
          Routing Activity (24h)
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-white/45 text-[11px] uppercase mb-1">
            Offer Assignments
          </p>
          <p className="text-xl font-semibold">{metrics.offerAssignments24h}</p>
        </div>
        <div>
          <p className="text-white/45 text-[11px] uppercase mb-1">
            Rule Hits
          </p>
          <p className="text-xl font-semibold">{metrics.ruleHits24h}</p>
        </div>
        <div>
          <p className="text-white/45 text-[11px] uppercase mb-1">
            Manual Review Queue
          </p>
          <p className="text-xl font-semibold text-yellow-400">
            {metrics.manualReviewQueueCount}
          </p>
        </div>
      </div>
    </div>
  );
}
