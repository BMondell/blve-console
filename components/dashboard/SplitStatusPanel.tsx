// components/dashboard/SplitStatusPanel.tsx

import { SplitMetrics } from "@/lib/splitMetrics";

export default function SplitStatusPanel({ metrics }: { metrics: SplitMetrics }) {
  return (
    <div className="grid grid-cols-4 gap-4 mt-10">
      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Instructed (Today)</p>
        <p className="text-2xl font-semibold">{metrics.instructed}</p>
      </div>

      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Confirmed (Today)</p>
        <p className="text-2xl font-semibold text-green-400">{metrics.confirmed}</p>
      </div>

      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Failed (Today)</p>
        <p className="text-2xl font-semibold text-red-400">{metrics.failed}</p>
      </div>

      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Held (Today)</p>
        <p className="text-2xl font-semibold text-yellow-400">{metrics.held}</p>
      </div>
    </div>
  );
}
