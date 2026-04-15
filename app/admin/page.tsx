// app/admin/page.tsx

import DashboardShell from "@/components/blve-core/DashboardShell";
import NetworkIntelligenceHeader from "@/components/dashboard/NetworkIntelligenceHeader";
import HeroGraph from "@/components/dashboard/HeroGraph";

import KPIBlock from "@/components/dashboard/KPIBlock";
import KYCStatusRail from "@/components/dashboard/KYCStatusRail";
import SplitStatusPanel from "@/components/dashboard/SplitStatusPanel";
import RoutingActivityPanel from "@/components/dashboard/RoutingActivityPanel";
import TransactionStream from "@/components/dashboard/TransactionStream";
import OrgDistribution from "@/components/dashboard/OrgDistribution";

import { getNetworkMetrics } from "@/lib/networkMetrics";
import { getKycMetrics } from "@/lib/kycMetrics";
import { getSplitMetrics } from "@/lib/splitMetrics";
import { getRoutingMetrics } from "@/lib/routingMetrics";
import { getTransactionFeed } from "@/lib/transactionFeed";
import { getOrgDistribution } from "@/lib/orgDistribution";

export default async function AdminPage() {
  const [
    metrics,
    kyc,
    splits,
    routing,
    txFeed,
    orgs
  ] = await Promise.all([
    getNetworkMetrics(),
    getKycMetrics(),
    getSplitMetrics(),
    getRoutingMetrics(),
    getTransactionFeed(),
    getOrgDistribution(),
  ]);

  return (
    <DashboardShell>
      <section className="px-8 py-10 space-y-8">

        <NetworkIntelligenceHeader />

        <KYCStatusRail metrics={kyc} />

        <HeroGraph />

        <SplitStatusPanel metrics={splits} />

        {/* KPI STRIP */}
        <div className="grid grid-cols-4 gap-4">
          <KPIBlock label="Active Orgs" value={metrics.activeOrgs} />
          <KPIBlock label="Active Card Owners" value={metrics.activeCardOwners} />
          <KPIBlock label="Volume (24h)" value={`$${metrics.volume24h.toLocaleString()}`} />
          <KPIBlock label="BLVΞ Revenue (24h)" value={`$${metrics.blveRevenue24h.toLocaleString()}`} />
        </div>

        <RoutingActivityPanel metrics={routing} />

        <div className="grid grid-cols-2 gap-4 mt-6">
          <OrgDistribution orgs={orgs} />
          <TransactionStream events={txFeed} />
        </div>

      </section>
    </DashboardShell>
  );
}
