import { Donut } from './Donut';
import { cn } from '@/lib/cn';

export interface RecentSubscriptionsCardProps {
  className?: string;
}

const SLICES = [
  { label: 'Pro Annual', value: 14 },
  { label: 'Growth', value: 9 },
  { label: 'Starter', value: 6 },
  { label: 'Enterprise', value: 3 },
];

export function RecentSubscriptionsCard({ className }: RecentSubscriptionsCardProps) {
  const total = SLICES.reduce((s, x) => s + x.value, 0);
  return (
    <section className={cn('rounded-md border border-border bg-card shadow-xs flex flex-col', className)}>
      <header className="px-5 pt-4 pb-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Recent subscriptions</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Created in the last 7 days</p>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center pb-6 pt-2">
        <Donut
          slices={SLICES}
          centerValue={String(total)}
          centerLabel="new subs"
          size={172}
          thickness={16}
        />
      </div>
    </section>
  );
}
