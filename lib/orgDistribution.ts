export type OrgDistributionItem = {
  orgName: string;
  volume24h: number;
  payoutStatus: "healthy" | "attention";
};

export async function getOrgDistribution(): Promise<OrgDistributionItem[]> {
  return [
    {
      orgName: "Liberty Youth Foundation",
      volume24h: 21432,
      payoutStatus: "healthy",
    },
    {
      orgName: "South Dade Community Alliance",
      volume24h: 17389,
      payoutStatus: "healthy",
    },
    {
      orgName: "Hope City Collective",
      volume24h: 12904,
      payoutStatus: "attention",
    },
    {
      orgName: "Bridgepoint Outreach",
      volume24h: 9842,
      payoutStatus: "healthy",
    },
  ];
}
