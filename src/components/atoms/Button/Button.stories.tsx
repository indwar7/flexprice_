import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Primary action element used across FlexPrice. Variants cover primary CTAs, secondary actions, ghost (low-emphasis), and destructive intents. Sizes follow an 8-px grid.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Save plan',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const Danger: Story = {
  args: { variant: 'danger', children: 'Archive plan' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    leadingIcon: <Plus />,
    trailingIcon: <ArrowRight />,
    children: 'New plan',
  },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Interaction test: clicking fires the handler exactly once.
 */
export const ClickInteraction: Story = {
  args: {
    children: 'Click me',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /click me/i });
    await userEvent.click(btn);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/**
 * Interaction test: a loading button must be `aria-busy` and reject clicks.
 */
export const LoadingDoesNotFire: Story = {
  args: {
    loading: true,
    children: 'Working…',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button');
    await expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
