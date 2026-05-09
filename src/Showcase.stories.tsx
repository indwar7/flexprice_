import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  BarChart3,
  Coins,
  FileText,
  LayoutDashboard,
  Package,
  Plus,
  Receipt,
  RefreshCcw,
  Settings,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';
import { Select } from '@/components/atoms/Select/Select';
import { SearchBar } from '@/components/molecules/SearchBar/SearchBar';
import { MetricCard } from '@/components/molecules/MetricCard/MetricCard';
import { InvoiceStatusBadge } from '@/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge';
import { UsageBar } from '@/components/molecules/UsageBar/UsageBar';
import {
  DataTable,
  type DataTableColumn,
  type SortState,
} from '@/components/molecules/DataTable/DataTable';
import {
  makeMockCustomers,
  makeMockInvoices,
  type MockCustomer,
  type MockInvoice,
} from '@/components/molecules/DataTable/mockData';
import { SidebarNav, type SidebarNavSection } from '@/components/organisms/SidebarNav/SidebarNav';
import { EmptyState } from '@/components/organisms/EmptyState/EmptyState';
import { PricingTierTable } from '@/components/organisms/PricingTierTable/PricingTierTable';
import { CustomersIllustration } from '@/components/organisms/EmptyState/illustrations';
import { RevenueTrendCard } from '@/components/dashboard/RevenueTrendCard';
import { InvoiceIssuesCard } from '@/components/dashboard/InvoiceIssuesCard';
import { RecentSubscriptionsCard } from '@/components/dashboard/RecentSubscriptionsCard';
import { formatCurrency, formatCompactNumber, formatDate } from '@/lib/format';

type RouteId =
  | 'dashboard'
  | 'analytics'
  | 'plans'
  | 'customers'
  | 'invoices'
  | 'subscriptions'
  | 'credits';

const ROUTE_LABEL: Record<RouteId, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  plans: 'Plans',
  customers: 'Customers',
  invoices: 'Invoices',
  subscriptions: 'Subscriptions',
  credits: 'Credits',
};

const meta = {
  title: 'Showcase/Dashboard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A composed FlexPrice admin app — every sidebar item routes to a working page (Dashboard, Analytics, Plans, Customers, Invoices, Subscriptions, Credits). Built entirely from this component library.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS: SidebarNavSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
    ],
  },
  {
    heading: 'Billing',
    items: [
      { id: 'plans', label: 'Plans', icon: <Package /> },
      { id: 'customers', label: 'Customers', icon: <Users /> },
      {
        id: 'invoices',
        label: 'Invoices',
        icon: <Receipt />,
        badge: <Badge tone="warning" size="sm">3</Badge>,
      },
      { id: 'subscriptions', label: 'Subscriptions', icon: <RefreshCcw /> },
      { id: 'credits', label: 'Credits', icon: <Coins /> },
    ],
  },
];

const BRAND = (
  <div className="flex items-center gap-2 font-semibold tracking-tight">
    <div
      aria-hidden
      className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center text-[11px] font-bold tracking-[0.04em]"
    >
      FP
    </div>
    <span>FlexPrice</span>
  </div>
);

const FOOTER = (
  <div className="flex items-center gap-2.5 text-sm">
    <div className="h-8 w-8 rounded-full bg-muted text-foreground flex items-center justify-center font-semibold text-xs">
      AI
    </div>
    <div className="flex-1 min-w-0">
      <div className="truncate font-medium">Aseem Indwar</div>
      <div className="truncate text-xs text-sidebar-muted">aseem@flexprice.dev</div>
    </div>
    <button
      type="button"
      className="rounded-md p-1 text-sidebar-muted hover:bg-accent hover:text-sidebar-foreground transition-colors"
      aria-label="Settings"
    >
      <Settings className="h-4 w-4" />
    </button>
  </div>
);

const SAMPLE_INVOICES = makeMockInvoices(50);
const SAMPLE_CUSTOMERS = makeMockCustomers(120);

