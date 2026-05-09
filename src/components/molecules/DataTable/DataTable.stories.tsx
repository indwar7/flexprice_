import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type DataTableColumn, type SortState } from './DataTable';
import { makeMockCustomers, makeMockInvoices, type MockInvoice } from './mockData';
import { formatCurrency, formatDate } from '@/lib/format';
import { InvoiceStatusBadge } from '@/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge';
import { Badge } from '@/components/atoms/Badge/Badge';
import { EmptyState } from '@/components/organisms/EmptyState/EmptyState';
import {
  InvoicesIllustration,
  SearchIllustration,
} from '@/components/organisms/EmptyState/illustrations';
import {
  createFilterStore,
  useFilterFingerprint,
} from '@/lib/useFilterStore';
import { SearchBar } from '@/components/molecules/SearchBar/SearchBar';
import { Select } from '@/components/atoms/Select/Select';

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The workhorse table for FlexPrice list pages. Sortable columns, loading skeletons, empty states, pagination, and row virtualisation (`@tanstack/react-virtual`) for high-cardinality lists.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 max-w-6xl mx-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoiceColumns: DataTableColumn<MockInvoice>[] = [
  { id: 'number', header: 'Invoice', cell: (r) => <span className="font-medium">{r.number}</span>, width: '140px' },
  { id: 'customer', header: 'Customer', cell: (r) => r.customer, sortable: true },
  {
    id: 'amount',
    header: 'Amount',
    cell: (r) => <span className="tabular-nums">{formatCurrency(r.amountCents, r.currency)}</span>,
    align: 'right',
    width: '140px',
    sortable: true,
  },
  { id: 'status', header: 'Status', cell: (r) => <InvoiceStatusBadge status={r.status} />, width: '160px' },
  { id: 'dueDate', header: 'Due', cell: (r) => formatDate(r.dueDate), width: '140px', sortable: true },
];

const SAMPLE = makeMockInvoices(42);

export const Default: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | undefined>({ id: 'dueDate', direction: 'desc' });
    const [page, setPage] = useState(1);
    const sorted = useMemo(() => {
      if (!sort) return SAMPLE;
      const dir = sort.direction === 'asc' ? 1 : -1;
      return [...SAMPLE].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sort.id];
        const bv = (b as Record<string, unknown>)[sort.id];
        return av! > bv! ? dir : av! < bv! ? -dir : 0;
      });
    }, [sort]);
    const pageSize = 10;
    const slice = sorted.slice((page - 1) * pageSize, page * pageSize);
    return (
      <DataTable
        rows={slice}
        columns={invoiceColumns}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
        pagination={{
          page,
          pageSize,
          total: SAMPLE.length,
          onPageChange: setPage,
        }}
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <DataTable rows={[]} columns={invoiceColumns} getRowId={(r) => r.id} loading />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      rows={[]}
      columns={invoiceColumns}
      getRowId={(r) => r.id}
      emptyState={
        <EmptyState
          illustration={<InvoicesIllustration className="h-full w-full" />}
          title="No invoices match your filters"
          description="Try clearing the status filter or expanding the date range."
          primaryAction={{ label: 'Clear filters' }}
          compact
        />
      }
    />
  ),
};

/**
 * Virtualised mode — 10,000 rows. Only the rows in the viewport plus an
 * overscan buffer are mounted, so scrolling stays buttery smooth.
 */
export const Virtualised10kRows: Story = {
  render: () => {
    const rows = useMemo(() => makeMockInvoices(10_000), []);
    return (
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Badge tone="primary">{rows.length.toLocaleString()} rows</Badge>
          <span>Only the visible rows are mounted.</span>
        </div>
        <DataTable
          rows={rows}
          columns={invoiceColumns}
          getRowId={(r) => r.id}
          virtual={{ enabled: true, containerHeight: '560px', estimateRowHeight: 48 }}
        />
      </div>
    );
  },
};

export const CompactDensity: Story = {
  render: () => (
    <DataTable
      rows={SAMPLE.slice(0, 12)}
      columns={invoiceColumns}
      getRowId={(r) => r.id}
      density="compact"
    />
  ),
};

/**
 * **Challenge A demo** — `DataTable` wired up to `useFilterStore`. Filters
 * persist in `sessionStorage` and a shallow fingerprint is written to the
 * URL. Try changing the search/status, then refresh — your filters survive.
 */
type CustomerFilters = {
  q: string;
  status: string;
};

const useCustomerFilters = createFilterStore<CustomerFilters>({
  pageKey: 'storybook-customers',
  defaults: { q: '', status: 'all' },
});

const CUSTOMERS_SAMPLE = makeMockCustomers(120);
const customerColumns: DataTableColumn<(typeof CUSTOMERS_SAMPLE)[number]>[] = [
  { id: 'name', header: 'Name', cell: (r) => <span className="font-medium">{r.name}</span>, sortable: true },
  { id: 'email', header: 'Email', cell: (r) => <span className="text-muted-foreground">{r.email}</span> },
  { id: 'plan', header: 'Plan', cell: (r) => r.plan, width: '160px' },
  {
    id: 'mrr',
    header: 'MRR',
    cell: (r) => <span className="tabular-nums">{formatCurrency(r.mrrCents)}</span>,
    align: 'right',
    width: '120px',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge
        tone={
          r.status === 'active' ? 'success' : r.status === 'trialing' ? 'info' : r.status === 'paused' ? 'warning' : 'muted'
        }
      >
        {r.status}
      </Badge>
    ),
    width: '120px',
  },
];

export const WithFilterStore: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `useFilterStore` (Challenge A): filter state lives in Zustand + sessionStorage, and only an 8-char fingerprint is mirrored to the URL. Refresh the page — your filters come back.',
      },
    },
  },
  render: () => {
    const filters = useCustomerFilters((s) => s.filters);
    const setFilter = useCustomerFilters((s) => s.setFilter);
    const reset = useCustomerFilters((s) => s.resetFilters);
    const fp = useFilterFingerprint(filters);

    const filtered = useMemo(() => {
      const q = filters.q.toLowerCase();
      return CUSTOMERS_SAMPLE.filter(
        (c) =>
          (filters.status === 'all' || c.status === filters.status) &&
          (q === '' || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)),
      );
    }, [filters]);

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            value={filters.q}
            onChange={(v) => setFilter('q', v)}
            placeholder="Search customers…"
          />
          <Select
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'trialing', label: 'Trialing' },
              { value: 'paused', label: 'Paused' },
              { value: 'canceled', label: 'Canceled' },
            ]}
            value={filters.status}
            onChange={(v) => setFilter('status', v)}
            triggerWidth="auto"
          />
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          >
            Reset
          </button>
          <span className="ml-auto text-xs text-muted-foreground font-mono">URL fp: ?f={fp}</span>
        </div>
        <DataTable
          rows={filtered}
          columns={customerColumns}
          getRowId={(r) => r.id}
          emptyState={
            <EmptyState
              illustration={<SearchIllustration className="h-full w-full" />}
              title="No customers match"
              description="Adjust your search or status filter to see customers."
              compact
            />
          }
        />
      </div>
    );
  },
};
