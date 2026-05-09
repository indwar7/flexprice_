export interface PricingTier {
  /** Inclusive lower bound of usage units. */
  upTo: number | 'inf';
  /** Per-unit price in minor currency units (cents). */
  unitAmount: number;
  /** Optional flat fee for entering this tier (cents). */
  flatAmount?: number;
}

/**
 * Calculate price for `units` of usage given a tiered pricing schedule.
 * - "graduated" mode: each unit is priced at the rate of the tier it falls into.
 * - "volume" mode: all units priced at the rate of the tier the *total* volume falls into.
 */
export function calculateTieredPrice(
  units: number,
  tiers: PricingTier[],
  mode: 'graduated' | 'volume' = 'graduated',
): number {
  if (units <= 0 || tiers.length === 0) return 0;

  if (mode === 'volume') {
    const tier = tiers.find((t) => t.upTo === 'inf' || units <= t.upTo) ?? tiers[tiers.length - 1];
    return Math.round(units * tier.unitAmount + (tier.flatAmount ?? 0));
  }

  // graduated
  let total = 0;
  let remaining = units;
  let prevBoundary = 0;
  for (const tier of tiers) {
    if (remaining <= 0) break;
    const upper = tier.upTo === 'inf' ? Infinity : tier.upTo;
    const tierWidth = upper - prevBoundary;
    const consumed = Math.min(remaining, tierWidth);
    total += consumed * tier.unitAmount + (tier.flatAmount ?? 0);
    remaining -= consumed;
    prevBoundary = upper;
  }
  return Math.round(total);
}
