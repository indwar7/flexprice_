import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react';
import { flexpriceTheme, flexpriceDarkTheme } from './theme';
import '../src/styles/globals.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark';
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    document.body.style.background =
      theme === 'dark' ? 'hsl(222 47% 6%)' : 'hsl(210 40% 98%)';
  }, [theme]);
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    backgrounds: { disable: true },
    layout: 'centered',
    docs: {
      toc: true,
      theme: flexpriceTheme,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Showcase',
          'Atoms',
          ['Button', 'Badge', 'Input', 'Select', 'Tooltip', 'Spinner'],
          'Molecules',
          ['MetricCard', 'InvoiceStatusBadge', 'UsageBar', 'SearchBar', 'DateRangePicker', 'DataTable'],
          'Organisms',
          'Lib',
        ],
      },
    },
  },
  tags: ['autodocs'],
};

// Re-export for typed access if needed
export { flexpriceTheme, flexpriceDarkTheme };
export default preview;
