import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  /** Options to choose from. */
  options: SelectOption<T>[];
  /** Currently selected value (controlled). */
  value?: T;
  /** Fired with the new selected value. */
  onChange?: (value: T) => void;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Visible label rendered above the trigger. */
  label?: string;
  /** Show a search box inside the dropdown. */
  searchable?: boolean;
  /** Disable the whole control. */
  disabled?: boolean;
  className?: string;
  /** Width of the trigger; defaults to fill parent. */
  triggerWidth?: 'auto' | 'full';
}

/**
 * A compact select / dropdown. Keyboard accessible (↑/↓/Enter/Esc) with optional search.
 *
 * @example
 * <Select options={statuses} value={status} onChange={setStatus} placeholder="Status" />
 */
export function Select<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  searchable = false,
  disabled = false,
  className,
  triggerWidth = 'full',
}: SelectProps<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!searchable || !query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
    if (open) setActiveIdx(filtered.findIndex((o) => o.value === value));
  }, [open, searchable, filtered, value]);

  function pick(opt: SelectOption<T>) {
    if (opt.disabled) return;
    onChange?.(opt.value);
    setOpen(false);
    setQuery('');
  }

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;
    if (e.key === 'Escape') {
      setOpen(false);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActiveIdx((i) => Math.max(0, i - 1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const opt = filtered[activeIdx];
      if (opt) pick(opt);
      e.preventDefault();
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative inline-flex flex-col gap-1.5', triggerWidth === 'full' && 'w-full', className)}
      onKeyDown={handleKey}
    >
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center justify-between gap-2 h-9 px-3 rounded-md border border-input bg-card text-sm shadow-xs',
          'transition-[border-color,box-shadow] duration-150',
          'hover:border-input/80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
          triggerWidth === 'full' && 'w-full',
        )}
      >
        <span className={cn('flex items-center gap-2 truncate', !selected && 'text-muted-foreground')}>
          {selected?.icon}
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown aria-hidden className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute z-50 top-full left-0 right-0 mt-1.5 max-h-64 overflow-auto',
            'rounded-md border border-border bg-popover shadow-lg animate-slide-down scrollbar-thin',
            'p-1',
          )}
        >
          {searchable && (
            <div className="sticky top-0 bg-popover -m-1 mb-1 p-1.5 border-b border-border">
              <div className="flex items-center gap-2 h-8 px-2 rounded border border-input bg-card">
                <Search aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          )}
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">No options</div>
          )}
          {filtered.map((opt, i) => {
            const active = i === activeIdx;
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(opt);
                }}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 mx-0 text-sm cursor-pointer rounded-sm',
                  active && 'bg-accent text-accent-foreground',
                  opt.disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                {opt.icon}
                <div className="flex-1 min-w-0">
                  <div className="truncate">{opt.label}</div>
                  {opt.description && (
                    <div className="truncate text-xs text-muted-foreground">{opt.description}</div>
                  )}
                </div>
                {isSelected && <Check aria-hidden className="h-4 w-4 text-primary shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