export const Dashboard: Story = {
  render: () => {
    const [active, setActive] = useState<RouteId>('dashboard');

    return (
      <div className="h-screen flex bg-muted/40">
        <SidebarNav
          brand={BRAND}
          sections={SECTIONS}
          activeId={active}
          onItemClick={(item) => setActive(item.id as RouteId)}
          footer={FOOTER}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-14 flex items-center justify-between gap-4 border-b border-border bg-card px-6 shrink-0">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => setActive('dashboard')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <span className="text-muted-foreground/60">/</span>
              <span className="font-medium text-foreground">{ROUTE_LABEL[active]}</span>
            </nav>
            <div className="flex items-center gap-2">
              <SearchBar placeholder="Search…" className="w-72" />
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-[1280px] mx-auto px-6 py-6">
              {active === 'dashboard' && <DashboardView onNavigate={setActive} />}
              {active === 'analytics' && <AnalyticsView />}
              {active === 'plans' && <PlansView />}
              {active === 'customers' && <CustomersView />}
              {active === 'invoices' && <InvoicesView />}
              {active === 'subscriptions' && <SubscriptionsView />}
              {active === 'credits' && <CreditsView />}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Views                                                              */
/* ------------------------------------------------------------------ */

function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-end gap-3">{actions}</div>}
    </div>
  );
}

/* ----- Dashboard ----- */

function DashboardView({ onNavigate }: { onNavigate?: (route: RouteId) => void } = {}) {
  const [period, setPeriod] = useState('30d');
  const [windowSize, setWindowSize] = useState('day');
  const [sort, setSort] = useState<SortState | undefined>({ id: 'amount', direction: 'desc' });

  const sortedInvoices = useMemo(() => {
    if (!sort) return SAMPLE_INVOICES.slice(0, 6);
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...SAMPLE_INVOICES]
      .sort((a, b) => {
        const av = (a as Record<string, unknown>)[sort.id === 'amount' ? 'amountCents' : sort.id];
        const bv = (b as Record<string, unknown>)[sort.id === 'amount' ? 'amountCents' : sort.id];
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av) > String(bv) ? dir : String(av) < String(bv) ? -dir : 0;
      })
      .slice(0, 6);
  }, [sort]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Snapshot of revenue, subscriptions, and invoice health."
        actions={
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Time period
              </label>
              <div className="w-[152px]">
                <Select
                  options={[
                    { value: '24h', label: 'Last 24 hours' },
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' },
                  ]}
                  value={period}
                  onChange={setPeriod}
                  triggerWidth="full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Window size
              </label>
              <div className="w-[120px]">
                <Select
                  options={[
                    { value: 'hour', label: 'Hour' },
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                  ]}
                  value={windowSize}
                  onChange={setWindowSize}
                  triggerWidth="full"
                />
              </div>
            </div>
          </>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="MRR" value={formatCurrency(124_500_00)} trendPercent={12.4} trendLabel="vs last 30d" />
        <MetricCard
          label="Active subscriptions"
          value={formatCompactNumber(2843)}
          trendPercent={3.2}
          trendLabel="vs last 30d"
        />
        <MetricCard
          label="Churn rate"
          value="4.8%"
          trendPercent={1.2}
          trendLabel="vs last 30d"
          higherIsBetter={false}
        />
        <MetricCard
          label="Outstanding"
          value={formatCurrency(8_320_00)}
          trendPercent={-3.1}
          trendLabel="vs last 30d"
          higherIsBetter={false}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueTrendCard className="lg:col-span-2" />
        <RecentSubscriptionsCard />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Recent invoices</h2>
            <button
              type="button"
              onClick={() => onNavigate?.('invoices')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              View all
            </button>
          </div>
          <DataTable
            rows={sortedInvoices}
            columns={[
              {
                id: 'number',
                header: 'Invoice',
                cell: (r) => <span className="font-medium font-mono text-foreground">{r.number}</span>,
                width: '140px',
              },
              { id: 'customer', header: 'Customer', cell: (r) => r.customer, sortable: true },
              {
                id: 'amount',
                header: 'Amount',
                cell: (r) => (
                  <span className="tabular-nums font-medium">
                    {formatCurrency(r.amountCents, r.currency)}
                  </span>
                ),
                align: 'right',
                width: '140px',
                sortable: true,
              },
              {
                id: 'status',
                header: 'Status',
                cell: (r) => <InvoiceStatusBadge status={r.status} />,
                width: '160px',
              },
            ]}
            getRowId={(r) => r.id}
            sort={sort}
            onSortChange={setSort}
            density="compact"
            onRowClick={() => {}}
          />
        </div>
        <InvoiceIssuesCard onStatusClick={() => onNavigate?.('invoices')} />
      </section>
    </div>
  );
}

/* ----- Analytics (light view: revenue trend + KPIs) ----- */

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Revenue trend, segmentation, and cohort views."
      />
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="ARR" value={formatCurrency(1_494_000_00)} trendPercent={14.2} trendLabel="vs last quarter" />
        <MetricCard label="ARPU" value={formatCurrency(43_80)} trendPercent={2.1} trendLabel="vs last 30d" />
        <MetricCard
          label="LTV / CAC"
          value="4.6x"
          trendPercent={0.4}
          trendLabel="vs last 30d"
        />
      </section>
      <section>
        <RevenueTrendCard />
      </section>
    </div>
  );
}

