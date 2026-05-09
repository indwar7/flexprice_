import { describe, expect, it } from 'vitest';
import { formatCompactNumber, formatCurrency, formatDate, formatTrend } from './format';

describe('formatCurrency', () => {
  it('formats whole-dollar amounts in USD by default', () => {
    expect(formatCurrency(124_500_00)).toBe('$124,500.00');
  });

  it('respects the currency code', () => {
    // Avoid asserting on the exact symbol since locale rendering can vary;
    // test that the EUR formatter at least includes the EUR-ish prefix.
    const out = formatCurrency(99_99, 'EUR', 'en-US');
    expect(out).toMatch(/€99\.99|EUR\s?99\.99/);
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('formatCompactNumber', () => {
  it('compacts thousands', () => {
    expect(formatCompactNumber(1_234)).toBe('1.2K');
  });

  it('compacts millions', () => {
    expect(formatCompactNumber(2_300_000)).toBe('2.3M');
  });
});

describe('formatTrend', () => {
  it('signs positive trends', () => {
    expect(formatTrend(12.4)).toBe('+12.4%');
  });

  it('shows negative trends with minus', () => {
    expect(formatTrend(-3.1)).toBe('-3.1%');
  });

  it('renders zero as 0.0%', () => {
    expect(formatTrend(0)).toBe('0.0%');
  });
});

describe('formatDate', () => {
  it('formats ISO strings to short dates', () => {
    expect(formatDate('2025-05-10')).toMatch(/May 10, 2025/);
  });
});
