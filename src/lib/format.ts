/**
 * Currency formatting in the style FlexPrice uses for invoices and pricing.
 * Defaults to USD; pass an ISO 4217 code to switch.
 */
export function formatCurrency(
  amountInMinorUnits: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  const major = amountInMinorUnits / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}

/** Compact number formatting for KPI cards: 1234 → "1.2K". */
export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Trend percentage: returns signed string e.g. "+12.4%" or "-3.1%". */
export function formatTrend(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

/** Short date, e.g. "May 10, 2025". */
export function formatDate(d: Date | string, locale = 'en-US'): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