/* ----- Plans ----- */

function PlansView() {
  const plans = [
    {
      id: 'pl_starter',
      name: 'Starter',
      summary: 'For teams getting started.',
      price: 0,
      activeSubs: 412,
      tone: 'success' as const,
    },
    {
      id: 'pl_growth',
      name: 'Growth',
      summary: 'Scaling teams with usage-based pricing.',
      price: 49_00,
      activeSubs: 1_204,
      tone: 'primary' as const,
    },
    {
      id: 'pl_pro',
      name: 'Pro Annual',
      summary: 'Annual contract with volume discounts.',
      price: 199_00,
      activeSubs: 386,
      tone: 'primary' as const,
    },
    {
      id: 'pl_ent',
      name: 'Enterprise',
      summary: 'Custom pricing, SSO, and SLAs.',
      price: 0,
      activeSubs: 41,
      tone: 'muted' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans"
        subtitle="Define what your customers can subscribe to."
        actions={<Button leadingIcon={<Plus />}>New plan</Button>}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-md border border-border bg-card p-5 shadow-xs flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-foreground tracking-tight">{plan.name}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.summary}</p>
              </div>
              <Badge tone={plan.tone} size="sm">Active</Badge>
            </div>
            <div className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              {plan.price === 0 && plan.id === 'pl_starter' ? 'Free' : plan.price === 0 ? 'Custom' : formatCurrency(plan.price) + '/mo'}
            </div>
            <div className="text-xs text-muted-foreground tabular-nums">
              {plan.activeSubs.toLocaleString()} active subscriptions
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">Growth plan · graduated pricing</h2>
        <PricingTierTable
          tiers={[
            { upTo: 1_000, unitAmount: 0 },
            { upTo: 10_000, unitAmount: 2 },
            { upTo: 100_000, unitAmount: 1 },
            { upTo: 'inf', unitAmount: 0.5, flatAmount: 50_00 },
          ]}
          unit="API call"
          mode="graduated"
        />
      </section>
    </div>
  );
}

/* ----- Customers ----- */

function CustomersView() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const rows = useMemo(() => {
    const lower = q.toLowerCase();
    return SAMPLE_CUSTOMERS.filter(
      (c) =>
        (status === 'all' || c.status === status) &&
        (lower === '' || c.name.toLowerCase().includes(lower) || c.email.toLowerCase().includes(lower)),
    ).slice(0, 25);
  }, [q, status]);

  const columns: DataTableColumn<MockCustomer>[] = [
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
            r.status === 'active'
              ? 'success'
              : r.status === 'trialing'
                ? 'info'
                : r.status === 'paused'
                  ? 'warning'
                  : 'muted'
          }
        >
          {r.status}
        </Badge>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle={`${SAMPLE_CUSTOMERS.length.toLocaleString()} customers · usage-based billing`}
        actions={<Button leadingIcon={<Plus />}>Add customer</Button>}
      />

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={q} onChange={setQ} placeholder="Search customers…" />
        <div className="w-[180px]">
          <Select
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'trialing', label: 'Trialing' },
              { value: 'paused', label: 'Paused' },
              { value: 'canceled', label: 'Canceled' },
            ]}
            value={status}
            onChange={setStatus}
            triggerWidth="full"
          />
        </div>
        {(q || status !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              setStatus('all');
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        emptyState={
          <EmptyState
            illustration={<CustomersIllustration className="h-full w-full" />}
            title="No customers match"
            description="Adjust your search or status filter to see customers."
            compact
          />
        }
      />
    </div>
  );
}

