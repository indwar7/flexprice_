import { describe, expect, it } from 'vitest';
import { calculateTieredPrice, type PricingTier } from './pricing';

const TIERS: PricingTier[] = [
  { upTo: 1_000, unitAmount: 0 },
  { upTo: 10_000, unitAmount: 2 },
  { upTo: 100_000, unitAmount: 1 },
  { upTo: 'inf', unitAmount: 0.5 },
];

describe('calculateTieredPrice — graduated', () => {
  it('returns 0 for zero usage', () => {
    expect(calculateTieredPrice(0, TIERS)).toBe(0);
  });

  it('charges 0 inside the free tier', () => {
    expect(calculateTieredPrice(500, TIERS)).toBe(0);
  });

  it('prices each unit at the rate of the tier it falls into', () => {
    // 1000 free + 4000 @ 2¢ = 8000¢
    expect(calculateTieredPrice(5_000, TIERS)).toBe(8_000);
  });

  it('crosses multiple tiers correctly', () => {
    // 1000 free + 9000 @ 2¢ + 40000 @ 1¢ = 18_000 + 40_000 = 58_000¢
    expect(calculateTieredPrice(50_000, TIERS)).toBe(58_000);
  });

  it('handles infinite top tier', () => {
    // 1000 free + 9000 @ 2¢ + 90000 @ 1¢ + 100_000 @ 0.5¢ = 18_000 + 90_000 + 50_000 = 158_000¢
    expect(calculateTieredPrice(200_000, TIERS)).toBe(158_000);
  });
});

describe('calculateTieredPrice — volume', () => {
  const flatTiers: PricingTier[] = [
    { upTo: 5, unitAmount: 25_00 },
    { upTo: 25, unitAmount: 20_00 },
    { upTo: 100, unitAmount: 15_00, flatAmount: 50_00 },
  ];

  it('applies a single tier rate across the full quantity', () => {
    // 30 seats falls into the 100-tier @ $15/seat + $50 flat = 30*1500 + 5000 = 50_000¢
    expect(calculateTieredPrice(30, flatTiers, 'volume')).toBe(50_000);
  });

  it('uses the smallest tier whose upTo covers the volume', () => {
    expect(calculateTieredPrice(3, flatTiers, 'volume')).toBe(7_500);
  });
});
