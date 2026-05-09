# FlexPrice Component Library — Take-Home

A Storybook-driven component library extracted from the FlexPrice admin app
([github.com/flexprice/flexprice-front](https://github.com/flexprice/flexprice-front)),
built for the FlexPrice Frontend Intern take-home.

**Live Storybook:** https://flexprice-psi.vercel.app

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Storybook 8 · Zustand ·
TanStack Query v5 · TanStack Virtual · Vitest · React Testing Library

## What's inside

### 15 components across atoms / molecules / organisms

| Tier      | Component             | Path                                                        |
| --------- | --------------------- | ----------------------------------------------------------- |
| Atom      | Button                | `src/components/atoms/Button`                               |
| Atom      | Badge                 | `src/components/atoms/Badge`                                |
| Atom      | Input                 | `src/components/atoms/Input`                                |
| Atom      | Select / Dropdown     | `src/components/atoms/Select`                               |
| Atom      | Tooltip               | `src/components/atoms/Tooltip`                              |
| Atom      | Spinner / LoadingState| `src/components/atoms/Spinner`                              |
| Molecule  | MetricCard            | `src/components/molecules/MetricCard`                       |
| Molecule  | DataTable             | `src/components/molecules/DataTable` (virtualisation built-in) |
| Molecule  | InvoiceStatusBadge    | `src/components/molecules/InvoiceStatusBadge`               |
| Molecule  | UsageBar / MeterProgress | `src/components/molecules/UsageBar`                      |
| Molecule  | DateRangePicker       | `src/components/molecules/DateRangePicker`                  |
| Molecule  | SearchBar             | `src/components/molecules/SearchBar`                        |
| Organism  | SidebarNav            | `src/components/organisms/SidebarNav`                       |
| Organism  | PricingTierTable      | `src/components/organisms/PricingTierTable`                 |
| Organism  | EmptyState            | `src/components/organisms/EmptyState`                       |

Every component has:
- A JSDoc-documented public API
- A Storybook story file with **Default**, **Variants**, fully-typed
  Controls, and docs
- An interaction test (`@storybook/test` play function) for the
  interactive ones (Button, Input, Select, SearchBar)

### Advanced challenges — all three implemented

**A. `useFilterStore`** — `src/lib/useFilterStore.ts`

Zustand store factory that:
- Persists each page's filter state to `sessionStorage`, keyed by route
  (e.g. `filters:invoices`, `filters:customers`).
- Exposes `setFilter`, `setFilters`, `resetFilters`, `getFilters`.
- Mirrors only an 8-char fingerprint to the URL via `useFilterFingerprint`,
  so the page is bookmarkable without bloating the query string.

Demo: **Molecules → DataTable → WithFilterStore** in Storybook.

**B. Virtualised `DataTable`** — `src/components/molecules/DataTable/DataTable.tsx`

Row virtualisation via `@tanstack/react-virtual`. Only the rows in the
viewport plus an overscan buffer are mounted, so 10k+ rows scroll smoothly.
Rows support dynamic height measurement.

Demo: **Molecules → DataTable → Virtualised10kRows**.

**C. `createQueryConfig`** — `src/lib/queryConfig.ts`

Typed helper around TanStack Query v5:
- Global default of `staleTime: 5m`, `gcTime: 10m`.
- `REALTIME` (0 / 1m), `DEFAULT` (5m / 10m), `STATIC` (30m / 1h) presets.
- Per-call-site overrides: `createQueryConfig('DEFAULT', { staleTime: 60_000 })`.
- `buildQueryClient()` to apply the same defaults at the QueryClient level.

Demo: **Lib → QueryConfig (Challenge C)** in Storybook. Behaviour is also
documented in `src/lib/queryConfig.test.ts`.

### Tests

47 Vitest tests across 8 files:

| File                                                  | Tests | What's covered                                  |
| ----------------------------------------------------- | ----- | ----------------------------------------------- |
| `src/lib/format.test.ts`                              | 9     | Currency, compact number, trend, date formatting |
| `src/lib/status.test.ts`                              | 8     | Invoice / plan / subscription status mapping     |
| `src/lib/pricing.test.ts`                             | 7     | Graduated + volume tier pricing maths            |
| `src/lib/queryConfig.test.ts`                         | 5     | Preset overrides, client defaults                |
| `src/lib/useFilterStore.test.ts`                      | 7     | Filter store + fingerprint stability             |
| `src/components/atoms/Button/Button.test.tsx`         | 5     | Click, loading, aria-busy, variants              |
| `src/components/molecules/InvoiceStatusBadge/...test.tsx` | 3 | Label humanisation, icon toggling                |
| `src/components/molecules/UsageBar/UsageBar.test.tsx` | 3     | aria-valuenow, unmetered, capping at 100%        |

## Folder layout

```
.
├── .storybook/             Storybook config
├── src/
│   ├── components/
│   │   ├── atoms/          Button · Badge · Input · Select · Tooltip · Spinner
│   │   ├── molecules/      MetricCard · DataTable · InvoiceStatusBadge · UsageBar · DateRangePicker · SearchBar
│   │   └── organisms/      SidebarNav · PricingTierTable · EmptyState
│   ├── lib/                cn · format · status · pricing · useDebounce · useFilterStore · queryConfig
│   ├── styles/globals.css  Design tokens (HSL CSS vars, shadcn-style)
│   ├── test/setup.ts       Vitest + jsdom + jest-dom
│   ├── App.tsx             Vite landing page
│   ├── Introduction.mdx    Storybook intro
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
├── vitest.config.ts
└── vercel.json
```

## Running locally

```bash
npm install
npm run storybook       # http://localhost:6006
npm run test            # vitest (one-shot)
npm run test:watch      # vitest watch mode
npm run build-storybook # static output -> ./storybook-static
npm run lint            # tsc --noEmit
```

## Deployment

Hosted on Vercel:

- **Production:** https://flexprice-psi.vercel.app
- Build command: `npm run build-storybook`
- Output directory: `storybook-static`
- See `vercel.json` for the full config.

## Notes on judgement calls

- **shadcn/ui-inspired tokens** rather than copying components. The FlexPrice
  repo uses HSL CSS variables on top of Tailwind + Radix; I matched that
  pattern in `src/styles/globals.css`.
- **Money in minor units.** All currency amounts are stored as cents
  (`amountCents`, `mrrCents`) to avoid float drift; the `formatCurrency`
  helper divides by 100 at render time.
- **Filter fingerprint over full state.** I picked an FNV-1a 32-bit hash
  for the URL parameter — it's stable, key-order-independent
  (see `stableStringify`), 8 hex chars, and good enough for bookmark
  routing without the URL bloat the prompt warned about.
- **Virtualisation lives inside `DataTable`.** A separate
  `<VirtualList>` would have duplicated the column / sort / empty-state
  plumbing. The `virtual` prop opts in.
