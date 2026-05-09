import type { Meta, StoryObj } from '@storybook/react';
import { UsageBar } from './UsageBar';

const meta = {
  title: 'Molecules/UsageBar',
  component: UsageBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Labelled progress bar showing usage vs. entitlement for a billable meter. Color shifts from primary → warning → destructive as the user nears their cap.',
      },
    },
  },
  argTypes: {
    used: { control: { type: 'number', min: 0 } },
    entitled: { control: { type: 'number', min: 0 } },
    warningAt: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
    dangerAt: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
  },
  args: {
    used: 4_120,
    entitled: 10_000,
    label: 'API calls',
    unit: 'calls',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UsageBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = { args: { used: 8_300, entitled: 10_000 } };

export const Danger: Story = { args: { used: 9_700, entitled: 10_000 } };

export const Unlimited: Story = {
  args: { used: 12_400, entitled: null, label: 'Storage', unit: 'GB' },
};

export const Stack: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <UsageBar used={1_240} entitled={10_000} label="API calls" unit="calls" />
      <UsageBar used={48} entitled={50} label="Seats" unit="seats" />
      <UsageBar used={12_400} entitled={null} label="Storage" unit="GB" />
    </div>
  ),
};
