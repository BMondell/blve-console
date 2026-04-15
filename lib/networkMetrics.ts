// lib/networkMetrics.ts

export type NetworkMetrics = {
  activeOrgs: number;
  activeCardOwners: number;   // renamed from activeMembers
  volume24h: number;          // dollars
  blveRevenue24h: number;     // dollars
};

export async function getNetworkMetrics(): Promise<NetworkMetrics> {
  return {
    activeOrgs: 24,
    activeCardOwners: 1204,   // renamed mock
    volume24h: 84320,
    blveRevenue24h: 12648,
  };
}
