import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Search } from 'lucide-react';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text/number input with optional label, hint, error message, and addons. The currency-prefix variant is used heavily on plan-pricing forms.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'number', 'email', 'password'] },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Plan name',
    placeholder: 'e.g. Pro Annual',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    label: 'Slug',
    hint: 'Lowercase, no spaces. Used in API requests.',
    placeholder: 'pro-annual',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: 'Enter a valid email address',
    defaultValue: 'not-an-email',
  },
};

export const CurrencyPrefix: Story = {
  args: {
    label: 'Unit price',
    type: 'number',
    leadingAddon: '$',
    trailingAddon: 'USD',
    placeholder: '0.00',
    hint: 'Per unit, in major currency units.',
  },
};

export const SearchInput: Story = {
  args: {
    label: undefined,
    placeholder: 'Search invoices…',
    leadingAddon: <Search className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Pro Annual' },
};

/**
 * Interaction test: typing updates the value.
 */
export const TypeInteraction: Story = {
  args: { label: 'Plan name', placeholder: 'Type here…' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Plan name') as HTMLInputElement;
    await userEvent.type(input, 'Enterprise');
    await expect(input.value).toBe('Enterprise');
  },
};
