import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/atoms/Button/Button';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePreset {
  label: string;
  /** Returns the resolved range. */
  resolve: () => DateRange;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Preset shortcuts displayed in the popover. */
  presets?: DateRangePreset[];
  /** Optional label rendered above the trigger. */
  label?: string;
  className?: string;
  disabled?: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * DAY_MS);
}

/** Default presets used by analytics filters across FlexPrice. */
export const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: 'Last 7 days', resolve: () => ({ from: daysAgo(7), to: new Date() }) },
  { label: 'Last 30 days', resolve: () => ({ from: daysAgo(30), to: new Date() }) },
  { label: 'Last 90 days', resolve: () => ({ from: daysAgo(90), to: new Date() }) },
  {
    label: 'Month to date',
    resolve: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    },
  },
  {
    label: 'Year to date',
    resolve: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), 0, 1), to: now };
    },
  },
];

/**
 * Compact date-range picker that surfaces preset shortcuts (last 7 days, MTD,
 * YTD, etc.) plus manual date inputs. Used to filter analytics dashboards.
 */
export function DateRangePicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  label,
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const triggerText =
    value.from && value.to
      ? `${formatDate(value.from)} – ${formatDate(value.to)}`
      : 'Select dates';

  return (
    <div ref={rootRef} className={cn('inline-flex flex-col gap-1.5 relative', className)}>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          'inline-flex items-center justify-between gap-3 h-9 px-3 rounded-md border border-input bg-background text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:pointer-events-none',
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Calendar aria-hidden className="h-4 w-4 text-muted-foreground" />
          <span className={cn(!value.from && 'text-muted-foreground')}>{triggerText}</span>
        </span>
        <ChevronDown aria-hidden className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-[420px] rounded-md border border-border bg-card shadow-lg animate-slide-down">
          <div className="grid grid-cols-[140px_1fr]">
            <div className="border-r border-border p-2 flex flex-col gap-0.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="text-left text-sm px-2 py-1.5 rounded hover:bg-accent"
                  onClick={() => {
                    onChange(p.resolve());
                    setOpen(false);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="p-3 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <DateField
                  label="From"
                  value={value.from}
                  onChange={(d) => onChange({ ...value, from: d })}
                />
                <DateField
                  label="To"
                  value={value.to}
                  onChange={(d) => onChange({ ...value, to: d })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange({ from: null, to: null })}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
}) {
  const v = value ? toISODate(value) : '';
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <input
        type="date"
        value={v}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
      />
    </label>
  );
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