/* ----- Invoices ----- */

function InvoicesView() {
  const [sort, setSort] = useState<SortState | undefined>({ id: 'dueDate', direction: 'desc' });
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const sorted = useMemo(() => {
    if (!sort) return SAMPLE_INVOICES;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...SAMPLE_INVOICES].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.id === 'amount' ? 'amountCents' : sort.id];
      const bv = (b as Record<string, unknown>)[sort.id === 'amount' ? 'amountCents' : sort.id];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av) > String(bv) ? dir : String(av) < String(bv) ? -dir : 0;
    });
  }, [sort]);
  const slice = sorted.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<MockInvoice>[] = [
    {
      id: 'number',
      header: 'Invoice',
      cell: (r) => <span className="font-medium font-mono text-foreground">{r.number}</span>,
      width: '140px',
    },
    { id: 'customer', header: 'Customer', cell: (r) => r.customer, sortable: true },
    {
      id: 'amount',
      header: 'Amount',
      cell: (r) => (
        <span className="tabular-nums font-medium">{formatCurrency(r.amountCents, r.currency)}</span>
      ),
      align: 'right',
      width: '140px',
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (r) => <InvoiceStatusBadge status={r.status} />,
      width: '160px',
    },
    {
      id: 'dueDate',
      header: 'Due',
      cell: (r) => formatDate(r.dueDate),
      width: '140px',
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Every settled and pending invoice."
        actions={<Button leadingIcon={<FileText />}>Export</Button>}
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Outstanding" value={formatCurrency(8_320_00)} trendPercent={-3.1} higherIsBetter={false} />
        <MetricCard label="Paid (30d)" value={formatCurrency(142_300_00)} trendPercent={8.4} />
        <MetricCard label="Past due" value="11" trendPercent={4.2} higherIsBetter={false} />
      </section>

      <DataTable
        rows={slice}
        columns={columns}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
        pagination={{ page, pageSize, total: SAMPLE_INVOICES.length, onPageChange: setPage }}
      />
    </div>
  );
}

/* ----- Subscriptions ----- */

function SubscriptionsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        subtitle="Active customer subscriptions and their entitlements."
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentSubscriptionsCard />

        <div className="lg:col-span-2 rounded-md border border-border bg-card shadow-xs flex flex-col">
          <header className="px-5 pt-4 pb-3">
            <h2 className="text-sm font-semibold tracking-tight">Acme Industries · Growth plan</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Period: Apr 1 – 30, 2026</p>
          </header>
          <div className="px-5 pb-5 flex flex-col gap-4">
            <UsageBar used={1_240_000} entitled={5_000_000} label="API calls" unit="calls" />
            <UsageBar used={48} entitled={50} label="Seats" unit="seats" />
            <UsageBar used={9_700} entitled={10_000} label="SMS messages" unit="msgs" />
            <UsageBar used={12_400} entitled={null} label="Storage" unit="GB" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----- Credits ----- */

function CreditsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Credits"
        subtitle="Promotional and prepaid credit balances per customer."
        actions={<Button leadingIcon={<Plus />}>Issue credit</Button>}
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Outstanding credit" value={formatCurrency(34_500_00)} caption="across 142 customers" />
        <MetricCard label="Issued (30d)" value={formatCurrency(12_300_00)} trendPercent={6.4} />
        <MetricCard label="Redeemed (30d)" value={formatCurrency(8_120_00)} trendPercent={2.1} />
      </section>

      <div className="rounded-md border border-border bg-card shadow-xs">
        <EmptyState
          illustration={<CustomersIllustration className="h-full w-full" />}
          title="No credit grants in this period"
          description="Issue your first credit to start tracking promotional balances."
          primaryAction={{ label: 'Issue credit' }}
        />
      </div>
    </div>
  );
}
