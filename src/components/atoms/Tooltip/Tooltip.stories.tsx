import type { Meta, StoryObj } from '@storybook/react';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/atoms/Button/Button';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Lightweight informational tooltip. Hover or focus the trigger to open after `delayMs`. Used to surface metric definitions, keyboard shortcuts, and extra context in tight UIs.',
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    delayMs: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
  },
  args: {
    content: 'Total revenue from settled invoices in the period.',
    side: 'top',
    delayMs: 200,
  },
  decorators: [
    (Story) => (
      <div className="p-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  ),
};

export const OnIcon: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        aria-label="More info"
      >
        <Info className="h-4 w-4" />
      </button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-12 p-8">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`Tooltip on ${side}`}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
