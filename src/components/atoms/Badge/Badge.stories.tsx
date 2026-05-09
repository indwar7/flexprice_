import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small label used for plan status (active, archived), invoice status (paid, draft, void), counts, and tags. Pair with `InvoiceStatusBadge` for status-specific helpers.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['success', 'warning', 'danger', 'info', 'muted', 'primary'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    soft: { control: 'boolean' },
  },
  args: {
    children: 'Active',
    tone: 'success',
    size: 'md',
    soft: true,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge {...args} tone="success">
        Active
      </Badge>
      <Badge {...args} tone="warning">
        Past Due
      </Badge>
      <Badge {...args} tone="danger">
        Failed
      </Badge>
      <Badge {...args} tone="info">
        Open
      </Badge>
      <Badge {...args} tone="primary">
        New
      </Badge>
      <Badge {...args} tone="muted">
        Archived
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    icon: <CheckCircle2 />,
    children: 'Paid',
    tone: 'success',
  },
};

export const Solid: Story = {
  args: { soft: false, tone: 'danger', children: 'Critical' },
};

export const SizeComparison: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
    </div>
  ),
};

export const StatusCluster: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge tone="success" icon={<CheckCircle2 />}>
        Paid
      </Badge>
      <Badge tone="warning" icon={<AlertCircle />}>
        Past Due
      </Badge>
      <Badge tone="muted">Draft</Badge>
    </div>
  ),
};
