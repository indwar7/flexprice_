import { useState } from 'react';
import { Info } from 'lucide-react';
import { Select } from '@/components/atoms/Select/Select';
import { Tooltip } from '@/components/atoms/Tooltip/Tooltip';
import { AreaChart } from './AreaChart';
import { formatCurrency } from '@/lib/format';

export interface RevenueTrendCardProps {
  className?: string;
}

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
// Stable sample series in cents.
const SERIES_USD = [78_000_00, 84_500_00, 91_200_00, 89_800_00, 102_300_00, 118_600_00, 124_500_00];
const SERIES_EUR = [62_000_00, 67_300_00, 72_500_00, 71_900_00, 81_200_00, 92_400_00, 98_100_00];

export function RevenueTrendCard({ className }: RevenueTrendCardProps) {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const series = currency === 'USD' ? SERIES_USD : SERIES_EUR;
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const deltaPercent = ((last - prev) / Math.max(1, prev)) * 100;

  return (
    <section className={'rounded-md border border-border bg-card shadow-xs ' + (className ?? '')}>
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Revenue trend</h2>
            <Tooltip
              content="Sum of finalized invoices for the selected currency."
              side="top"
            >
              <button
                type="button"
                aria-label="More info"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-3.5 w-3.5" aria-hidden />
              </button>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">Last 7 months</p>
        </div>
        <div className="w-32">
          <Select
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
            ]}
            value={currency}
            onChange={(v) => setCurrency(v as 'USD' | 'EUR')}
            triggerWidth="full"
          />
        </div>
      </header>
      <div className="px-5 pb-3">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
            {formatCurrency(last, currency)}
          </span>
          <span
            className={
              'text-xs font-medium tabular-nums ' +
              (deltaPercent >= 0 ? 'text-foreground' : 'text-muted-foreground')
            }
          >
            {deltaPercent >= 0 ? '+' : ''}
            {deltaPercent.toFixed(1)}% vs prev. month
          </span>
        </div>
      </div>
      <div className="px-2 pb-4">
        <AreaChart
          values={series.map((c) => c / 100)}
          xLabels={MONTHS}
          formatValue={(n) => {
            if (n >= 1000) return `${Math.round(n / 1000)}k`;
            return Math.round(n).toString();
          }}
          height={220}
        />
      </div>
    </section>
  );
}
