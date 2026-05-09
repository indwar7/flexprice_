import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Inbox, FileText, Users } from 'lucide-react';
import { EmptyState } from './EmptyState';
import {
  CustomersIllustration,
  InvoicesIllustration,
  PlansIllustration,
  SearchIllustration,
} from './illustrations';

const meta = {
  title: 'Organisms/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Full-block empty state used on list pages when a customer has no plans, no invoices, no customers yet. Combines a custom SVG illustration (or icon), headline, supporting copy, and one or two CTAs.',
      },
    },
  },
  argTypes: {
    compact: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-[640px] rounded-md border border-border bg-card shadow-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoInvoices: Story = {
  args: {
    illustration: <InvoicesIllustration className="h-full w-full" />,
    title: 'No invoices yet',
    description:
      'Invoices will appear here once your customers start being billed against their subscriptions.',
    primaryAction: { label: 'Create test invoice', onClick: fn() },
    secondaryAction: { label: 'Read the docs', href: '#' },
  },
};

export const NoCustomers: Story = {
  args: {
    illustration: <CustomersIllustration className="h-full w-full" />,
    title: 'No customers yet',
    description: 'Add your first customer to start creating subscriptions and tracking usage.',
    primaryAction: { label: 'Add customer', onClick: fn() },
  },
};

export const NoPlans: Story = {
  args: {
    illustration: <PlansIllustration className="h-full w-full" />,
    title: 'No plans configured',
    description:
      'Plans define what your customers can subscribe to. Start with a simple monthly plan or import from Stripe.',
    primaryAction: { label: 'Create plan', onClick: fn() },
    secondaryAction: { label: 'Import from Stripe', onClick: fn() },
  },
};

export const Filtered: Story = {
  args: {
    illustration: <SearchIllustration className="h-full w-full" />,
    title: 'No results match your filters',
    description: 'Try clearing the status filter or expanding the date range.',
    primaryAction: { label: 'Clear filters', onClick: fn() },
    compact: true,
  },
};

export const IconFallback: Story = {
  args: {
    icon: <Inbox />,
    title: 'Inbox is empty',
    description: 'No new notifications. We will let you know when something needs your attention.',
  },
};

export const IconWithCTA: Story = {
  args: {
    icon: <Users />,
    title: 'Invite your team',
    description: 'Bring your team into FlexPrice to manage plans and customers together.',
    primaryAction: { label: 'Invite teammates', onClick: fn() },
  },
};

export const InvoicesIcon: Story = {
  args: {
    icon: <FileText />,
    title: 'Nothing here yet',
  },
};
