import { create } from '@storybook/theming';

/**
 * Custom Storybook chrome — matches the FlexPrice brand:
 * near-black primary, blue accent (#3293D9), Geist typography.
 */
export const flexpriceTheme = create({
  base: 'light',
  brandTitle: 'FlexPrice · Component Library',
  brandUrl: 'https://flexprice.io',
  brandTarget: '_blank',
  brandImage: undefined, // brandTitle is rendered as text + logo in manager-head

  // Color palette
  colorPrimary: '#0F172A',  // near-black (matches --foreground)
  colorSecondary: '#3293D9', // brand blue

  // UI surfaces
  appBg: '#F8FAFC',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E2E8F0',
  appBorderRadius: 6,

  // Text
  textColor: '#0F172A',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#64748B',

  // Toolbar
  barTextColor: '#64748B',
  barSelectedColor: '#3293D9',
  barHoverColor: '#3293D9',
  barBg: '#FFFFFF',

  // Form fields
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputTextColor: '#0F172A',
  inputBorderRadius: 6,

  fontBase: '"Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
});

export const flexpriceDarkTheme = create({
  base: 'dark',
  brandTitle: 'FlexPrice · Component Library',
  brandUrl: 'https://flexprice.io',
  brandTarget: '_blank',

  colorPrimary: '#F8FAFC',
  colorSecondary: '#5BB0E8',

  appBg: '#0A0F1C',
  appContentBg: '#0F172A',
  appPreviewBg: '#0F172A',
  appBorderColor: '#1E293B',
  appBorderRadius: 6,

  textColor: '#F8FAFC',
  textInverseColor: '#0F172A',
  textMutedColor: '#94A3B8',

  barTextColor: '#94A3B8',
  barSelectedColor: '#5BB0E8',
  barHoverColor: '#5BB0E8',
  barBg: '#0F172A',

  inputBg: '#0F172A',
  inputBorder: '#1E293B',
  inputTextColor: '#F8FAFC',
  inputBorderRadius: 6,

  fontBase: '"Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
});
