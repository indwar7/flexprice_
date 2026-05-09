import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'brand';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. */
  variant?: ButtonVariant;
  /** Size token. */
  size?: ButtonSize;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Optional leading icon. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon. */
  trailingIcon?: ReactNode;
  /** Span the full width of the parent. */
  fullWidth?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95 focus-visible:ring-primary',
  brand:
    'bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 active:bg-brand/95 focus-visible:ring-brand',
  secondary:
    'bg-card text-foreground border border-border shadow-xs hover:bg-accent hover:border-input focus-visible:ring-ring',
  ghost:
    'text-foreground hover:bg-accent focus-visible:ring-ring',
  danger:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95 focus-visible:ring-destructive',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
};

/**
 * The primary action element used across FlexPrice for forms, modals, and CTAs.
 * Variants:
 * - `primary` — near-black primary action
 * - `brand` — FlexPrice blue, used sparingly for hero CTAs
 * - `secondary` — bordered, neutral
 * - `ghost` — borderless, low-emphasis
 * - `danger` — destructive intent
 *
 * @example
 * <Button variant="primary" size="md" onClick={save}>Save plan</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    className,
    disabled,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium tracking-tight',
        'transition-[background-color,border-color,color,box-shadow,transform] duration-150',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
        VARIANT[variant],
        SIZE[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
      ) : (
        leadingIcon && <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{leadingIcon}</span>
      )}
      {children}
      {!loading && trailingIcon && (
        <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{trailingIcon}</span>
      )}
    </button>
  );
});
