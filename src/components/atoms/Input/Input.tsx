import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the field. */
  label?: string;
  /** Helper text below the input. */
  hint?: string;
  /** Error message — when present the field paints in destructive color. */
  error?: string;
  /** Decoration to render before the input (e.g. `$`, search icon). */
  leadingAddon?: ReactNode;
  /** Decoration to render after the input. */
  trailingAddon?: ReactNode;
  /** Optional className applied to the outer wrapper, not the input. */
  wrapperClassName?: string;
}

/**
 * Text/number input with optional label, hint, error, and currency-style addons.
 * @example
 * <Input label="Price" type="number" leadingAddon="$" hint="Per unit, USD" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    leadingAddon,
    trailingAddon,
    id,
    className,
    wrapperClassName,
    type = 'text',
    disabled,
    ...rest
  },
  ref,
) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = errorId ?? hintId;

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground tracking-tight">
          {label}
        </label>
      )}
      <div
        className={cn(
          'group/input flex items-stretch rounded-md border bg-card overflow-hidden shadow-xs',
          'transition-[border-color,box-shadow] duration-150',
          'focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring',
          error
            ? 'border-destructive/60 focus-within:ring-destructive/30 focus-within:border-destructive'
            : 'border-input',
          disabled && 'opacity-60 pointer-events-none',
        )}
      >
        {leadingAddon != null && (
          <span className="flex items-center px-3 text-sm text-muted-foreground bg-muted/60 border-r border-input">
            {leadingAddon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'flex-1 bg-transparent px-3 py-2 text-sm outline-none tabular-nums',
            'placeholder:text-muted-foreground/70',
            className,
          )}
          {...rest}
        />
        {trailingAddon != null && (
          <span className="flex items-center px-3 text-sm text-muted-foreground bg-muted/60 border-l border-input">
            {trailingAddon}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle aria-hidden className="h-3 w-3" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
});
