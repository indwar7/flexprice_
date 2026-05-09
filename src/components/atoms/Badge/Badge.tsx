import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'
  | 'primary'
  | 'brand';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color tone — maps to a semantic meaning. */
  tone?: BadgeTone;
  /** Size token. */
  size?: BadgeSize;
  /** Optional leading icon (e.g. status icon). */
  icon?: ReactNode;
  /** Render with a soft background instead of a solid one. */
  soft?: boolean;
  /** Render a small leading status dot in the matching tone. */
  dot?: boolean;
}

const SOFT: Record<BadgeTone, string> = {
  success: 'bg-success/10 text-success ring-1 ring-inset ring-success/20',
  warning: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/25',
  danger: 'bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20',
  info: 'bg-info/10 text-info ring-1 ring-inset ring-info/20',
  muted: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
  primary: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
  brand: 'bg-brand/10 text-brand ring-1 ring-inset ring-brand/20',
};

const SOLID: Record<BadgeTone, string> = {
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  danger: 'bg-destructive text-destructive-foreground',
  info: 'bg-info text-info-foreground',
  muted: 'bg-muted-foreground text-background',
  primary: 'bg-primary text-primary-foreground',
  brand: 'bg-brand text-brand-foreground',
};

const DOT: Record<BadgeTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-info',
  muted: 'bg-muted-foreground',
  primary: 'bg-primary',
  brand: 'bg-brand',
};

const SIZE: Record<BadgeSize, string> = {
  sm: 'h-5 px-1.5 text-[11px] gap-1',
  md: 'h-6 px-2 text-xs gap-1.5',
};

/**
 * A small label used to show status (active, paid, draft) or counts.
 * Pair with an icon for status chips like InvoiceStatusBadge, or set
 * `dot` for a discreet leading status indicator.
 */
export function Badge({
  tone = 'muted',
  size = 'md',
  icon,
  dot = false,
  soft = true,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap tracking-tight',
        soft ? SOFT[tone] : SOLID[tone],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden
          className={cn('h-1.5 w-1.5 rounded-full', DOT[tone], soft && 'shadow-[0_0_0_2px_rgb(255_255_255_/_0.4)]')}
        />
      )}
      {icon && <span className="shrink-0 [&_svg]:h-3 [&_svg]:w-3">{icon}</span>}
      {children}
    </span>
  );
}
