export const ORG_PERCENT = 0.85;
export const BLVE_PERCENT = 0.15;

export function calculateSplit(amount: number) {
  return {
    org: amount * ORG_PERCENT,
    blve: amount * BLVE_PERCENT,
  };
}
