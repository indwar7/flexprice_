import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/atoms/Badge/Badge';
import { QueryPresets, createQueryConfig } from './queryConfig';

const meta = {
  title: 'Lib/QueryConfig (Challenge C)',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Challenge C** — `createQueryConfig` is a typed builder around `@tanstack/react-query` (v5). Each call site picks a preset (`REALTIME`, `DEFAULT`, `STATIC`) or overrides individual fields. The global `buildQueryClient()` helper applies the same defaults at the QueryClient level.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = (Object.keys(QueryPresets) as Array<keyof typeof QueryPresets>).map((k) => ({
  preset: k,
  ...QueryPresets[k],
}));

export const Presets: Story = {
  render: () => (
    <div className="rounded-lg border border-border bg-card overflow-hidden text-sm max-w-3xl">
      <table className="w-full">
        <thead className="text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">Preset</th>
            <th className="text-right px-4 py-2.5 font-medium">staleTime</th>
            <th className="text-right px-4 py-2.5 font-medium">gcTime</th>
            <th className="text-right px-4 py-2.5 font-medium">Refetch on focus</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.preset} className="border-t border-border tabular-nums">
              <td className="px-4 py-2.5">
                <Badge tone={r.preset === 'REALTIME' ? 'info' : r.preset === 'STATIC' ? 'muted' : 'primary'}>
                  {r.preset}
                </Badge>
              </td>
              <td className="px-4 py-2.5 text-right">{format(r.staleTime)}</td>
              <td className="px-4 py-2.5 text-right">{format(r.gcTime)}</td>
              <td className="px-4 py-2.5 text-right">{String(r.refetchOnWindowFocus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const UsageExample: Story = {
  render: () => (
    <div className="max-w-3xl flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Usage at a call site — pick a preset and override declaratively if needed:
      </p>
      <pre className="rounded-md border border-border bg-card p-4 overflow-x-auto text-xs leading-relaxed">
        {`import { useQuery } from '@tanstack/react-query';
import { createQueryConfig } from '@/lib/queryConfig';

// Real-time: usage counters that should always be fresh.
useQuery({
  queryKey: ['usage', subscriptionId],
  queryFn: () => api.usage(subscriptionId),
  ...createQueryConfig('REALTIME'),
});

// Static: plan definitions barely change between deploys.
useQuery({
  queryKey: ['plans'],
  queryFn: api.listPlans,
  ...createQueryConfig('STATIC'),
});

// Override a single field without losing the rest of the preset.
useQuery({
  queryKey: ['invoices', filters],
  queryFn: () => api.invoices(filters),
  ...createQueryConfig('DEFAULT', { staleTime: 60_000 }),
});`}
      </pre>
      <details className="rounded-md border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Resolved config for <code>createQueryConfig('DEFAULT', {`{ staleTime: 60_000 }`})</code>
        </summary>
        <pre className="mt-2 text-xs">
          {JSON.stringify(createQueryConfig('DEFAULT', { staleTime: 60_000 }), null, 2)}
        </pre>
      </details>
    </div>
  ),
};

function format(ms: number): string {
  if (ms === 0) return '0';
  if (ms < 60_000) return `${ms / 1000}s`;
  if (ms < 3_600_000) return `${ms / 60_000}m`;
  return `${ms / 3_600_000}h`;
}
