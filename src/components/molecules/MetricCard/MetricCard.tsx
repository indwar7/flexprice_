import { type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatTrend } from '@/lib/format';
import { Spinner } from '@/components/atoms/Spinner/Spinner';

export interface MetricCardProps {
  /** Short label (e.g. "Active subscriptions"). */
  label: string;
  /** Display value. Pre-formatted by the caller (currency, count, etc.). */
  value: ReactNode;
  /** Optional secondary line under the value. */
  caption?: ReactNode;
  /**
   * Period-over-period change as a percent. Positive = up, negative = down.
   * Pass `null`/`undefined` to hide the trend.
   */
  trendPercent?: number | null;
  /** Comparison label, e.g. "vs last 30 days". */
  trendLabel?: string;
  /** Whether higher is better. Affects the trend color tone (default true). */
  higherIsBetter?: boolean;
  /** Show a loading skeleton instead of the value. */
  loading?: boolean;
  /** Optional decoration on the right (icon, tag). */
  adornment?: ReactNode;
  /** Optional inline sparkline (e.g. an SVG <path>). Rendered below the value. */
  sparkline?: ReactNode;
  className?: string;
}

/**
 * KPI card used across the FlexPrice dashboard. Displays a label, a primary
 * value, and an optional period-over-period trend indicator.
 */
export function MetricCard({
  label,
  value,
  caption,
  trendPercent,
  trendLabel,
  higherIsBetter = true,
  loading = false,
  adornment,
  sparkline,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-md border border-border bg-card p-5 flex flex-col gap-2.5',
        'shadow-xs transition-shadow hover:shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {adornment}
      </div>

      {loading ? (
        <div className="h-8 flex items-center">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="text-[28px] leading-none font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </div>
      )}

      {sparkline && <div className="-mx-1 mt-1 h-9 opacity-90">{sparkline}</div>}

      {(caption || trendPercent != null) && (
        <div className="mt-auto pt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {trendPercent != null && <TrendPill value={trendPercent} higherIsBetter={higherIsBetter} />}
          {trendLabel && <span>{trendLabel}</span>}
          {caption}
        </div>
      )}
    </div>
  );
}

function TrendPill({ value, higherIsBetter }: { value: number; higherIsBetter: boolean }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-muted-foreground font-medium tabular-nums">
        <Minus className="h-3 w-3" aria-hidden /> 0%
      </span>
    );
  }
  const positive = value > 0;
  const good = positive === higherIsBetter;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-medium tabular-nums text-[11px]',
        good ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {formatTrend(value)}
    </span>
  );
}

/** Small inline SVG sparkline. Pass values normalised to [0, 1]. */
export interface SparklineProps {
  values: number[];
  positive?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  values,
  positive = true,
  width = 200,
  height = 36,
  className,
}: SparklineProps) {
  if (values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  void positive;
  const stroke = 'hsl(var(--muted-foreground))';
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn('w-full h-full', className)}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.6"
        points={points.join(' ')}
      />
    </svg>
  );
}
