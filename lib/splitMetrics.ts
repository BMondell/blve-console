export type SplitMetrics = {
  instructed: number;
  confirmed: number;
  failed: number;
};

export async function getSplitMetrics(): Promise<SplitMetrics> {
  return {
    instructed: 312,
    confirmed: 308,
    failed: 4,
  };
}
