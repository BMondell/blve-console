export type KycMetrics = {
  verified: number;
  pending: number;
  failed: number;
};

export async function getKycMetrics(): Promise<KycMetrics> {
  return {
    verified: 18,
    pending: 5,
    failed: 1,
  };
}
