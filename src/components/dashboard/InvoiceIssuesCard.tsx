import { ChevronRight, CheckCircle2, AlertCircle, Clock, RefreshCw, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';

export type PaymentStatus = 'paid' | 'failed' | 'pending' | 'processing' | 'refunded';

export interface InvoiceIssuesCardProps {
  className?: string;
  /** Fired when a status row is clicked — pass the user to a filtered Invoice list. */
  onStatusClick?: (status: PaymentStatus) => void;
}

const ROWS: Array<{
  status: PaymentStatus;
  label: string;
  icon: typeof CheckCircle2;
  count: number;
  amountCents: number;
  iconClass: string;
}> = [
  { status: 'paid', label: 'Paid', icon: CheckCircle2, count: 84, amountCents: 142_300_00, iconClass: 'text-success' },
  { status: 'failed', label: 'Failed', icon: AlertCircle, count: 4, amountCents: 6_120_00, iconClass: 'text-destructive' },
  { status: 'pending', label: 'Pending', icon: Clock, count: 11, amountCents: 18_400_00, iconClass: 'text-warning' },
  { status: 'processing', label: 'Processing', icon: RefreshCw, count: 6, amountCents: 9_700_00, iconClass: 'text-muted-foreground' },
  { status: 'refunded', label: 'Refunded', icon: RotateCcw, count: 2, amountCents: 1_240_00, iconClass: 'text-muted-foreground' },
];

export function InvoiceIssuesCard({ className, onStatusClick }: InvoiceIssuesCardProps) {
  return (
    <section className={cn('rounded-md border border-border bg-card shadow-xs', className)}>
      <header className="px-5 pt-4 pb-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Invoice payment status</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Requires attention · last 7 days</p>
      </header>
      <ul className="border-t border-border">
        {ROWS.map((r, i) => {
          const Icon = r.icon;
          return (
            <li key={r.status}>
              <button
                type="button"
                onClick={() => onStatusClick?.(r.status)}
                className={cn(
                  'group w-full flex items-center gap-3 px-5 py-3 text-left',
                  'transition-colors hover:bg-muted/40',
                  i !== ROWS.length - 1 && 'border-b border-border',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', r.iconClass)} aria-hidden />
                <span className="flex-1 text-sm font-medium text-foreground">{r.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{r.count}</span>
                <span className="text-sm tabular-nums text-foreground w-24 text-right">
                  {formatCurrency(r.amountCents)}
                </span>
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
