import type { Meta, StoryObj } from '@storybook/react';
import { PricingTierTable } from './PricingTierTable';

const meta = {
  title: 'Organisms/PricingTierTable',
  component: PricingTierTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays a tiered or graduated pricing schedule. Used on the plan-detail page and on the public pricing page.',
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['graduated', 'volume'] },
    currency: { control: 'text' },
  },
  args: {
    mode: 'graduated',
    currency: 'USD',
    unit: 'API call',
    tiers: [
      { upTo: 1_000, unitAmount: 0 },
      { upTo: 10_000, unitAmount: 2 },
      { upTo: 100_000, unitAmount: 1 },
      { upTo: 'inf', unitAmount: 0.5, flatAmount: 50_00 },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingTierTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Graduated: Story = {};

export const Volume: Story = { args: { mode: 'volume' } };

export const SeatBased: Story = {
  args: {
    unit: 'seat',
    tiers: [
      { upTo: 5, unitAmount: 25_00 },
      { upTo: 25, unitAmount: 20_00 },
      { upTo: 100, unitAmount: 15_00 },
      { upTo: 'inf', unitAmount: 10_00 },
    ],
  },
};
