import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState, Spinner } from './Spinner';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const FullLoadingState: StoryObj = {
  render: () => (
    <div className="w-80 rounded-lg border border-border bg-card">
      <LoadingState label="Fetching invoices…" />
    </div>
  ),
};
