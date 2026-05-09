import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface DonutSlice {
  label: string;
  value: number;
}

export interface DonutProps {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  /** Big number rendered in the centre. */
  centerValue?: string;
  /** Small caption rendered under `centerValue`. */
  centerLabel?: string;
  className?: string;
}

const TONES = [
  'hsl(222 47% 18%)',
  'hsl(215 16% 47%)',
  'hsl(214 32% 75%)',
  'hsl(214 32% 85%)',
  'hsl(214 32% 91%)',
];

/**
 * Lightweight inline-SVG donut chart used to show proportions
 * (subscriptions by plan, etc.). Monochrome stack of grays.
 */
export function Donut({
  slices,
  size = 168,
  thickness = 14,
  centerValue,
  centerLabel,
  className,
}: DonutProps) {
  const id = useId();
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn('inline-flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={thickness}
          />
          {slices.map((slice, i) => {
            const fraction = slice.value / total;
            const length = circumference * fraction;
            const dasharray = `${length} ${circumference}`;
            const strokeDashoffset = -offset;
            offset += length;
            return (
              <circle
                key={`${id}-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={TONES[i % TONES.length]}
                strokeWidth={thickness}
                strokeDasharray={dasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-[11px] text-muted-foreground mt-0.5">{centerLabel}</span>
            )}
          </div>
        )}
      </div>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-[260px]">
        {slices.map((slice, i) => (
          <li key={i} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span
              aria-hidden
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: TONES[i % TONES.length] }}
            />
            <span className="text-foreground">{slice.label}</span>
            <span className="tabular-nums">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
