import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  RefreshCcw,
  Coins,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { Badge } from '@/components/atoms/Badge/Badge';

const meta = {
  title: 'Organisms/SidebarNav',
  component: SidebarNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main sidebar navigation rail used by the FlexPrice admin app. Collapses to icon-only mode (with tooltips), supports multiple sections, and highlights the active route.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex bg-background">
        <Story />
        <main className="flex-1 p-8">
          <div className="text-sm text-muted-foreground">Content area</div>
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
    ],
  },
  {
    heading: 'Billing',
    items: [
      { id: 'plans', label: 'Plans', icon: <Package /> },
      { id: 'customers', label: 'Customers', icon: <Users /> },
      {
        id: 'invoices',
        label: 'Invoices',
        icon: <Receipt />,
        badge: <Badge tone="warning" size="sm">3</Badge>,
      },
      { id: 'subscriptions', label: 'Subscriptions', icon: <RefreshCcw /> },
      { id: 'credits', label: 'Credits', icon: <Coins /> },
    ],
  },
];

const FOOTER = (
  <div className="flex items-center gap-2 text-sm">
    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
      AI
    </div>
    <div className="flex-1 min-w-0">
      <div className="truncate font-medium">Aseem</div>
      <div className="truncate text-xs text-muted-foreground">aseem@flexprice.dev</div>
    </div>
    <Settings className="h-4 w-4 text-muted-foreground" />
  </div>
);

const BRAND = (
  <div className="flex items-center gap-2 font-semibold tracking-tight">
    <div
      aria-hidden
      className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center text-[11px] font-bold tracking-[0.04em]"
    >
      FP
    </div>
    <span>FlexPrice</span>
  </div>
);

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('plans');
    return (
      <SidebarNav
        brand={BRAND}
        sections={SECTIONS}
        activeId={active}
        onItemClick={(item) => setActive(item.id)}
        footer={FOOTER}
      />
    );
  },
};

export const Collapsed: Story = {
  render: () => {
    const [active, setActive] = useState('invoices');
    return (
      <SidebarNav
        brand={BRAND}
        sections={SECTIONS}
        activeId={active}
        onItemClick={(item) => setActive(item.id)}
        footer={
          <div className="flex justify-center">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        }
        defaultCollapsed
      />
    );
  },
};
