import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label, defaults to "Loading". */
  label?: string;
}

const SIZE: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/** A simple animated loading indicator. Set `label` for screen-reader text. */
export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className={cn('inline-flex', className)}>
      <Loader2 aria-hidden className={cn('animate-spin text-muted-foreground', SIZE[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

/** Full-block loading state — spinner + label, useful inside cards/tables. */
export function LoadingState({ label = 'Loading…', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground',
        className,
      )}
    >
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
