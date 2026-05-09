import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  /** When provided, renders as a link rather than a button. */
  href?: string;
}

export interface EmptyStateProps {
  /** Decorative element — use one of the illustrations from `./illustrations` or pass a Lucide icon. */
  icon?: ReactNode;
  /**
   * Render an SVG illustration *instead of* an icon, for richer empty states.
   * The illustration is sized to ~96px and is exclusive of `icon`.
   */
  illustration?: ReactNode;
  /** Bold headline, one short sentence. */
  title: string;
  /** Supporting copy explaining what to do next. */
  description?: ReactNode;
  /** Primary CTA. */
  primaryAction?: EmptyStateAction;
  /** Secondary CTA (e.g. "Learn more"). */
  secondaryAction?: EmptyStateAction;
  /** Constrain height for embedded use. */
  compact?: boolean;
  className?: string;
}

/**
 * Full-block empty state used on list pages when a customer has no plans,
 * no invoices, etc. Combines an illustration, a clear headline, supporting
 * copy, and one or two CTAs.
 */
export function EmptyState({
  icon,
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center gap-3',
        compact ? 'py-10 px-6' : 'py-14 px-8',
        className,
      )}
    >
      {illustration ? (
        <div className={cn('shrink-0', compact ? 'h-20 w-20' : 'h-24 w-24')}>{illustration}</div>
      ) : (
        icon && (
          <div
            className={cn(
              'rounded-xl flex items-center justify-center',
              'bg-brand-soft text-brand ring-1 ring-inset ring-brand/15',
              '[&_svg]:h-6 [&_svg]:w-6',
              compact ? 'h-12 w-12' : 'h-14 w-14',
            )}
          >
            {icon}
          </div>
        )
      )}
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed text-balance">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2 mt-2">
          {primaryAction && <ActionButton action={primaryAction} variant="primary" />}
          {secondaryAction && <ActionButton action={secondaryAction} variant="ghost" />}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  action,
  variant,
}: {
  action: EmptyStateAction;
  variant: 'primary' | 'ghost';
}) {
  const cls = cn(
    'inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium tracking-tight transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    variant === 'primary'
      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]'
      : 'text-foreground hover:bg-accent',
  );
  if (action.href) {
    return (
      <a href={action.href} className={cls}>
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={action.onClick}>
      {action.label}
    </button>
  );
}
