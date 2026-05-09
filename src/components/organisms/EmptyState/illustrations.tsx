/**
 * Lightweight SVG illustrations for empty states. Each one is monochrome,
 * sized to ~96px, and uses currentColor so it inherits the parent's tone.
 * Kept inline (no asset pipeline) so the bundle stays light.
 */

interface IllustrationProps {
  className?: string;
}

export function InvoicesIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="emp-inv-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-soft))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#emp-inv-bg)" />
      <g transform="translate(34, 24)">
        <rect
          x="0"
          y="0"
          width="48"
          height="64"
          rx="6"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />
        <rect x="8" y="12" width="22" height="3" rx="1.5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
        <rect x="8" y="20" width="32" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.25" />
        <rect x="8" y="26" width="28" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.25" />
        <rect x="8" y="38" width="32" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.2" />
        <rect x="8" y="44" width="20" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.2" />
        <rect
          x="8"
          y="52"
          width="14"
          height="6"
          rx="3"
          fill="hsl(var(--brand))"
          opacity="0.85"
        />
      </g>
      <g transform="translate(58, 70)">
        <circle cx="14" cy="14" r="14" fill="hsl(var(--brand))" />
        <path
          d="M14 8 L14 20 M8 14 L20 14"
          stroke="hsl(var(--brand-foreground))"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CustomersIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="emp-cus-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-soft))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#emp-cus-bg)" />
      <g transform="translate(28, 36)">
        <circle cx="14" cy="14" r="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <circle cx="14" cy="11" r="3.5" fill="hsl(var(--muted-foreground))" opacity="0.5" />
        <path
          d="M7 18 Q14 14 21 18"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
      <g transform="translate(50, 28)">
        <circle cx="14" cy="14" r="13" fill="hsl(var(--card))" stroke="hsl(var(--brand))" strokeWidth="1.8" />
        <circle cx="14" cy="11" r="4" fill="hsl(var(--brand))" />
        <path d="M6 19 Q14 14 22 19" stroke="hsl(var(--brand))" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(72, 36)">
        <circle cx="14" cy="14" r="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <circle cx="14" cy="11" r="3.5" fill="hsl(var(--muted-foreground))" opacity="0.5" />
        <path
          d="M7 18 Q14 14 21 18"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

export function SearchIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="emp-srch-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-soft))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#emp-srch-bg)" />
      <g transform="translate(36, 36)">
        <circle cx="20" cy="20" r="18" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="11" stroke="hsl(var(--brand))" strokeWidth="2.2" fill="none" />
        <path
          d="M28 28 L40 40"
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function PlansIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="emp-plan-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-soft))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#emp-plan-bg)" />
      <g transform="translate(28, 38)">
        <rect
          x="0"
          y="6"
          width="20"
          height="38"
          rx="4"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />
        <rect
          x="22"
          y="0"
          width="20"
          height="44"
          rx="4"
          fill="hsl(var(--card))"
          stroke="hsl(var(--brand))"
          strokeWidth="1.8"
        />
        <rect
          x="44"
          y="6"
          width="20"
          height="38"
          rx="4"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />
        <rect x="4" y="12" width="12" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
        <rect x="4" y="18" width="8" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        <rect x="26" y="6" width="12" height="2.5" rx="1" fill="hsl(var(--brand))" />
        <rect x="26" y="13" width="14" height="2" rx="1" fill="hsl(var(--brand))" opacity="0.6" />
        <rect x="48" y="12" width="12" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
        <rect x="48" y="18" width="8" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
      </g>
    </svg>
  );
}
