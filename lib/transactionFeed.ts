export type TransactionEvent = {
  id: string;
  timestamp: string;
  cardOwner: string;
  org: string;
  amount: number;
  status: "instructed" | "confirmed" | "failed";
};

export async function getTransactionFeed(): Promise<TransactionEvent[]> {
  return [
    {
      id: "tx_001",
      timestamp: "2026-04-12T19:21:00Z",
      cardOwner: "Owner #1023",
      org: "Liberty Youth Foundation",
      amount: 128.5,
      status: "confirmed",
    },
    {
      id: "tx_002",
      timestamp: "2026-04-12T19:18:00Z",
      cardOwner: "Owner #874",
      org: "South Dade Community Alliance",
      amount: 62.0,
      status: "instructed",
    },
    {
      id: "tx_003",
      timestamp: "2026-04-12T19:15:00Z",
      cardOwner: "Owner #541",
      org: "Hope City Collective",
      amount: 243.75,
      status: "failed",
    },
  ];
}
