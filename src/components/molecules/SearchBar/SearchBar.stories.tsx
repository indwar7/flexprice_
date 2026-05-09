import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Debounced search input with a clear button. `onDebouncedChange` fires after the user stops typing — ideal for driving server-side filters without flooding the network.',
      },
    },
  },
  argTypes: {
    delayMs: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Search customers…',
    delayMs: 250,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState('');
    return (
      <div className="flex flex-col gap-2">
        <SearchBar {...args} value={v} onChange={setV} />
        <p className="text-xs text-muted-foreground">Live value: {JSON.stringify(v)}</p>
      </div>
    );
  },
};

export const FullWidth: Story = { args: { fullWidth: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'acme' } };

/**
 * Interaction test: typing emits the debounced value once, after the delay.
 */
export const DebounceInteraction: Story = {
  args: {
    delayMs: 100,
    onDebouncedChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'acme', { delay: 10 });
    // Wait for debounce to settle
    await new Promise((r) => setTimeout(r, 200));
    await expect(args.onDebouncedChange).toHaveBeenLastCalledWith('acme');
  },
};
