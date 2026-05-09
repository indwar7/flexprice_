import type { Meta, StoryObj } from '@storybook/react';
import { CreditCard } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { formatCompactNumber, formatCurrency } from '@/lib/format';
import { Badge } from '@/components/atoms/Badge/Badge';

const meta = {
  title: 'Molecules/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'KPI card used across the FlexPrice dashboard. Combines a label, a primary value (currency / count / formatted number), and an optional period-over-period trend indicator with up/down arrows.',
      },
    },
  },
  argTypes: {
    higherIsBetter: { control: 'boolean' },
    loading: { control: 'boolean' },
    trendPercent: { control: { type: 'number', min: -100, max: 100, step: 0.5 } },
  },
  args: {
    label: 'MRR',
    value: formatCurrency(124_500_00),
    trendPercent: 12.4,
    trendLabel: 'vs last 30 days',
    higherIsBetter: true,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Negative: Story = {
  args: {
    label: 'Churn rate',
    value: '4.8%',
    trendPercent: 1.2,
    higherIsBetter: false,
  },
};

export const Loading: Story = {
  args: { loading: true, value: '' },
};

export const NoTrend: Story = {
  args: {
    label: 'Active customers',
    value: formatCompactNumber(2843),
    trendPercent: undefined,
    trendLabel: undefined,
    caption: 'across all plans',
  },
};

export const WithAdornment: Story = {
  args: {
    label: 'Outstanding invoices',
    value: formatCurrency(8_320_00),
    trendPercent: -3.1,
    higherIsBetter: false,
    adornment: (
      <Badge tone="warning" size="sm" icon={<CreditCard />}>
        12 open
      </Badge>
    ),
  },
};

export const DashboardRow: StoryObj = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
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
    </div>
  ),
};
