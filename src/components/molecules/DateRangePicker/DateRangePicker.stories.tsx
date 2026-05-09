import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker, type DateRange } from './DateRangePicker';

const meta = {
  title: 'Molecules/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Date-range picker used to filter analytics dashboards. Surfaces preset shortcuts (last 7 days, MTD, YTD) plus manual date inputs.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-12 min-h-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<DateRange>({ from: null, to: null });
    return <DateRangePicker value={v} onChange={setV} label="Period" />;
  },
};

export const Preselected: Story = {
  render: () => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 30);
    const [v, setV] = useState<DateRange>({ from: start, to: today });
    return <DateRangePicker value={v} onChange={setV} />;
  },
};

export const Disabled: Story = {
  render: () => (
    <DateRangePicker value={{ from: null, to: null }} onChange={() => {}} disabled />
  ),
};
