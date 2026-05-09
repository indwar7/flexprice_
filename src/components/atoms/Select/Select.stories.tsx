import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Select } from './Select';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active', description: 'Customer is being billed' },
  { value: 'trialing', label: 'Trialing' },
  { value: 'paused', label: 'Paused' },
  { value: 'canceled', label: 'Canceled' },
];

const meta = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Single-select dropdown with optional search. Keyboard accessible (↑/↓/Enter/Esc). Use the searchable variant for long option lists like customers or plans.',
      },
    },
  },
  args: {
    options: STATUS_OPTIONS,
    placeholder: 'Pick a status',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState<string | undefined>(undefined);
    return <Select {...args} value={v} onChange={setV} />;
  },
};

export const WithLabel: Story = {
  args: { label: 'Subscription status' },
  render: (args) => {
    const [v, setV] = useState<string | undefined>('active');
    return <Select {...args} value={v} onChange={setV} />;
  },
};

export const Searchable: Story = {
  args: { searchable: true },
  render: (args) => {
    const [v, setV] = useState<string | undefined>(undefined);
    return <Select {...args} value={v} onChange={setV} />;
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Interaction test: opening the menu and choosing an option calls onChange.
 */
export const SelectInteraction: Story = {
  render: (args) => {
    const [v, setV] = useState<string | undefined>(undefined);
    return (
      <div data-value={v ?? ''}>
        <Select {...args} value={v} onChange={setV} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
    const option = await canvas.findByRole('option', { name: /trialing/i });
    await userEvent.click(option);
    await expect(canvas.getByRole('button')).toHaveTextContent(/trialing/i);
  },
};
