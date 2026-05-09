import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Content rendered inside the floating tooltip. */
  content: ReactNode;
  /** The trigger element. Must accept ref-pattern event handlers. */
  children: ReactElement;
  /** Side relative to the trigger. */
  side?: TooltipSide;
  /** Hover/focus delay before opening, in ms. */
  delayMs?: number;
  /** Additional class names on the floating panel. */
  className?: string;
}

const SIDE: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const ARROW: Record<TooltipSide, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-px border-t-foreground border-x-transparent border-b-0',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-px border-b-foreground border-x-transparent border-t-0',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-px border-l-foreground border-y-transparent border-r-0',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-px border-r-foreground border-y-transparent border-l-0',
};

/**
 * Lightweight informational tooltip. Opens on hover/focus and closes on
 * leave/blur, with a configurable delay. Wrap a single interactive child.
 */
export function Tooltip({ content, children, side = 'top', delayMs = 200, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number>();

  function show() {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delayMs);
  }
  function hide() {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  const child = Children.only(children);
  if (!isValidElement(child)) return children;

  const trigger = cloneElement(child as ReactElement<Record<string, unknown>>, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none animate-fade-in',
            'rounded-md bg-foreground text-background text-xs px-2 py-1 whitespace-nowrap shadow-md',
            'font-medium tracking-tight',
            SIDE[side],
            className,
          )}
        >
          {content}
          <span
            aria-hidden
            className={cn('absolute h-0 w-0 border-[5px]', ARROW[side])}
          />
        </span>
      )}
    </span>
  );
}
