import { useId, useMemo } from 'react';
import { cn } from '@/lib/cn';

export interface AreaChartProps {
  /** Series values, evenly spaced. */
  values: number[];
  /** Labels under each x-tick (every Nth one shown). */
  xLabels?: string[];
  /** Tooltip-friendly value formatter. */
  formatValue?: (n: number) => string;
  /** Container width — defaults to 100%. */
  width?: number;
  /** Container height. */
  height?: number;
  className?: string;
}

/**
 * Lightweight inline-SVG area chart. Pure render, no library — keeps the
 * bundle small. Renders a smooth path with a subtle gradient fill plus
 * dotted gridlines and per-tick x-axis labels.
 */
export function AreaChart({
  values,
  xLabels,
  formatValue = (n) => n.toLocaleString(),
  height = 220,
  className,
}: AreaChartProps) {
  const gradientId = useId();
  const padding = { top: 16, right: 12, bottom: 28, left: 44 };
  const innerW = 600 - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const { yTicks, scaledPoints, max, min, areaPath, linePath } = useMemo(() => {
    if (values.length === 0) {
      return { yTicks: [], scaledPoints: [], max: 0, min: 0, areaPath: '', linePath: '' };
    }
    const max = Math.max(...values);
    const min = 0;
    const range = max - min || 1;
    const step = innerW / Math.max(1, values.length - 1);

    const points = values.map((v, i) => ({
      x: padding.left + i * step,
      y: padding.top + (1 - (v - min) / range) * innerH,
      value: v,
    }));

    // Smooth using a cubic Bezier through midpoints.
    let line = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      line += ` Q ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} ${mx.toFixed(1)} ${((p0.y + p1.y) / 2).toFixed(1)}`;
      line += ` Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const area =
      `${line} L ${last.x.toFixed(1)} ${(padding.top + innerH).toFixed(1)}` +
      ` L ${first.x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} Z`;

    const ticks = 4;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) => {
      const v = min + (range * i) / ticks;
      const y = padding.top + (1 - (v - min) / range) * innerH;
      return { value: v, y };
    });

    return { yTicks, scaledPoints: points, max, min, areaPath: area, linePath: line };
  }, [values, innerW, innerH, padding.left, padding.top]);

  if (values.length === 0) return null;
  void min;
  void max;

  // Choose a sparse subset of x-labels so they don't collide.
  const labelStride = Math.ceil(values.length / 6);

  return (
    <svg
      viewBox={`0 0 600 ${height}`}
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      role="img"
      aria-label="Revenue trend"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gridlines + y-tick labels */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={600 - padding.right}
            y1={t.y}
            y2={t.y}
            stroke="hsl(var(--border))"
            strokeDasharray="2 4"
            strokeWidth="1"
          />
          <text
            x={padding.left - 8}
            y={t.y}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="10"
            fill="hsl(var(--muted-foreground))"
            className="tabular-nums"
          >
            {formatValue(t.value)}
          </text>
        </g>
      ))}

      {/* Area + line */}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {scaledPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === scaledPoints.length - 1 ? 3 : 2}
          fill="hsl(var(--background))"
          stroke="hsl(var(--foreground))"
          strokeWidth={i === scaledPoints.length - 1 ? 2 : 1.25}
        />
      ))}

      {/* X-axis labels */}
      {xLabels &&
        scaledPoints.map((p, i) =>
          i % labelStride === 0 || i === scaledPoints.length - 1 ? (
            <text
              key={i}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              {xLabels[i]}
            </text>
          ) : null,
        )}
    </svg>
  );
}
