import { OrgDistributionItem } from "@/lib/orgDistribution";

function payoutBadge(status: OrgDistributionItem["payoutStatus"]) {
  if (status === "healthy") {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
        Payout Healthy
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
      Needs Attention
    </span>
  );
}

export default function OrgDistribution({ orgs }: { orgs: OrgDistributionItem[] }) {
  return (
    <div className="bg-[#111418] border border-white/5 rounded-lg p-4 h-full">
      <p className="text-xs uppercase tracking-wide text-white/45 mb-3">
        Org Distribution (24h)
      </p>
      <div className="space-y-3">
        {orgs.map((org) => (
          <div
            key={org.orgName}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-white">{org.orgName}</p>
              <p className="text-[11px] text-white/45">
                ${org.volume24h.toLocaleString()} volume
              </p>
            </div>
            {payoutBadge(org.payoutStatus)}
          </div>
        ))}
      </div>
    </div>
  );
}
