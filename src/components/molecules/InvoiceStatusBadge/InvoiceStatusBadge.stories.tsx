import type { Meta, StoryObj } from '@storybook/react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import type { InvoiceStatus } from '@/lib/status';

const meta = {
  title: 'Molecules/InvoiceStatusBadge',
  component: InvoiceStatusBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Maps a raw invoice status string to a coloured chip with a matching icon. The single source of truth for invoice status presentation across FlexPrice.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['paid', 'draft', 'open', 'void', 'uncollectible', 'past_due'] satisfies InvoiceStatus[],
    },
    hideIcon: { control: 'boolean' },
  },
  args: { status: 'paid' },
} satisfies Meta<typeof InvoiceStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paid: Story = { args: { status: 'paid' } };
export const Open: Story = { args: { status: 'open' } };
export const Draft: Story = { args: { status: 'draft' } };
export const PastDue: Story = { args: { status: 'past_due' } };
export const Void: Story = { args: { status: 'void' } };
export const Uncollectible: Story = { args: { status: 'uncollectible' } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      {(['paid', 'open', 'past_due', 'draft', 'void', 'uncollectible'] as InvoiceStatus[]).map((s) => (
        <InvoiceStatusBadge key={s} status={s} />
      ))}
    </div>
  ),
};
