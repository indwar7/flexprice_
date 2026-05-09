import { cn } from '@/lib/cn';
import { formatCurrency, formatCompactNumber } from '@/lib/format';
import type { PricingTier } from '@/lib/pricing';

export interface PricingTierTableProps {
  tiers: PricingTier[];
  /** "graduated" charges per tier; "volume" applies a single tier's price to the full quantity. */
  mode?: 'graduated' | 'volume';
  /** Currency code (USD, EUR, etc.). */
  currency?: string;
  /** Singular noun for one usage unit, e.g. "API call". */
  unit?: string;
  className?: string;
}

/**
 * Displays a tiered or graduated pricing schedule in a compact, readable
 * table — used on plan-detail pages and on the public pricing page.
 */
export function PricingTierTable({
  tiers,
  mode = 'graduated',
  currency = 'USD',
  unit = 'unit',
  className,
}: PricingTierTableProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/50">
        <span className="text-sm font-medium">
          {mode === 'graduated' ? 'Graduated pricing' : 'Volume pricing'}
        </span>
        <span className="text-xs text-muted-foreground">{currency}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-muted-foreground">
            <th className="text-left font-medium px-4 py-2.5">First {unit}</th>
            <th className="text-left font-medium px-4 py-2.5">Last {unit}</th>
            <th className="text-right font-medium px-4 py-2.5">Per-{unit} price</th>
            <th className="text-right font-medium px-4 py-2.5">Flat fee</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((t, i) => {
            const lower = i === 0 ? 1 : ((tiers[i - 1].upTo as number) + 1);
            const upper = t.upTo === 'inf' ? '∞' : formatCompactNumber(t.upTo);
            return (
              <tr key={i} className="border-t border-border tabular-nums">
                <td className="px-4 py-2.5">{formatCompactNumber(lower)}</td>
                <td className="px-4 py-2.5">{upper}</td>
                <td className="px-4 py-2.5 text-right">
                  {formatCurrency(t.unitAmount, currency)}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">
                  {t.flatAmount ? formatCurrency(t.flatAmount, currency) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
