import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDebounce } from '@/lib/useDebounce';

export interface SearchBarProps {
  /** Initial value for uncontrolled use. */
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  /** Fired with the *debounced* query — safe to use as a query trigger. */
  onDebouncedChange?: (value: string) => void;
  /** Fired with every keystroke (synchronous). */
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Debounce delay (ms). Default 250ms. */
  delayMs?: number;
  /** Make the input wider/full-width. */
  fullWidth?: boolean;
  /** Disable the field. */
  disabled?: boolean;
  className?: string;
  /** Accessible label. */
  ariaLabel?: string;
}

/**
 * Debounced search input with a clear button. Calls `onDebouncedChange`
 * after the user stops typing for `delayMs` (default 250ms) — ideal for
 * driving server-side filters without flooding the network.
 */
export function SearchBar({
  defaultValue = '',
  value,
  onDebouncedChange,
  onChange,
  placeholder = 'Search…',
  delayMs = 250,
  fullWidth = false,
  disabled = false,
  className,
  ariaLabel = 'Search',
}: SearchBarProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;
  const debounced = useDebounce(current, delayMs);
  const lastEmitted = useRef<string>(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounced !== lastEmitted.current) {
      lastEmitted.current = debounced;
      onDebouncedChange?.(debounced);
    }
  }, [debounced, onDebouncedChange]);

  function handleChange(next: string) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function clear() {
    handleChange('');
    inputRef.current?.focus();
  }

  return (
    <div
      className={cn(
        'inline-flex items-center h-9 gap-2 rounded-md border border-input bg-background px-3',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
        disabled && 'opacity-60 pointer-events-none',
        fullWidth && 'w-full',
        className,
      )}
    >
      <Search aria-hidden className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {current && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
