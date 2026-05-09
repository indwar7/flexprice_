import { cn } from '@/lib/cn';
import { formatCompactNumber } from '@/lib/format';

export interface UsageBarProps {
  /** Units consumed in the current period. */
  used: number;
  /** Total entitled units. Pass `null` for unmetered (renders an "unlimited" bar). */
  entitled: number | null;
  /** Short label (e.g. "API calls"). */
  label?: string;
  /** Override the unit suffix shown alongside numbers (default: none). */
  unit?: string;
  /** Threshold (0–1) above which the bar paints in warning color. */
  warningAt?: number;
  /** Threshold (0–1) above which the bar paints in destructive color. */
  dangerAt?: number;
  className?: string;
}

/**
 * A labelled progress bar showing used vs. entitled units for a billable
 * meter. Color shifts from primary → warning → destructive as the user
 * approaches their cap.
 */
export function UsageBar({
  used,
  entitled,
  label,
  unit,
  warningAt = 0.75,
  dangerAt = 0.95,
  className,
}: UsageBarProps) {
  const unlimited = entitled === null;
  const ratio = unlimited ? 0 : Math.min(1, used / Math.max(1, entitled));
  const percent = Math.round(ratio * 100);

  const tone = unlimited
    ? 'bg-primary/40'
    : ratio >= dangerAt
      ? 'bg-destructive'
      : ratio >= warningAt
        ? 'bg-warning'
        : 'bg-primary';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || !unlimited) && (
        <div className="flex items-baseline justify-between text-xs">
          {label && <span className="font-medium text-foreground">{label}</span>}
          <span className="text-muted-foreground tabular-nums">
            {formatCompactNumber(used)}
            {unit ? ` ${unit}` : ''}
            {' / '}
            {unlimited ? '∞' : `${formatCompactNumber(entitled)}${unit ? ` ${unit}` : ''}`}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={unlimited ? undefined : 100}
        aria-valuenow={unlimited ? undefined : percent}
        aria-label={label}
        className="relative h-1.5 rounded-full bg-muted overflow-hidden ring-1 ring-inset ring-border/40"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out',
            tone,
            ratio >= dangerAt && !unlimited && 'animate-pulse',
          )}
          style={{ width: unlimited ? '100%' : `${percent}%` }}
        />
      </div>
    </div>
  );
}
