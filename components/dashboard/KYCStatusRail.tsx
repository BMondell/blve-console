import { KycMetrics } from "@/lib/kycMetrics";

export default function KYCStatusRail({ metrics }: { metrics: KycMetrics }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Verified</p>
        <p className="text-2xl font-semibold text-green-400">{metrics.verified}</p>
      </div>

      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Pending</p>
        <p className="text-2xl font-semibold text-yellow-400">{metrics.pending}</p>
      </div>

      <div className="bg-[#111418] border border-white/5 rounded-lg p-4">
        <p className="text-white/45 text-xs uppercase mb-1">Failed</p>
        <p className="text-2xl font-semibold text-red-400">{metrics.failed}</p>
      </div>
    </div>
  );
}
